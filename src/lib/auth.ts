export interface UserStats {
  kda: string;
  winrate: string;
  games: string;
  mastery: string;
  rank: string;
  wins: string;
  losses: string;
}

export interface UserProfile {
  username: string;
  password: string;
  stats: UserStats;
  createdAt: string;
  isAdmin?: boolean;
}

export interface Contribution {
  id: string;
  title: string;
  description: string;
  date: string;
  author: string;
  type: string;
  approved: boolean;
}

const USERS_KEY = "wr_users";
const SESSION_KEY = "wr_session";
const CONTRIBUTIONS_KEY = "wr_contributions";

function getDefaultStats(): UserStats {
  return {
    kda: "3.2 / 2.1 / 7.8",
    winrate: "58.3",
    games: "147",
    mastery: "48,500",
    rank: "Plata III",
    wins: "87",
    losses: "60",
  };
}

export function getUsers(): UserProfile[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveUsers(users: UserProfile[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function login(username: string, password: string): { ok: boolean; error?: string } {
  if (username.trim().length < 4) return { ok: false, error: "El nombre de usuario debe tener al menos 4 caracteres." };
  if (password.length < 4) return { ok: false, error: "La contraseña debe tener al menos 4 caracteres." };

  const users = getUsers();
  const existing = users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());

  if (existing) {
    if (existing.password !== password) {
      return { ok: false, error: "Contraseña incorrecta." };
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify({ username: existing.username, isAdmin: !!existing.isAdmin }));
    localStorage.setItem("wr_logged_in", "true");
    return { ok: true };
  }

  const newUser: UserProfile = {
    username: username.trim(),
    password,
    stats: getDefaultStats(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username: newUser.username, isAdmin: false }));
  localStorage.setItem("wr_logged_in", "true");
  return { ok: true };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.setItem("wr_logged_in", "false");
}

export function setAdminSession(username: string) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username: username.trim(), isAdmin: true }));
  localStorage.setItem("wr_logged_in", "true");
}

export function getSession(): { username: string; isAdmin: boolean } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return !!getSession();
}

export function getUserProfile(username: string): UserProfile | null {
  return getUsers().find((u) => u.username.toLowerCase() === username.toLowerCase()) ?? null;
}

export function updateUserStats(username: string, stats: UserStats) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.username.toLowerCase() === username.toLowerCase());
  if (idx !== -1) {
    users[idx].stats = stats;
    saveUsers(users);
  }
}

export function deleteUser(username: string) {
  const users = getUsers().filter((u) => u.username !== username);
  saveUsers(users);
}

export function getContributions(): Contribution[] {
  try {
    return JSON.parse(localStorage.getItem(CONTRIBUTIONS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveContribution(c: Omit<Contribution, "id" | "approved">) {
  const all = getContributions();
  all.unshift({ ...c, id: Date.now().toString(), approved: false });
  localStorage.setItem(CONTRIBUTIONS_KEY, JSON.stringify(all));
}

export function approveContribution(id: string) {
  const all = getContributions().map((c) => (c.id === id ? { ...c, approved: true } : c));
  localStorage.setItem(CONTRIBUTIONS_KEY, JSON.stringify(all));
}

export function deleteContribution(id: string) {
  const all = getContributions().filter((c) => c.id !== id);
  localStorage.setItem(CONTRIBUTIONS_KEY, JSON.stringify(all));
}

export interface PatchItem {
  id: string;
  title: string;
  version: string;
  summary: string;
  date: string;
  type: string;
  image: string;
}

const PATCHES_KEY = "wr_patches";

const DEFAULT_PATCHES: PatchItem[] = [
  { id: "1", title: "Patch 7.1 – Rune Overhaul", summary: "Grandes cambios al sistema de runas. Electrocute y Conquerer reciben ajustes de balance significativos. Nuevas runas de Sorcery disponibles.", date: "2026-04-01", version: "7.1", type: "Parche", image: "gradient-purple" },
  { id: "2", title: "Patch 6.5 – Balance Changes", summary: "Nerf a Jinx y Ahri. Buff a Malphite y Blitzcrank. Ajustes de items para la jungla.", date: "2026-03-15", version: "6.5", type: "Parche", image: "gradient-blue" },
  { id: "3", title: "Temporada 7 Arranca", summary: "Comienza la nueva temporada ranked. Nuevas recompensas, nuevo emblema de Challenger, y cambios al sistema de LP.", date: "2026-03-01", version: "7.0", type: "Temporada", image: "gradient-gold" },
  { id: "4", title: "Nuevo Campeón: Briar", summary: "Briar llega a Wild Rift. La cazadora de sangre trae un kit único con mecánicas de rampageo y gestión de recursos.", date: "2026-02-20", version: "6.4b", type: "Campeón", image: "gradient-red" },
  { id: "5", title: "Evento: Festival del Dragón", summary: "Misiones especiales, skins temáticas y el regreso del modo ARAM en el Puente del matadragones.", date: "2026-02-10", version: "6.4", type: "Evento", image: "gradient-orange" },
  { id: "6", title: "Patch 6.4 – Artículo Épico", summary: "Trinity Force regresa con estadísticas mejoradas. Nuevos items de soporte para encantadores. Ajustes al Núcleo Abisal.", date: "2026-02-01", version: "6.4", type: "Parche", image: "gradient-teal" },
  { id: "7", title: "Wild Rift Open Finals", summary: "El torneo más grande de la historia de Wild Rift. 16 equipos compiten por $500,000 USD en premios.", date: "2026-01-25", version: "6.3b", type: "Torneo", image: "gradient-yellow" },
  { id: "8", title: "Patch 6.3 – Jungla Reimaginada", summary: "Cambios fundamentales a la jungla. Nuevos objetivos neutrales, timers ajustados y buffs para campeones de clear lento.", date: "2026-01-15", version: "6.3", type: "Parche", image: "gradient-green" },
];

export function getPatches(): PatchItem[] {
  try {
    const raw = localStorage.getItem(PATCHES_KEY);
    if (!raw) return [...DEFAULT_PATCHES];
    return JSON.parse(raw) as PatchItem[];
  } catch {
    return [...DEFAULT_PATCHES];
  }
}

export function savePatches(patches: PatchItem[]): void {
  localStorage.setItem(PATCHES_KEY, JSON.stringify(patches));
}

export function addPatch(data: Omit<PatchItem, "id">): PatchItem {
  const patch: PatchItem = { ...data, id: Date.now().toString() };
  const all = getPatches();
  all.unshift(patch);
  savePatches(all);
  return patch;
}

export function updatePatch(id: string, data: Omit<PatchItem, "id">): void {
  const all = getPatches().map((p) => (p.id === id ? { ...data, id } : p));
  savePatches(all);
}

export function removePatch(id: string): void {
  savePatches(getPatches().filter((p) => p.id !== id));
}