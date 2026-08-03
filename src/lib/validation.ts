import { z } from "zod";

const urlOrEmpty = z.union([z.string().url(), z.literal("")]).nullable();

export const UserSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(3),
  email: z.union([z.string().email(), z.literal("")]).nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  profileImageUrl: urlOrEmpty,
  passwordHash: z.string().nullable(),
  puntosTotales: z.number().int().min(0),
  puntosMensuales: z.number().int().min(0),
  tagWildRift: z.string().nullable(),
  servidor: z.string().nullable(),
  rango: z.string().nullable(),
  partidas: z.number().int().nullable(),
  kda: z.string().nullable(),
  winrate: z.string().nullable(),
  victorias: z.number().int().nullable(),
  derrotas: z.number().int().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const RewardSchema = z.object({
  id: z.number().int().positive(),
  titulo: z.string().min(1),
  descripcion: z.string(),
  costoPuntos: z.number().int().min(0),
  imagenUrl: urlOrEmpty,
  activa: z.boolean(),
  createdAt: z.string().datetime(),
});

export const ChallengeSchema = z.object({
  id: z.number().int().positive(),
  titulo: z.string().min(1),
  descripcion: z.string(),
  puntosRecompensa: z.number().int().min(0),
  tipo: z.enum(["diario", "semanal", "unico", "especial"]),
  createdAt: z.string().datetime(),
});

export const RedemptionSchema = z.object({
  id: z.number().int().positive(),
  usuarioId: z.string().min(1),
  recompensaId: z.number().int().positive(),
  fechaCanje: z.string().datetime(),
  estado: z.enum(["pendiente", "entregado"]),
});

export const AppMetaSchema = z.object({
  lastMonthlyReset: z.string().datetime(),
  currentSeason: z.string().min(1),
  nextSeasonStart: z.string().datetime(),
});

export const PatchSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  version: z.string().min(1),
  summary: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.enum(["Parche", "Temporada", "Campeón", "Evento", "Torneo"]),
  image: z.string(),
  image_url: urlOrEmpty,
});

export const EventSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.string().min(1),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  description: z.string(),
});

export const ChampionSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  role: z.enum(["Mid", "Jungla", "Baron", "Support", "Cazador"]),
  tier: z.enum(["S+", "S", "A", "B", "C", "D"]),
  winrate: z.number().min(0).max(100),
  pickrate: z.number().min(0).max(100),
  banrate: z.number().min(0).max(100),
  icon: z.string().length(2),
  image_url: urlOrEmpty,
});

export const ItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  role: z.enum(["Mid", "Cazador", "Baron", "Support", "Jungla"]),
  tier: z.enum(["S+", "S", "A", "B", "C"]),
  winrate: z.number().min(0).max(100),
  usage: z.number().min(0).max(100),
  type: z.enum(["legendary", "epic", "basic"]),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const BuildSchema = z.object({
  id: z.number().int().positive(),
  champion: z.string().min(1),
  role: z.enum(["Mid", "Cazador", "Baron", "Support", "Jungla"]),
  winrate: z.number().min(0).max(100),
  items: z.array(z.string().min(1)).length(5),
});

export const DataJsonSchema = z.object({
  version: z.string().regex(/^\d{4}-\d{2}-\d{2}-\d{2}$/),
  lastUpdated: z.string().datetime(),
  users: z.array(UserSchema),
  rewards: z.array(RewardSchema),
  challenges: z.array(ChallengeSchema),
  redemptions: z.array(RedemptionSchema),
  appMeta: AppMetaSchema,
  patches: z.array(PatchSchema),
  events: z.array(EventSchema),
  champions: z.array(ChampionSchema),
  items: z.array(ItemSchema),
  builds: z.array(BuildSchema),
});

export type User = z.infer<typeof UserSchema>;
export type Reward = z.infer<typeof RewardSchema>;
export type Challenge = z.infer<typeof ChallengeSchema>;
export type Redemption = z.infer<typeof RedemptionSchema>;
export type AppMeta = z.infer<typeof AppMetaSchema>;
export type Patch = z.infer<typeof PatchSchema>;
export type Event = z.infer<typeof EventSchema>;
export type Champion = z.infer<typeof ChampionSchema>;
export type Item = z.infer<typeof ItemSchema>;
export type Build = z.infer<typeof BuildSchema>;
export type DataJson = z.infer<typeof DataJsonSchema>;
