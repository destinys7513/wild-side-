import {
  getUserByUsername,
  getUserById,
  getUsers,
  updateUser,
  createUser,
  getRewards,
  getAllRewards,
  getRewardById,
  createReward,
  updateReward,
  deleteReward,
  getChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  getRedemptions,
  getUserRedemptions,
  createRedemption,
  updateRedemption,
  getLeaderboard,
  getUserStats,
  addPoints,
  spendPoints,
  resetMonthlyPoints,
  getAppMeta,
  updateAppMeta,
  initDB,
} from "./storage";

initDB();

export interface UsuarioPuntos {
  puntosTotales: number;
  puntosMensuales: number;
  username: string | null;
  tagWildRift: string | null;
  nivel: string;
  nivelMin: number;
  siguienteNivel: string | null;
  siguienteNivelMin: number | null;
  progreso: number;
  puntosParaSiguiente: number;
  servidor: string | null;
  rango: string | null;
  partidas: number | null;
  kda: string | null;
  winrate: string | null;
  victorias: number | null;
  derrotas: number | null;
}

export interface Recompensa {
  id: number;
  titulo: string;
  descripcion: string;
  costoPuntos: number;
  imagenUrl: string | null;
  activa: boolean;
  createdAt?: string;
}

export interface Reto {
  id: number;
  titulo: string;
  descripcion: string;
  puntosRecompensa: number;
  tipo: string;
}

export interface ClasificacionEntry {
  rank: number;
  username: string | null;
  puntosMensuales: number;
  puntosTotales: number;
  nivel: string;
}

export interface Canje {
  id: number;
  estado: string;
  fechaCanje: string;
  usuarioId?: string;
  username?: string | null;
  recompensaTitulo: string | null;
  costoPuntos: number | null;
}

export interface UsuarioAdmin {
  id: string;
  username: string | null;
  email: string | null;
  tagWildRift: string | null;
  puntosTotales: number;
  puntosMensuales: number;
  servidor: string | null;
  rango: string | null;
  partidas: number | null;
  kda: string | null;
  winrate: string | null;
  victorias: number | null;
  derrotas: number | null;
  createdAt: string | null;
}

export interface PerfilInput {
  servidor: string;
  rango: string;
  partidas: string;
  kda: string;
  winrate: string;
  victorias: string;
  derrotas: string;
}

export interface RecompensaInput {
  titulo: string;
  descripcion: string;
  costoPuntos: number;
  imagenUrl: string | null;
  activa: boolean;
}

export interface RetoInput {
  titulo: string;
  descripcion: string;
  puntosRecompensa: number;
  tipo: string;
}

function getCurrentUserId(): string | null {
  const session = localStorage.getItem("wr_session");
  if (!session) return null;
  try {
    const { username } = JSON.parse(session);
    const user = getUserByUsername(username);
    return user?.id ?? null;
  } catch {
    return null;
  }
}

function getCurrentUsername(): string | null {
  const session = localStorage.getItem("wr_session");
  if (!session) return null;
  try {
    return JSON.parse(session).username ?? null;
  } catch {
    return null;
  }
}

function toUsuarioPuntos(userId: string): UsuarioPuntos {
  const user = getUserById(userId);
  if (!user) {
    return {
      puntosTotales: 0,
      puntosMensuales: 0,
      username: null,
      tagWildRift: null,
      nivel: "Bronce",
      nivelMin: 0,
      siguienteNivel: "Plata",
      siguienteNivelMin: 500,
      progreso: 0,
      puntosParaSiguiente: 500,
      servidor: null,
      rango: null,
      partidas: null,
      kda: null,
      winrate: null,
      victorias: null,
      derrotas: null,
    };
  }
  const stats = getUserStats(userId);
  return {
    puntosTotales: user.puntosTotales,
    puntosMensuales: user.puntosMensuales,
    username: user.username,
    tagWildRift: user.tagWildRift,
    nivel: stats.nivel,
    nivelMin: stats.nivelMin,
    siguienteNivel: stats.siguienteNivel,
    siguienteNivelMin: stats.siguienteNivelMin,
    progreso: stats.progreso,
    puntosParaSiguiente: stats.puntosParaSiguiente,
    servidor: user.servidor,
    rango: user.rango,
    partidas: user.partidas,
    kda: user.kda,
    winrate: user.winrate,
    victorias: user.victorias,
    derrotas: user.derrotas,
  };
}

function toUsuarioAdmin(user: ReturnType<typeof getUserById>): UsuarioAdmin | null {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    tagWildRift: user.tagWildRift,
    puntosTotales: user.puntosTotales,
    puntosMensuales: user.puntosMensuales,
    servidor: user.servidor,
    rango: user.rango,
    partidas: user.partidas,
    kda: user.kda,
    winrate: user.winrate,
    victorias: user.victorias,
    derrotas: user.derrotas,
    createdAt: user.createdAt,
  };
}

function toRecompensa(r: ReturnType<typeof getRewardById>): Recompensa | null {
  if (!r) return null;
  return {
    id: r.id,
    titulo: r.titulo,
    descripcion: r.descripcion,
    costoPuntos: r.costoPuntos,
    imagenUrl: r.imagenUrl,
    activa: r.activa,
    createdAt: r.createdAt,
  };
}

function toReto(c: ReturnType<typeof getChallengeById>): Reto | null {
  if (!c) return null;
  return {
    id: c.id,
    titulo: c.titulo,
    descripcion: c.descripcion,
    puntosRecompensa: c.puntosRecompensa,
    tipo: c.tipo,
  };
}

function toCanje(r: ReturnType<typeof getRedemptions>[0]): Canje {
  const user = r.usuarioId ? getUserById(r.usuarioId) : null;
  const reward = r.recompensaId ? getRewardById(r.recompensaId) : null;
  return {
    id: r.id,
    estado: r.estado,
    fechaCanje: r.fechaCanje,
    usuarioId: r.usuarioId,
    username: user?.username ?? null,
    recompensaTitulo: reward?.titulo ?? null,
    costoPuntos: reward?.costoPuntos ?? null,
  };
}

initDB();

export const fetchUsuarioPuntos = async (): Promise<UsuarioPuntos> => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Usuario no autenticado");
  return toUsuarioPuntos(userId);
};

export const fetchRecompensas = async (): Promise<Recompensa[]> => {
  return getRewards().map((r) => toRecompensa(r)!).filter(Boolean) as Recompensa[];
};

export const fetchRetos = async (): Promise<Reto[]> => {
  return getChallenges().map((c) => toReto(c)!).filter(Boolean) as Reto[];
};

export const fetchClasificacion = async (): Promise<ClasificacionEntry[]> => {
  return getLeaderboard();
};

export const fetchMisCanjes = async (): Promise<Canje[]> => {
  const userId = getCurrentUserId();
  if (!userId) return [];
  return getUserRedemptions(userId).map(toCanje);
};

export const canjearRecompensa = async (
  recompensaId: number
): Promise<{ ok: boolean; puntosTotales: number }> => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Usuario no autenticado");

  const reward = getRewardById(recompensaId);
  if (!reward || !reward.activa) throw new Error("Recompensa no disponible");

  const user = getUserById(userId);
  if (!user || user.puntosTotales < reward.costoPuntos) {
    throw new Error("Puntos insuficientes");
  }

  const updated = spendPoints(userId, reward.costoPuntos);
  if (!updated) throw new Error("Error al gastar puntos");

  createRedemption({
    usuarioId: userId,
    recompensaId: reward.id,
    fechaCanje: new Date().toISOString(),
    estado: "pendiente",
  });

  return { ok: true, puntosTotales: updated.puntosTotales };
};

export const fetchAdminCanjes = async (): Promise<Canje[]> => {
  return getRedemptions().map(toCanje);
};

export const completarCanje = async (id: number): Promise<{ ok: boolean }> => {
  const updated = updateRedemption(id, { estado: "entregado" });
  return { ok: !!updated };
};

export const fetchAdminRecompensas = async (): Promise<Recompensa[]> => {
  return getAllRewards().map((r) => toRecompensa(r)!).filter(Boolean) as Recompensa[];
};

export const crearRecompensa = async (data: RecompensaInput): Promise<{ item: Recompensa }> => {
  const reward = createReward(data);
  return { item: toRecompensa(reward)! };
};

export const actualizarRecompensa = async (
  id: number,
  data: RecompensaInput
): Promise<{ item: Recompensa }> => {
  const reward = updateReward(id, data);
  if (!reward) throw new Error("Recompensa no encontrada");
  return { item: toRecompensa(reward)! };
};

export const eliminarRecompensa = async (id: number): Promise<{ ok: boolean }> => {
  const ok = deleteReward(id);
  return { ok };
};

export const fetchAdminRetos = async (): Promise<Reto[]> => {
  return getChallenges().map((c) => toReto(c)!).filter(Boolean) as Reto[];
};

export const crearReto = async (data: RetoInput): Promise<{ item: Reto }> => {
  const challenge = createChallenge(data);
  return { item: toReto(challenge)! };
};

export const actualizarReto = async (
  id: number,
  data: RetoInput
): Promise<{ item: Reto }> => {
  const challenge = updateChallenge(id, data);
  if (!challenge) throw new Error("Reto no encontrado");
  return { item: toReto(challenge)! };
};

export const eliminarReto = async (id: number): Promise<{ ok: boolean }> => {
  const ok = deleteChallenge(id);
  return { ok };
};

export const actualizarTagPropio = async (
  tagWildRift: string
): Promise<{ ok: boolean; tagWildRift: string | null }> => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Usuario no autenticado");

  const updated = updateUser(userId, { tagWildRift: tagWildRift.trim() || null });
  return { ok: !!updated, tagWildRift: updated?.tagWildRift ?? null };
};

export const fetchAdminUsuarios = async (): Promise<UsuarioAdmin[]> => {
  return getUsers().map(toUsuarioAdmin).filter((u): u is UsuarioAdmin => u !== null);
};

export const actualizarPuntosUsuario = async (
  id: string,
  puntosTotales: number,
  puntosMensuales: number
): Promise<{ item: UsuarioAdmin }> => {
  const updated = updateUser(id, { puntosTotales, puntosMensuales });
  if (!updated) throw new Error("Usuario no encontrado");
  const admin = toUsuarioAdmin(updated);
  if (!admin) throw new Error("Usuario no encontrado");
  return { item: admin };
};

export const actualizarPerfilUsuario = async (
  id: string,
  data: PerfilInput
): Promise<{ item: UsuarioAdmin }> => {
  const updated = updateUser(id, {
    servidor: data.servidor,
    rango: data.rango,
    partidas: parseInt(data.partidas) || null,
    kda: data.kda,
    winrate: data.winrate,
    victorias: parseInt(data.victorias) || null,
    derrotas: parseInt(data.derrotas) || null,
  });
  if (!updated) throw new Error("Usuario no encontrado");
  const admin = toUsuarioAdmin(updated);
  if (!admin) throw new Error("Usuario no encontrado");
  return { item: admin };
};