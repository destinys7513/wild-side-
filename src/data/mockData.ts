export const patches = [
  {
    id: 1,
    title: "Patch 7.1 – Rune Overhaul",
    summary: "Grandes cambios al sistema de runas. Electrocute y Conquerer reciben ajustes de balance significativos. Nuevas runas de Sorcery disponibles.",
    date: "2026-04-01",
    version: "7.1",
    type: "Parche",
    image: "gradient-purple",
  },
  {
    id: 2,
    title: "Patch 6.5 – Balance Changes",
    summary: "Nerf a Jinx y Ahri. Buff a Malphite y Blitzcrank. Ajustes de items para la jungla.",
    date: "2026-03-15",
    version: "6.5",
    type: "Parche",
    image: "gradient-blue",
  },
  {
    id: 3,
    title: "Temporada 7 Arranca",
    summary: "Comienza la nueva temporada ranked. Nuevas recompensas, nuevo emblema de Challenger, y cambios al sistema de LP.",
    date: "2026-03-01",
    version: "7.0",
    type: "Temporada",
    image: "gradient-gold",
  },
  {
    id: 4,
    title: "Nuevo Campeón: Briar",
    summary: "Briar llega a Wild Rift. La cazadora de sangre trae un kit único con mecánicas de rampageo y gestión de recursos.",
    date: "2026-02-20",
    version: "6.4b",
    type: "Campeón",
    image: "gradient-red",
  },
  {
    id: 5,
    title: "Evento: Festival del Dragón",
    summary: "Misiones especiales, skins temáticas y el regreso del modo ARAM en el Puente del matadragones.",
    date: "2026-02-10",
    version: "6.4",
    type: "Evento",
    image: "gradient-orange",
  },
  {
    id: 6,
    title: "Patch 6.4 – Artículo Épico",
    summary: "Trinity Force regresa con estadísticas mejoradas. Nuevos items de soporte para encantadores. Ajustes al Núcleo Abisal.",
    date: "2026-02-01",
    version: "6.4",
    type: "Parche",
    image: "gradient-teal",
  },
  {
    id: 7,
    title: "Wild Rift Open Finals",
    summary: "El torneo más grande de la historia de Wild Rift. 16 equipos compiten por $500,000 USD en premios.",
    date: "2026-01-25",
    version: "6.3b",
    type: "Torneo",
    image: "gradient-yellow",
  },
  {
    id: 8,
    title: "Patch 6.3 – Jungla Reimaginada",
    summary: "Cambios fundamentales a la jungla. Nuevos objetivos neutrales, timers ajustados y buffs para campeones de clear lento.",
    date: "2026-01-15",
    version: "6.3",
    type: "Parche",
    image: "gradient-green",
  },
];

export const champions = [
  { id: 1, name: "Jinx", role: "Cazador", tier: "S+", winrate: 54.2, pickrate: 18.3, banrate: 22.1, icon: "JX" },
  { id: 2, name: "Ahri", role: "Mid", tier: "S+", winrate: 53.8, pickrate: 16.7, banrate: 18.5, icon: "AH" },
  { id: 3, name: "Lee Sin", role: "Jungla", tier: "S", winrate: 51.4, pickrate: 22.1, banrate: 14.3, icon: "LS" },
  { id: 4, name: "Yasuo", role: "Mid", tier: "S", winrate: 50.9, pickrate: 19.8, banrate: 31.2, icon: "YS" },
  { id: 5, name: "Lux", role: "Support", tier: "S", winrate: 52.3, pickrate: 15.6, banrate: 8.7, icon: "LX" },
  { id: 6, name: "Blitzcrank", role: "Support", tier: "S", winrate: 51.7, pickrate: 13.4, banrate: 25.8, icon: "BL" },
  { id: 7, name: "Vayne", role: "Cazador", tier: "A", winrate: 49.8, pickrate: 14.2, banrate: 11.3, icon: "VY" },
  { id: 8, name: "Orianna", role: "Mid", tier: "A", winrate: 50.1, pickrate: 11.9, banrate: 5.2, icon: "OR" },
  { id: 9, name: "Jarvan IV", role: "Jungla", tier: "A", winrate: 50.6, pickrate: 12.8, banrate: 6.4, icon: "J4" },
  { id: 10, name: "Xin Zhao", role: "Jungla", tier: "A", winrate: 51.2, pickrate: 10.5, banrate: 4.1, icon: "XZ" },
  { id: 11, name: "Corki", role: "Mid", tier: "A", winrate: 49.4, pickrate: 9.8, banrate: 3.7, icon: "CK" },
  { id: 12, name: "Ezreal", role: "Cazador", tier: "A", winrate: 48.9, pickrate: 17.4, banrate: 7.2, icon: "EZ" },
  { id: 13, name: "Katarina", role: "Mid", tier: "B", winrate: 48.5, pickrate: 10.1, banrate: 12.4, icon: "KT" },
  { id: 14, name: "Leona", role: "Support", tier: "B", winrate: 49.1, pickrate: 11.2, banrate: 4.8, icon: "LN" },
  { id: 15, name: "Thresh", role: "Support", tier: "B", winrate: 48.7, pickrate: 9.6, banrate: 6.1, icon: "TR" },
  { id: 16, name: "Kai'Sa", role: "Cazador", tier: "B", winrate: 48.2, pickrate: 14.8, banrate: 5.9, icon: "KS" },
  { id: 17, name: "Zed", role: "Mid", tier: "B", winrate: 47.9, pickrate: 13.5, banrate: 18.7, icon: "ZD" },
  { id: 18, name: "Sett", role: "Baron", tier: "B", winrate: 49.3, pickrate: 10.7, banrate: 7.3, icon: "ST" },
  { id: 19, name: "Akali", role: "Mid", tier: "C", winrate: 47.1, pickrate: 12.3, banrate: 9.8, icon: "AK" },
  { id: 20, name: "Twisted Fate", role: "Mid", tier: "C", winrate: 46.8, pickrate: 8.4, banrate: 2.9, icon: "TF" },
  { id: 21, name: "Caitlyn", role: "Cazador", tier: "C", winrate: 46.5, pickrate: 7.9, banrate: 3.2, icon: "CA" },
  { id: 22, name: "Malphite", role: "Baron", tier: "S", winrate: 52.7, pickrate: 13.1, banrate: 9.4, icon: "MP" },
  { id: 23, name: "Amumu", role: "Jungla", tier: "A", winrate: 51.8, pickrate: 11.6, banrate: 5.7, icon: "AM" },
  { id: 24, name: "Nami", role: "Support", tier: "A", winrate: 50.4, pickrate: 10.9, banrate: 4.3, icon: "NM" },
];

export const items = [
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
];

export const buildsByRole = [
  {
    role: "Mid",
    champion: "Ahri",
    items: ["Luden's Tempest", "Rabadon's Deathcap", "Lich Bane", "Zhonya's Hourglass", "Void Staff"],
    winrate: 54.3,
  },
  {
    role: "Cazador",
    champion: "Jinx",
    items: ["Kraken Slayer", "Runaan's Hurricane", "Infinity Edge", "Phantom Dancer", "Guardian Angel"],
    winrate: 55.1,
  },
  {
    role: "Baron",
    champion: "Malphite",
    items: ["Sunfire Aegis", "Frozen Heart", "Warmog's Armor", "Thornmail", "Abyssal Mask"],
    winrate: 52.8,
  },
];

export const runesByPath = {
  Precision: {
    keystones: [
      { name: "Conquerer", winrate: 52.8, description: "Ganar stacks de Conquerer atacando campeones. Al máximo: cura basado en daño.", recommended: true },
      { name: "Lethal Tempo", winrate: 50.1, description: "Obtén velocidad de ataque temporal al atacar. Supera el límite máximo.", recommended: false },
      { name: "Fleet Footwork", winrate: 49.7, description: "Moverte y atacar carga energía. Con energía llena: tu próximo ataque da velocidad y cura.", recommended: false },
    ],
    secondary: [
      { name: "Triumph", winrate: 51.4, description: "Asistencias y kills restauran vida y dan oro bonus." },
      { name: "Legend: Alacrity", winrate: 50.8, description: "Gana velocidad de ataque por stacks de leyenda." },
      { name: "Coup de Grace", winrate: 51.2, description: "Haz más daño a objetivos con poca vida." },
    ],
  },
  Domination: {
    keystones: [
      { name: "Electrocute", winrate: 53.2, description: "Tres golpes o habilidades en 3s desatan un rayo de daño adaptativo.", recommended: true },
      { name: "Dark Harvest", winrate: 48.9, description: "Golpear campeones con poca vida daña y roba alma. Escala con almas.", recommended: false },
      { name: "Predator", winrate: 47.3, description: "Activa botas enchantadas para sprint y primer ataque con daño bonus.", recommended: false },
    ],
    secondary: [
      { name: "Cheap Shot", winrate: 50.6, description: "Daño extra a objetivos con movimiento o acciones deterioradas." },
      { name: "Eyeball Collection", winrate: 49.4, description: "Gana daño adaptativo permanente por kills y asistencias." },
      { name: "Relentless Hunter", winrate: 50.1, description: "Stacks de movimiento fuera de combate por kills únicas." },
    ],
  },
  Sorcery: {
    keystones: [
      { name: "Arcane Comet", winrate: 51.7, description: "Dañar un campeón invoca un cometa. Las habilidades reducen el tiempo de reutilización.", recommended: true },
      { name: "Phase Rush", winrate: 49.8, description: "3 ataques/habilidades dan ráfaga de velocidad de movimiento.", recommended: false },
      { name: "Summon Aery", winrate: 50.9, description: "Ataques y habilidades envían Aery a dañar o escudar aliados.", recommended: false },
    ],
    secondary: [
      { name: "Manaflow Band", winrate: 50.3, description: "Habilidades que golpean campeones cargan el maná máximo." },
      { name: "Transcendence", winrate: 51.1, description: "CDR extra se convierte en daño adaptativo." },
      { name: "Scorch", winrate: 49.7, description: "Habilidades queman a los enemigos al golpear (CD: 10s)." },
    ],
  },
  Resolve: {
    keystones: [
      { name: "Grasp of the Undying", winrate: 52.1, description: "Cada 4s en combate: tu próximo ataque drena vida.", recommended: true },
      { name: "Aftershock", winrate: 51.4, description: "Inmovilizar/ralentizar a un campeón da resistencias temporales y luego explota.", recommended: false },
      { name: "Guardian", winrate: 50.7, description: "Protege a aliados cercanos con un escudo cuando reciben daño.", recommended: false },
    ],
    secondary: [
      { name: "Demolish", winrate: 50.9, description: "Carga un poderoso ataque en torres enemigas." },
      { name: "Conditioning", winrate: 51.8, description: "Después del minuto 12: gana resistencias y aumenta armadura/RM." },
      { name: "Overgrowth", winrate: 50.5, description: "Gana vida máxima permanente por jungla y minions muriendo cerca." },
    ],
  },
  Inspiration: {
    keystones: [
      { name: "Glacial Augment", winrate: 50.4, description: "Ralentizar con items/habilidades crea zonas de hielo.", recommended: true },
      { name: "First Strike", winrate: 49.6, description: "Atacar primero fuera de combate da oro y daño bonus.", recommended: false },
      { name: "Unsealed Spellbook", winrate: 48.9, description: "Intercambia hechizos de invocador en tienda y reduce los tiempos de recarga.", recommended: false },
    ],
    secondary: [
      { name: "Magical Footwear", winrate: 49.8, description: "Gana botas gratis (avanzadas) a los 12 min." },
      { name: "Future's Market", winrate: 49.2, description: "Compra items con crédito (límite de deuda)." },
      { name: "Cosmic Insight", winrate: 50.1, description: "Reduce el tiempo de recarga de hechizos de invocador y objetos activos." },
    ],
  },
};

export const recommendedRunePages = [
  {
    champion: "Ahri",
    path: "Sorcery",
    keystone: "Arcane Comet",
    secondary: ["Manaflow Band", "Transcendence"],
    winrate: 54.3,
  },
  {
    champion: "Lee Sin",
    path: "Domination",
    keystone: "Electrocute",
    secondary: ["Cheap Shot", "Relentless Hunter"],
    winrate: 51.8,
  },
  {
    champion: "Malphite",
    path: "Resolve",
    keystone: "Grasp of the Undying",
    secondary: ["Conditioning", "Overgrowth"],
    winrate: 52.7,
  },
];

export const calendarEvents = [
  { id: 1, date: "2026-04-10", title: "Patch 7.1 – Rune Overhaul", type: "Parche", color: "#5B21B6", description: "Gran parche con cambios al sistema de runas y balance de campeones." },
  { id: 2, date: "2026-04-15", title: "Wild Rift Open Tournament", type: "Torneo", color: "#EAB308", description: "Torneo abierto con $50,000 USD en premios. Inscríbete antes del 10 de Abril." },
  { id: 3, date: "2026-04-17", title: "Rotación de Tienda", type: "Rotación", color: "#3B82F6", description: "Nueva rotación de skins y campeones en la tienda semanal." },
  { id: 4, date: "2026-04-22", title: "Fin de Semana XP Doble", type: "Evento", color: "#22C55E", description: "Gana el doble de XP en todas tus partidas durante el fin de semana." },
  { id: 5, date: "2026-04-28", title: "Patch 7.2 Preview", type: "Preview", color: "#6B7280", description: "Notas previas del Patch 7.2. Conoce los cambios antes de que lleguen." },
  { id: 6, date: "2026-05-01", title: "Mid-Split Temporada 7", type: "Temporada", color: "#F97316", description: "Comienza la segunda mitad de la Temporada 7. Nuevas misiones y recompensas." },
  { id: 7, date: "2026-05-12", title: "Patch 7.2 Release", type: "Parche", color: "#5B21B6", description: "Lanzamiento del Patch 7.2 con nuevos ajustes de balance y contenido." },
  { id: 8, date: "2026-04-05", title: "Login Diario Especial", type: "Evento", color: "#22C55E", description: "Recompensa especial de inicio de sesión por el comienzo de la semana." },
];

export const leaderboard = [
  { rank: 1, username: "DragonSlayerPro", points: 8420, level: "Platino" },
  { rank: 2, username: "WildRiftGod", points: 7890, level: "Platino" },
  { rank: 3, username: "AhriMaestro", points: 7340, level: "Platino" },
  { rank: 4, username: "JunglaBestia", points: 6780, level: "Platino" },
  { rank: 5, username: "LuxLauncher", points: 6210, level: "Oro" },
  { rank: 6, username: "BlitzGrabber", points: 5890, level: "Oro" },
  { rank: 7, username: "MidlaneKing", points: 5340, level: "Oro" },
  { rank: 8, username: "JinxCarryMe", points: 4970, level: "Oro" },
  { rank: 9, username: "SupportHero", points: 4420, level: "Plata" },
  { rank: 10, username: "TopLaneGod", points: 3980, level: "Plata" },
];

export const recentMatches = [
  { champion: "Jinx", result: "Victoria", kda: "8/2/11", duration: "24:38", role: "Cazador", cs: 187 },
  { champion: "Ahri", result: "Victoria", kda: "6/3/8", duration: "21:15", role: "Mid", cs: 162 },
  { champion: "Lee Sin", result: "Derrota", kda: "4/5/9", duration: "28:43", role: "Jungla", cs: 134 },
  { champion: "Lux", result: "Victoria", kda: "2/1/18", duration: "19:52", role: "Support", cs: 28 },
  { champion: "Malphite", result: "Victoria", kda: "3/4/12", duration: "22:17", role: "Baron", cs: 143 },
];

export const championMastery = [
  { champion: "Jinx", games: 89, winrate: 62.4, mastery: 184500 },
  { champion: "Ahri", games: 67, winrate: 58.2, mastery: 142300 },
  { champion: "Lux", games: 54, winrate: 55.6, mastery: 98700 },
  { champion: "Lee Sin", games: 38, winrate: 52.1, mastery: 76400 },
  { champion: "Malphite", games: 29, winrate: 65.5, mastery: 54200 },
];

export const winrateHistory = [
  { day: "Lun", winrate: 55 },
  { day: "Mar", winrate: 62 },
  { day: "Mié", winrate: 48 },
  { day: "Jue", winrate: 70 },
  { day: "Vie", winrate: 58 },
  { day: "Sáb", winrate: 67 },
  { day: "Dom", winrate: 60 },
];
