import {
  getDB,
  saveDB,
  getPatches,
  getEvents,
  getChampions,
  getItems,
  getBuilds,
} from "./storage";
import type { Patch, Event, Champion, Item, Build } from "./storage";
import {
  PatchSchema,
  EventSchema,
  ChampionSchema,
  ItemSchema,
  BuildSchema,
  DataJsonSchema,
} from "./validation";

export type PatchEntry = Patch;
export type EventEntry = Event;
export type ChampionEntry = Champion;
export type ItemEntry = Item;
export type BuildEntry = Build;

export interface PatchUpdateEntry {
  id: number;
  patchVersion: string;
  category: string;
  name: string;
  changeType: string;
  description: string;
  imageUrl: string;
  fechaRegistro: string;
}

export interface PatchSummary {
  id: number;
  title: string;
  version: string;
  date: string;
  type: string;
  image: string;
}

const DEFAULT_EVENTS: Event[] = [
  { id: 1, date: "2026-04-10", title: "Patch 7.1 – Rune Overhaul", type: "Parche", color: "#5B21B6", description: "Gran parche con cambios al sistema de runas y balance de campeones." },
  { id: 2, date: "2026-04-15", title: "Wild Rift Open Tournament", type: "Torneo", color: "#EAB308", description: "Torneo abierto con $50,000 USD en premios. Inscríbete antes del 10 de Abril." },
  { id: 3, date: "2026-04-17", title: "Rotación de Tienda", type: "Rotación", color: "#3B82F6", description: "Nueva rotación de skins y campeones en la tienda semanal." },
  { id: 4, date: "2026-04-22", title: "Fin de Semana XP Doble", type: "Evento", color: "#22C55E", description: "Gana el doble de XP en todas tus partidas durante el fin de semana." },
  { id: 5, date: "2026-04-28", title: "Patch 7.2 Preview", type: "Preview", color: "#6B7280", description: "Notas previas del Patch 7.2. Conoce los cambios antes de que lleguen." },
  { id: 6, date: "2026-05-01", title: "Mid-Split Temporada 7", type: "Temporada", color: "#F97316", description: "Comienza la segunda mitad de la Temporada 7. Nuevas misiones y recompensas." },
  { id: 7, date: "2026-05-12", title: "Patch 7.2 Release", type: "Parche", color: "#5B21B6", description: "Lanzamiento del Patch 7.2 con nuevos ajustes de balance y contenido." },
  { id: 8, date: "2026-04-05", title: "Login Diario Especial", type: "Evento", color: "#22C55E", description: "Recompensa especial de inicio de sesión por el comienzo de la semana." },
];

type ContentKey = "patches" | "events" | "champions" | "items" | "builds";

interface ContentMap {
  patches: PatchEntry;
  events: EventEntry;
  champions: ChampionEntry;
  items: ItemEntry;
  builds: BuildEntry;
}

function getNextId<T extends { id: number }>(items: T[]): number {
  return items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
}

type ContentItem<K extends ContentKey> = ContentMap[K] & { id: number };

type AnyContentItem = Patch | Event | Champion | Item | Build;

function getSection<K extends ContentKey>(db: ReturnType<typeof getDB>, type: K): AnyContentItem[] {
  switch (type) {
    case "patches":
      return db.patches;
    case "events":
      return db.events;
    case "champions":
      return db.champions;
    case "items":
      return db.items;
    case "builds":
      return db.builds;
  }
}

function parseContent<K extends ContentKey>(type: K, item: ContentMap[K]): ContentMap[K] {
  switch (type) {
    case "patches":
      return PatchSchema.parse(item) as ContentMap[K];
    case "events":
      return EventSchema.parse(item) as ContentMap[K];
    case "champions":
      return ChampionSchema.parse(item) as ContentMap[K];
    case "items":
      return ItemSchema.parse(item) as ContentMap[K];
    case "builds":
      return BuildSchema.parse(item) as ContentMap[K];
  }
}

export function fetchPatches(): PatchEntry[] {
  return getPatches();
}

export function fetchEvents(): EventEntry[] {
  const events = getEvents();
  return events.length > 0 ? events : DEFAULT_EVENTS;
}

export function fetchChampions(): ChampionEntry[] {
  return getChampions();
}

export function fetchItems(): ItemEntry[] {
  return getItems();
}

export function fetchBuilds(): BuildEntry[] {
  return getBuilds();
}

export function addContent<K extends ContentKey>(
  type: K,
  data: Omit<ContentMap[K], "id">
): Promise<{ id: number }> {
  const db = getDB();
  const arr = getSection(db, type);
  const id = getNextId(arr);
  try {
    const item = parseContent(type, { ...data, id } as ContentMap[K]);
    arr.unshift(item as ContentItem<K>);
    saveDB(db);
    return Promise.resolve({ id });
  } catch (err) {
    return Promise.reject(err instanceof Error ? err : new Error("Datos inválidos."));
  }
}

export function updateContent<K extends ContentKey>(
  type: K,
  id: number,
  data: Partial<ContentMap[K]>
): Promise<void> {
  const db = getDB();
  const arr = getSection(db, type);
  const idx = arr.findIndex((item) => item.id === id);
  if (idx === -1) return Promise.resolve();
  try {
    const merged = { ...arr[idx], ...data } as ContentMap[K] & { id: number };
    arr[idx] = parseContent(type, merged) as ContentItem<K>;
  } catch (err) {
    return Promise.reject(err instanceof Error ? err : new Error("Datos inválidos."));
  }
  saveDB(db);
  return Promise.resolve();
}

export function deleteContent<K extends ContentKey>(type: K, id: number): Promise<void> {
  const db = getDB();
  const arr = getSection(db, type);
  const idx = arr.findIndex((item) => item.id === id);
  if (idx !== -1) {
    arr.splice(idx, 1);
    saveDB(db);
  }
  return Promise.resolve();
}

export async function seedContent<K extends ContentKey>(type: K): Promise<void> {
  const db = getDB();
  if (type === "events") {
    db.events = [...DEFAULT_EVENTS];
    saveDB(db);
    return;
  }
  try {
    const res = await fetch("/data.json", { cache: "no-cache" });
    if (res.ok) {
      const parsed = DataJsonSchema.safeParse(await res.json());
      if (parsed.success) {
        const source = parsed.data;
        const arr = getSection(db, type);
        arr.length = 0;
        switch (type) {
          case "patches":
            arr.push(...source.patches);
            break;
          case "champions":
            arr.push(...source.champions);
            break;
          case "items":
            arr.push(...source.items);
            break;
          case "builds":
            arr.push(...source.builds);
            break;
        }
        saveDB(db);
        return;
      }
    }
  } catch {
  }
  const arr = getSection(db, type);
  arr.length = 0;
  saveDB(db);
}

export function fetchLatestPatchVersion(): Promise<string> {
  const patches = fetchPatches();
  return Promise.resolve(patches[0]?.version ?? "0.0");
}

export function fetchPatchUpdates(): Promise<PatchUpdateEntry[]> {
  return Promise.resolve([]);
}
