import type { DataJson } from "./validation";
import { DataJsonSchema } from "./validation";

export interface User {
  id: string;
  username: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  passwordHash: string | null;
  puntosTotales: number;
  puntosMensuales: number;
  tagWildRift: string | null;
  servidor: string | null;
  rango: string | null;
  partidas: number | null;
  kda: string | null;
  winrate: string | null;
  victorias: number | null;
  derrotas: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Reward {
  id: number;
  titulo: string;
  descripcion: string;
  costoPuntos: number;
  imagenUrl: string | null;
  activa: boolean;
  createdAt: string;
}

export interface Challenge {
  id: number;
  titulo: string;
  descripcion: string;
  puntosRecompensa: number;
  tipo: string;
  createdAt: string;
}

export interface Redemption {
  id: number;
  usuarioId: string;
  recompensaId: number;
  fechaCanje: string;
  estado: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string | null;
  puntosMensuales: number;
  puntosTotales: number;
  nivel: string;
}

export interface AppMeta {
  lastMonthlyReset: string;
  currentSeason: string;
  nextSeasonStart: string;
}

export interface Patch {
  id: number;
  title: string;
  version: string;
  summary: string;
  date: string;
  type: string;
  image: string;
  image_url?: string | null;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  type: string;
  color: string;
  description: string;
}

export interface Champion {
  id: number;
  name: string;
  role: string;
  tier: string;
  winrate: number;
  pickrate: number;
  banrate: number;
  icon: string;
  image_url?: string | null;
}

export interface Item {
  id: number;
  name: string;
  role: string;
  tier: string;
  winrate: number;
  usage: number;
  type: string;
  color: string;
}

export interface Build {
  id: number;
  champion: string;
  role: string;
  winrate: number;
  items: string[];
}

export interface Database {
  version: string;
  lastUpdated: string;
  users: User[];
  rewards: Reward[];
  challenges: Challenge[];
  redemptions: Redemption[];
  appMeta: AppMeta;
  patches: Patch[];
  events: Event[];
  champions: Champion[];
  items: Item[];
  builds: Build[];
}

const STORAGE_KEY = "wildside_db";
const DATA_URL = "/data.json";

let dbCache: Database | null = null;

function getDefaultDB(): Database {
  return {
    version: "0.0.0",
    lastUpdated: new Date().toISOString(),
    users: [],
    rewards: [],
    challenges: [],
    redemptions: [],
    appMeta: {
      lastMonthlyReset: new Date().toISOString(),
      currentSeason: "Temporada 7",
      nextSeasonStart: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    patches: [],
    events: [],
    champions: [],
    items: [],
    builds: [],
  };
}

function normalizeDB(db: Partial<Database>): Database {
  const defaults = getDefaultDB();
  return {
    ...defaults,
    ...db,
    version: db.version ?? defaults.version,
    lastUpdated: db.lastUpdated ?? defaults.lastUpdated,
    users: db.users ?? defaults.users,
    rewards: db.rewards ?? defaults.rewards,
    challenges: db.challenges ?? defaults.challenges,
    redemptions: db.redemptions ?? defaults.redemptions,
    appMeta: { ...defaults.appMeta, ...(db.appMeta ?? {}) },
    patches: db.patches ?? defaults.patches,
    events: db.events ?? defaults.events,
    champions: db.champions ?? defaults.champions,
    items: db.items ?? defaults.items,
    builds: db.builds ?? defaults.builds,
  };
}

function loadFromLocalStorage(): Database | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return normalizeDB(JSON.parse(stored) as Partial<Database>);
    }
  } catch {
    return null;
  }
  return null;
}

function mergeDataJson(data: Partial<DataJson>): Database {
  const defaults = getDefaultDB();
  return {
    ...defaults,
    version: data.version ?? defaults.version,
    lastUpdated: data.lastUpdated ?? defaults.lastUpdated,
    users: data.users ?? defaults.users,
    rewards: data.rewards ?? defaults.rewards,
    challenges: data.challenges ?? defaults.challenges,
    redemptions: data.redemptions ?? defaults.redemptions,
    appMeta: { ...defaults.appMeta, ...(data.appMeta ?? {}) },
    patches: data.patches ?? defaults.patches,
    events: data.events ?? defaults.events,
    champions: data.champions ?? defaults.champions,
    items: data.items ?? defaults.items,
    builds: data.builds ?? defaults.builds,
  };
}

async function loadFromJSON(): Promise<Database> {
  try {
    const res = await fetch(DATA_URL);
    if (res.ok) {
      const raw = await res.json();
      const parsed = DataJsonSchema.safeParse(raw);
      if (parsed.success) {
        return mergeDataJson(parsed.data);
      }
      console.error("[storage] data.json no pasó la validación:", parsed.error.issues);
      return mergeDataJson(raw as Partial<DataJson>);
    }
  } catch (e) {
    console.error("[storage] Error al cargar data.json:", e);
  }
  return getDefaultDB();
}

export function getDB(): Database {
  if (dbCache) return dbCache;

  const stored = loadFromLocalStorage();
  if (stored) {
    dbCache = stored;
    return dbCache;
  }

  dbCache = getDefaultDB();
  return dbCache;
}

export async function initDB(): Promise<Database> {
  if (dbCache) return dbCache;

  const stored = loadFromLocalStorage();
  if (stored) {
    dbCache = stored;
    return dbCache;
  }

  dbCache = await loadFromJSON();
  saveDB(dbCache);
  return dbCache;
}

export function saveDB(db: Database): void {
  dbCache = db;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function getPatches(): Patch[] {
  return getDB().patches ?? [];
}

export function getEvents(): Event[] {
  return getDB().events ?? [];
}

export function getChampions(): Champion[] {
  return getDB().champions ?? [];
}

export function getItems(): Item[] {
  return getDB().items ?? [];
}

export function getBuilds(): Build[] {
  return getDB().builds ?? [];
}

export function savePatches(patches: Patch[]): void {
  const db = getDB();
  db.patches = patches;
  saveDB(db);
}

export function saveEvents(events: Event[]): void {
  const db = getDB();
  db.events = events;
  saveDB(db);
}

export function saveChampions(champions: Champion[]): void {
  const db = getDB();
  db.champions = champions;
  saveDB(db);
}

export function saveItems(items: Item[]): void {
  const db = getDB();
  db.items = items;
  saveDB(db);
}

export function saveBuilds(builds: Build[]): void {
  const db = getDB();
  db.builds = builds;
  saveDB(db);
}

export function getContentVersion(): string {
  return getDB().version ?? "0.0.0";
}

export function updateContentVersion(version: string, lastUpdated?: string): void {
  const db = getDB();
  db.version = version;
  if (lastUpdated) db.lastUpdated = lastUpdated;
  saveDB(db);
}

export async function refreshContentFromJSON(): Promise<void> {
  const db = getDB();
  try {
    const res = await fetch(DATA_URL, { cache: "no-cache" });
    if (!res.ok) return;
    const raw = await res.json();
    const parsed = DataJsonSchema.safeParse(raw);
    if (!parsed.success) {
      console.error("[storage] data.json no pasó la validación:", parsed.error.issues);
      return;
    }
    const fresh = parsed.data;
    const merged: Database = {
      ...db,
      version: fresh.version,
      lastUpdated: fresh.lastUpdated,
      patches: fresh.patches,
      events: fresh.events,
      champions: fresh.champions,
      items: fresh.items,
      builds: fresh.builds,
    };
    saveDB(merged);
  } catch (e) {
    console.error("[storage] Error al refrescar contenido:", e);
  }
}

export function getUsers(): User[] {
  return getDB().users;
}

export function getUserById(id: string): User | undefined {
  return getDB().users.find((u) => u.id === id);
}

export function getUserByUsername(username: string): User | undefined {
  return getDB().users.find((u) => u.username.toLowerCase() === username.toLowerCase());
}

export function createUser(user: Omit<User, "id" | "createdAt" | "updatedAt"> & { id?: string }): User {
  const db = getDB();
  const newUser: User = {
    ...user,
    id: user.id ?? `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  saveDB(db);
  return newUser;
}

export function updateUser(id: string, data: Partial<User>): User | null {
  const db = getDB();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  db.users[idx] = { ...db.users[idx], ...data, updatedAt: new Date().toISOString() };
  saveDB(db);
  return db.users[idx];
}

export function deleteUser(id: string): boolean {
  const db = getDB();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) return false;
  db.users.splice(idx, 1);
  saveDB(db);
  return true;
}

export function getRewards(): Reward[] {
  return getDB().rewards.filter((r) => r.activa);
}

export function getAllRewards(): Reward[] {
  return getDB().rewards;
}

export function getRewardById(id: number): Reward | undefined {
  return getDB().rewards.find((r) => r.id === id);
}

export function createReward(reward: Omit<Reward, "id" | "createdAt">): Reward {
  const db = getDB();
  const newReward: Reward = {
    ...reward,
    id: db.rewards.length > 0 ? Math.max(...db.rewards.map((r) => r.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
  };
  db.rewards.push(newReward);
  saveDB(db);
  return newReward;
}

export function updateReward(id: number, data: Partial<Reward>): Reward | null {
  const db = getDB();
  const idx = db.rewards.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  db.rewards[idx] = { ...db.rewards[idx], ...data };
  saveDB(db);
  return db.rewards[idx];
}

export function deleteReward(id: number): boolean {
  const db = getDB();
  const idx = db.rewards.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  db.rewards.splice(idx, 1);
  saveDB(db);
  return true;
}

export function getChallenges(): Challenge[] {
  return getDB().challenges;
}

export function getChallengeById(id: number): Challenge | undefined {
  return getDB().challenges.find((c) => c.id === id);
}

export function createChallenge(challenge: Omit<Challenge, "id" | "createdAt">): Challenge {
  const db = getDB();
  const newChallenge: Challenge = {
    ...challenge,
    id: db.challenges.length > 0 ? Math.max(...db.challenges.map((c) => c.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
  };
  db.challenges.push(newChallenge);
  saveDB(db);
  return newChallenge;
}

export function updateChallenge(id: number, data: Partial<Challenge>): Challenge | null {
  const db = getDB();
  const idx = db.challenges.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  db.challenges[idx] = { ...db.challenges[idx], ...data };
  saveDB(db);
  return db.challenges[idx];
}

export function deleteChallenge(id: number): boolean {
  const db = getDB();
  const idx = db.challenges.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  db.challenges.splice(idx, 1);
  saveDB(db);
  return true;
}

export function getRedemptions(): Redemption[] {
  return getDB().redemptions;
}

export function getUserRedemptions(userId: string): Redemption[] {
  return getDB().redemptions.filter((r) => r.usuarioId === userId);
}

export function createRedemption(redemption: Omit<Redemption, "id">): Redemption {
  const db = getDB();
  const newRedemption: Redemption = {
    ...redemption,
    id: db.redemptions.length > 0 ? Math.max(...db.redemptions.map((r) => r.id)) + 1 : 1,
  };
  db.redemptions.push(newRedemption);
  saveDB(db);
  return newRedemption;
}

export function updateRedemption(id: number, data: Partial<Redemption>): Redemption | null {
  const db = getDB();
  const idx = db.redemptions.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  db.redemptions[idx] = { ...db.redemptions[idx], ...data };
  saveDB(db);
  return db.redemptions[idx];
}

export function getLeaderboard(): LeaderboardEntry[] {
  const db = getDB();
  const sorted = [...db.users]
    .filter((u) => u.puntosMensuales > 0)
    .sort((a, b) => b.puntosMensuales - a.puntosMensuales)
    .slice(0, 10)
    .map((u, i) => ({
      rank: i + 1,
      username: u.username,
      puntosMensuales: u.puntosMensuales,
      puntosTotales: u.puntosTotales,
      nivel: getLevel(u.puntosTotales).name,
    }));
  return sorted;
}

export function getLevel(points: number): { name: string; min: number; max: number; color: string } {
  const levels = [
    { name: "Bronce", min: 0, max: 500, color: "#CD7F32" },
    { name: "Plata", min: 500, max: 1500, color: "#C0C0C0" },
    { name: "Oro", min: 1500, max: 3500, color: "#EAB308" },
    { name: "Platino", min: 3500, max: Infinity, color: "#22C55E" },
  ];
  return levels.find((l) => points >= l.min && points <= l.max) ?? levels[0];
}

export function getUserStats(userId: string): {
  puntosTotales: number;
  puntosMensuales: number;
  nivel: string;
  nivelMin: number;
  siguienteNivel: string | null;
  siguienteNivelMin: number | null;
  progreso: number;
  puntosParaSiguiente: number;
} {
  const user = getUserById(userId);
  if (!user) {
    return {
      puntosTotales: 0,
      puntosMensuales: 0,
      nivel: "Bronce",
      nivelMin: 0,
      siguienteNivel: "Plata",
      siguienteNivelMin: 500,
      progreso: 0,
      puntosParaSiguiente: 500,
    };
  }
  const level = getLevel(user.puntosTotales);
  const nextLevel = level.max === Infinity ? null : level.name === "Bronce" ? "Plata" : level.name === "Plata" ? "Oro" : "Platino";
  const nextLevelMin = level.max === Infinity ? null : level.max;
  const progreso = level.max === Infinity ? 100 : ((user.puntosTotales - level.min) / (level.max - level.min)) * 100;
  const puntosParaSiguiente = level.max === Infinity ? 0 : level.max - user.puntosTotales;
  return {
    puntosTotales: user.puntosTotales,
    puntosMensuales: user.puntosMensuales,
    nivel: level.name,
    nivelMin: level.min,
    siguienteNivel: nextLevel,
    siguienteNivelMin: nextLevelMin,
    progreso: Math.min(100, Math.max(0, progreso)),
    puntosParaSiguiente,
  };
}

export function addPoints(userId: string, puntos: number): User | null {
  const user = getUserById(userId);
  if (!user) return null;
  return updateUser(userId, {
    puntosTotales: user.puntosTotales + puntos,
    puntosMensuales: user.puntosMensuales + puntos,
  });
}

export function spendPoints(userId: string, puntos: number): User | null {
  const user = getUserById(userId);
  if (!user || user.puntosTotales < puntos) return null;
  return updateUser(userId, {
    puntosTotales: user.puntosTotales - puntos,
  });
}

export function resetMonthlyPoints(): void {
  const db = getDB();
  db.users.forEach((u) => {
    u.puntosMensuales = 0;
    u.updatedAt = new Date().toISOString();
  });
  db.appMeta.lastMonthlyReset = new Date().toISOString();
  saveDB(db);
}

export function getAppMeta(): AppMeta {
  return getDB().appMeta;
}

export function updateAppMeta(data: Partial<AppMeta>): AppMeta {
  const db = getDB();
  db.appMeta = { ...db.appMeta, ...data };
  saveDB(db);
  return db.appMeta;
}

export function clearDB(): void {
  dbCache = getDefaultDB();
  localStorage.removeItem(STORAGE_KEY);
}

export function exportDB(): string {
  return JSON.stringify(getDB(), null, 2);
}

export function importDB(json: string): boolean {
  try {
    const parsed = JSON.parse(json) as Partial<Database>;
    saveDB(normalizeDB(parsed));
    return true;
  } catch {
    return false;
  }
}