import {
  getAllRewards,
  getChallenges,
  getRedemptions,
  getUsers,
  getUserById,
  getDB,
  saveDB,
} from "./storage";

export interface PatchEntry {
  id: number;
  title: string;
  version: string;
  summary: string;
  date: string;
  type: string;
  image: string;
  image_url?: string;
}

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

export interface EventEntry {
  id: number;
  title: string;
  date: string;
  type: string;
  color: string;
  description: string;
}

export interface ChampionEntry {
  id: number;
  name: string;
  role: string;
  tier: string;
  winrate: number;
  pickrate: number;
  banrate: number;
  icon: string;
  image_url?: string;
}

export interface ItemEntry {
  id: number;
  name: string;
  role: string;
  tier: string;
  winrate: number;
  usage: number;
  type: string;
  color: string;
}

export interface BuildEntry {
  id: number;
  champion: string;
  role: string;
  winrate: number;
  items: string[];
}

const CONTENT_KEY = "wildside_content";

function getDefaultContent() {
  return {
    patches: [
      { id: 1, title: "Patch 7.1 – Rune Overhaul", summary: "Grandes cambios al sistema de runas. Electrocute y Conquerer reciben ajustes de balance significativos. Nuevas runas de Sorcery disponibles.", date: "2026-04-01", version: "7.1", type: "Parche", image: "gradient-purple", image_url: "" },
      { id: 2, title: "Patch 6.5 – Balance Changes", summary: "Nerf a Jinx y Ahri. Buff a Malphite y Blitzcrank. Ajustes de items para la jungla.", date: "2026-03-15", version: "6.5", type: "Parche", image: "gradient-blue", image_url: "" },
      { id: 3, title: "Temporada 7 Arranca", summary: "Comienza la nueva temporada ranked. Nuevas recompensas, nuevo emblema de Challenger, y cambios al sistema de LP.", date: "2026-03-01", version: "7.0", type: "Temporada", image: "gradient-gold", image_url: "" },
      { id: 4, title: "Nuevo Campeón: Briar", summary: "Briar llega a Wild Rift. La cazadora de sangre trae un kit único con mecánicas de rampageo y gestión de recursos.", date: "2026-02-20", version: "6.4b", type: "Campeón", image: "gradient-red", image_url: "" },
      { id: 5, title: "Evento: Festival del Dragón", summary: "Misiones especiales, skins temáticas y el regreso del modo ARAM en el Puente del matadragones.", date: "2026-02-10", version: "6.4", type: "Evento", image: "gradient-orange", image_url: "" },
      { id: 6, title: "Patch 6.4 – Artículo Épico", summary: "Trinity Force regresa con estadísticas mejoradas. Nuevos items de soporte para encantadores. Ajustes al Núcleo Abisal.", date: "2026-02-01", version: "6.4", type: "Parche", image: "gradient-teal", image_url: "" },
      { id: 7, title: "Wild Rift Open Finals", summary: "El torneo más grande de la historia de Wild Rift. 16 equipos compiten por $500,000 USD en premios.", date: "2026-01-25", version: "6.3b", type: "Torneo", image: "gradient-yellow", image_url: "" },
      { id: 8, title: "Patch 6.3 – Jungla Reimaginada", summary: "Cambios fundamentales a la jungla. Nuevos objetivos neutrales, timers ajustados y buffs para campeones de clear lento.", date: "2026-01-15", version: "6.3", type: "Parche", image: "gradient-green", image_url: "" },
    ],
    events: [
      { id: 1, date: "2026-04-10", title: "Patch 7.1 – Rune Overhaul", type: "Parche", color: "#5B21B6", description: "Gran parche con cambios al sistema de runas y balance de campeones." },
      { id: 2, date: "2026-04-15", title: "Wild Rift Open Tournament", type: "Torneo", color: "#EAB308", description: "Torneo abierto con $50,000 USD en premios. Inscríbete antes del 10 de Abril." },
      { id: 3, date: "2026-04-17", title: "Rotación de Tienda", type: "Rotación", color: "#3B82F6", description: "Nueva rotación de skins y campeones en la tienda semanal." },
      { id: 4, date: "2026-04-22", title: "Fin de Semana XP Doble", type: "Evento", color: "#22C55E", description: "Gana el doble de XP en todas tus partidas durante el fin de semana." },
      { id: 5, date: "2026-04-28", title: "Patch 7.2 Preview", type: "Preview", color: "#6B7280", description: "Notas previas del Patch 7.2. Conoce los cambios antes de que lleguen." },
      { id: 6, date: "2026-05-01", title: "Mid-Split Temporada 7", type: "Temporada", color: "#F97316", description: "Comienza la segunda mitad de la Temporada 7. Nuevas misiones y recompensas." },
      { id: 7, date: "2026-05-12", title: "Patch 7.2 Release", type: "Parche", color: "#5B21B6", description: "Lanzamiento del Patch 7.2 con nuevos ajustes de balance y contenido." },
      { id: 8, date: "2026-04-05", title: "Login Diario Especial", type: "Evento", color: "#22C55E", description: "Recompensa especial de inicio de sesión por el comienzo de la semana." },
    ],
    champions: [
      { id: 1, name: "Jinx", role: "Cazador", tier: "S+", winrate: 54.2, pickrate: 18.3, banrate: 22.1, icon: "JX", image_url: "" },
      { id: 2, name: "Ahri", role: "Mid", tier: "S+", winrate: 53.8, pickrate: 16.7, banrate: 18.5, icon: "AH", image_url: "" },
      { id: 3, name: "Lee Sin", role: "Jungla", tier: "S", winrate: 51.4, pickrate: 22.1, banrate: 14.3, icon: "LS", image_url: "" },
      { id: 4, name: "Yasuo", role: "Mid", tier: "S", winrate: 50.9, pickrate: 19.8, banrate: 31.2, icon: "YS", image_url: "" },
      { id: 5, name: "Lux", role: "Support", tier: "S", winrate: 52.3, pickrate: 15.6, banrate: 8.7, icon: "LX", image_url: "" },
      { id: 6, name: "Blitzcrank", role: "Support", tier: "S", winrate: 51.7, pickrate: 13.4, banrate: 25.8, icon: "BL", image_url: "" },
      { id: 7, name: "Vayne", role: "Cazador", tier: "A", winrate: 49.8, pickrate: 14.2, banrate: 11.3, icon: "VY", image_url: "" },
      { id: 8, name: "Orianna", role: "Mid", tier: "A", winrate: 50.1, pickrate: 11.9, banrate: 5.2, icon: "OR", image_url: "" },
      { id: 9, name: "Jarvan IV", role: "Jungla", tier: "A", winrate: 50.6, pickrate: 12.8, banrate: 6.4, icon: "J4", image_url: "" },
      { id: 10, name: "Xin Zhao", role: "Jungla", tier: "A", winrate: 51.2, pickrate: 10.5, banrate: 4.1, icon: "XZ", image_url: "" },
      { id: 11, name: "Corki", role: "Mid", tier: "A", winrate: 49.4, pickrate: 9.8, banrate: 3.7, icon: "CK", image_url: "" },
      { id: 12, name: "Ezreal", role: "Cazador", tier: "A", winrate: 48.9, pickrate: 17.4, banrate: 7.2, icon: "EZ", image_url: "" },
      { id: 13, name: "Katarina", role: "Mid", tier: "B", winrate: 48.5, pickrate: 10.1, banrate: 12.4, icon: "KT", image_url: "" },
      { id: 14, name: "Leona", role: "Support", tier: "B", winrate: 49.1, pickrate: 11.2, banrate: 4.8, icon: "LN", image_url: "" },
      { id: 15, name: "Thresh", role: "Support", tier: "B", winrate: 48.7, pickrate: 9.6, banrate: 6.1, icon: "TR", image_url: "" },
      { id: 16, name: "Kai'Sa", role: "Cazador", tier: "B", winrate: 48.2, pickrate: 14.8, banrate: 5.9, icon: "KS", image_url: "" },
      { id: 17, name: "Zed", role: "Mid", tier: "B", winrate: 47.9, pickrate: 13.5, banrate: 18.7, icon: "ZD", image_url: "" },
      { id: 18, name: "Sett", role: "Baron", tier: "B", winrate: 49.3, pickrate: 10.7, banrate: 7.3, icon: "ST", image_url: "" },
      { id: 19, name: "Akali", role: "Mid", tier: "C", winrate: 47.1, pickrate: 12.3, banrate: 9.8, icon: "AK", image_url: "" },
      { id: 20, name: "Twisted Fate", role: "Mid", tier: "C", winrate: 46.8, pickrate: 8.4, banrate: 2.9, icon: "TF", image_url: "" },
      { id: 21, name: "Caitlyn", role: "Cazador", tier: "C", winrate: 46.5, pickrate: 7.9, banrate: 3.2, icon: "CA", image_url: "" },
      { id: 22, name: "Malphite", role: "Baron", tier: "S", winrate: 52.7, pickrate: 13.1, banrate: 9.4, icon: "MP", image_url: "" },
      { id: 23, name: "Amumu", role: "Jungla", tier: "A", winrate: 51.8, pickrate: 11.6, banrate: 5.7, icon: "AM", image_url: "" },
      { id: 24, name: "Nami", role: "Support", tier: "A", winrate: 50.4, pickrate: 10.9, banrate: 4.3, icon: "NM", image_url: "" },
    ],
    items: [
      { id: 1, name: "Trinity Force", role: "Baron", tier: "S+", winrate: 55.1, usage: 34.2, type: "legendary", color: "#5B21B6" },
      { id: 2, name: "Rabadon's Deathcap", role: "Mid", tier: "S+", winrate: 54.8, usage: 28.7, type: "legendary", color: "#5B21B6" },
      { id: 3, name: "Infinity Edge", role: "Cazador", tier: "S", winrate: 53.2, usage: 31.4, type: "legendary", color: "#9333EA" },
      { id: 4, name: "Frozen Heart", role: "Baron", tier: "S", winrate: 52.7, usage: 22.1, type: "legendary", color: "#9333EA" },
      { id: 5, name: "Shurelya's Battlesong", role: "Support", tier: "S", winrate: 52.4, usage: 18.9, type: "legendary", color: "#9333EA" },
      { id: 6, name: "Kraken Slayer", role: "Cazador", tier: "S", winrate: 51.9, usage: 25.6, type: "legendary", color: "#9333EA" },
      { id: 7, name: "Luden's Tempest", role: "Mid", tier: "A", winrate: 50.8, usage: 19.3, type: "legendary", color: "#3B82F6" },
      { id: 8, name: "Warmog's Armor", role: "Baron", tier: "A", winrate: 50.3, usage: 16.7, type: "epic", color: "#3B82F6" },
      { id: 9, name: "Guardian Angel", role: "Cazador", tier: "A", winrate: 50.1, usage: 21.4, type: "legendary", color: "#3B82F6" },
      { id: 10, name: "Youmuu's Ghostblade", role: "Mid", tier: "A", winrate: 49.7, usage: 14.8, type: "legendary", color: "#3B82F6" },
      { id: 11, name: "Sunfire Aegis", role: "Baron", tier: "B", winrate: 48.9, usage: 12.3, type: "legendary", color: "#22C55E" },
      { id: 12, name: "Rod of Ages", role: "Mid", tier: "B", winrate: 48.4, usage: 11.6, type: "legendary", color: "#22C55E" },
      { id: 13, name: "Ravenous Hydra", role: "Baron", tier: "B", winrate: 48.1, usage: 10.9, type: "legendary", color: "#22C55E" },
      { id: 14, name: "Redemption", role: "Support", tier: "A", winrate: 50.6, usage: 17.2, type: "legendary", color: "#3B82F6" },
      { id: 15, name: "Mortal Reminder", role: "Cazador", tier: "B", winrate: 47.8, usage: 9.4, type: "legendary", color: "#22C55E" },
    ],
    builds: [
      { id: 1, role: "Mid", champion: "Ahri", items: ["Luden's Tempest", "Rabadon's Deathcap", "Lich Bane", "Zhonya's Hourglass", "Void Staff"], winrate: 54.3 },
      { id: 2, role: "Cazador", champion: "Jinx", items: ["Kraken Slayer", "Runaan's Hurricane", "Infinity Edge", "Phantom Dancer", "Guardian Angel"], winrate: 55.1 },
      { id: 3, role: "Baron", champion: "Malphite", items: ["Sunfire Aegis", "Frozen Heart", "Warmog's Armor", "Thornmail", "Abyssal Mask"], winrate: 52.8 },
    ],
  };
}

function loadContent() {
  try {
    const stored = localStorage.getItem(CONTENT_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
  }
  return getDefaultContent();
}

function saveContent(content: ReturnType<typeof getDefaultContent>) {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
}

export function fetchPatches(): PatchEntry[] {
  return loadContent().patches;
}

export function fetchEvents(): EventEntry[] {
  return loadContent().events;
}

export function fetchChampions(): ChampionEntry[] {
  return loadContent().champions;
}

export function fetchItems(): ItemEntry[] {
  return loadContent().items;
}

export function fetchBuilds(): BuildEntry[] {
  return loadContent().builds;
}

function getNextId<T extends { id: number }>(items: T[]): number {
  return items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
}

export function addContent<K extends keyof ReturnType<typeof getDefaultContent>>(
  type: K,
  data: Omit<ReturnType<typeof getDefaultContent>[K][0], "id">
): Promise<{ id: number }> {
  const content = loadContent();
  const newItem = { ...data, id: getNextId(content[type] as any[]) } as any;
  (content[type] as any[]).unshift(newItem);
  saveContent(content);
  return Promise.resolve({ id: newItem.id });
}

export function updateContent<K extends keyof ReturnType<typeof getDefaultContent>>(
  type: K,
  id: number,
  data: Partial<ReturnType<typeof getDefaultContent>[K][0]>
): Promise<void> {
  const content = loadContent();
  const arr = content[type] as any[];
  const idx = arr.findIndex((item) => item.id === id);
  if (idx !== -1) {
    arr[idx] = { ...arr[idx], ...data };
    saveContent(content);
  }
  return Promise.resolve();
}

export function deleteContent<K extends keyof ReturnType<typeof getDefaultContent>>(
  type: K,
  id: number
): Promise<void> {
  const content = loadContent();
  const arr = content[type] as any[];
  const idx = arr.findIndex((item) => item.id === id);
  if (idx !== -1) {
    arr.splice(idx, 1);
    saveContent(content);
  }
  return Promise.resolve();
}

export function seedContent<K extends keyof ReturnType<typeof getDefaultContent>>(type: K): Promise<void> {
  const content = loadContent();
  const defaults = getDefaultContent();
  content[type] = [...defaults[type]];
  saveContent(content);
  return Promise.resolve();
}

export function fetchLatestPatchVersion(): Promise<string> {
  const patches = fetchPatches();
  return Promise.resolve(patches[0]?.version ?? "0.0");
}

export function fetchPatchUpdates(): Promise<PatchUpdateEntry[]> {
  return Promise.resolve([]);
}

export interface PatchSummary {
  id: number;
  title: string;
  version: string;
  date: string;
  type: string;
  image: string;
}