import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import {
  Shield, Trash2, CheckCircle, XCircle, Users, FileText,
  BarChart2, Plus, Save, X, Pencil, Newspaper, RotateCcw,
  Calendar, Sword, Package, Layers, Star, Globe, Gamepad2,
} from "lucide-react";
import PuntosAdmin from "@/components/admin/PuntosAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { setPageMeta } from "@/lib/seo";
import {
  getSession, getUsers, deleteUser, saveUsers,
  getContributions, approveContribution, deleteContribution,
  type UserProfile, type UserStats, updateUserStats,
} from "@/lib/auth";
import {
  fetchAdminUsuarios, actualizarPerfilUsuario,
  type UsuarioAdmin, type PerfilInput,
} from "@/lib/points";
import {
  fetchPatches, fetchEvents, fetchChampions, fetchItems, fetchBuilds,
  addContent, updateContent, deleteContent, seedContent,
  type PatchEntry, type EventEntry, type ChampionEntry, type ItemEntry, type BuildEntry,
} from "@/lib/content";

type Tab = "miembros" | "users" | "contributions" | "patches" | "events" | "champions" | "items" | "builds" | "puntos" | "stats";

function ImagePreview({ url, className, imgClassName, fallback }: {
  url: string;
  className: string;
  imgClassName: string;
  fallback: ReactNode;
}) {
  const [errored, setErrored] = useState(false);
  const trimmed = url.trim();
  return (
    <div className={className}>
      {trimmed && !errored ? (
        <img key={trimmed} src={trimmed} alt="Vista previa" className={imgClassName} onError={() => setErrored(true)} />
      ) : (
        fallback
      )}
    </div>
  );
}

// ─── Patches constants ────────────────────────────────────────────────────────

const PATCH_TYPES = ["Parche", "Temporada", "Campeón", "Evento", "Torneo"];

const GRADIENT_OPTIONS = [
  { value: "gradient-purple", label: "Morado", css: "from-purple-600 to-indigo-700" },
  { value: "gradient-blue", label: "Azul", css: "from-blue-600 to-cyan-700" },
  { value: "gradient-gold", label: "Dorado", css: "from-yellow-500 to-amber-700" },
  { value: "gradient-red", label: "Rojo", css: "from-red-600 to-rose-700" },
  { value: "gradient-orange", label: "Naranja", css: "from-orange-500 to-amber-700" },
  { value: "gradient-teal", label: "Verde azulado", css: "from-teal-600 to-emerald-700" },
  { value: "gradient-yellow", label: "Amarillo", css: "from-yellow-400 to-lime-600" },
  { value: "gradient-green", label: "Verde", css: "from-green-600 to-teal-700" },
];

const PATCH_TYPE_COLORS: Record<string, string> = {
  Parche: "bg-purple-500/20 text-purple-400",
  Temporada: "bg-orange-500/20 text-orange-400",
  Campeón: "bg-red-500/20 text-red-400",
  Evento: "bg-green-500/20 text-green-400",
  Torneo: "bg-yellow-500/20 text-yellow-400",
};

const EMPTY_PATCH_FORM = {
  title: "",
  version: "",
  type: "Parche",
  date: new Date().toISOString().slice(0, 10),
  summary: "",
  image: "gradient-purple",
  image_url: "",
};

type PatchForm = typeof EMPTY_PATCH_FORM;

// ─── Events constants ─────────────────────────────────────────────────────────

const EVENT_TYPES = ["Parche", "Torneo", "Rotación", "Evento", "Preview", "Temporada"];

const EVENT_TYPE_COLORS: Record<string, string> = {
  Parche: "bg-purple-500/20 text-purple-400",
  Torneo: "bg-yellow-500/20 text-yellow-400",
  Rotación: "bg-blue-500/20 text-blue-400",
  Evento: "bg-green-500/20 text-green-400",
  Preview: "bg-gray-500/20 text-gray-400",
  Temporada: "bg-orange-500/20 text-orange-400",
};

const EVENT_COLOR_OPTIONS = [
  { value: "#5B21B6", label: "Morado" },
  { value: "#EAB308", label: "Amarillo" },
  { value: "#3B82F6", label: "Azul" },
  { value: "#22C55E", label: "Verde" },
  { value: "#6B7280", label: "Gris" },
  { value: "#F97316", label: "Naranja" },
  { value: "#EF4444", label: "Rojo" },
];

const EMPTY_EVENT_FORM = {
  title: "",
  date: new Date().toISOString().slice(0, 10),
  type: "Evento",
  color: "#22C55E",
  description: "",
};
type EventForm = typeof EMPTY_EVENT_FORM;

// ─── Champions constants ──────────────────────────────────────────────────────

const CHAMP_ROLES = ["Mid", "Cazador", "Baron", "Support", "Jungla"];
const TIERS = ["S+", "S", "A", "B", "C", "D"];

const TIER_COLORS: Record<string, string> = {
  "S+": "bg-yellow-500/20 text-yellow-400",
  "S": "bg-purple-500/20 text-purple-400",
  "A": "bg-blue-500/20 text-blue-400",
  "B": "bg-green-500/20 text-green-400",
  "C": "bg-gray-500/20 text-gray-400",
  "D": "bg-red-500/20 text-red-400",
};

const EMPTY_CHAMP_FORM = {
  name: "",
  role: "Mid",
  tier: "A",
  winrate: 50,
  pickrate: 10,
  banrate: 5,
  icon: "",
  image_url: "",
};
type ChampForm = typeof EMPTY_CHAMP_FORM;

// ─── Items constants ──────────────────────────────────────────────────────────

const ITEM_ROLES = ["Mid", "Cazador", "Baron", "Support", "Jungla"];
const ITEM_TYPES_LIST = ["legendary", "epic", "basic"];
const ITEM_COLOR_OPTIONS = [
  { value: "#5B21B6", label: "Morado" },
  { value: "#9333EA", label: "Violeta" },
  { value: "#3B82F6", label: "Azul" },
  { value: "#22C55E", label: "Verde" },
  { value: "#EAB308", label: "Amarillo" },
  { value: "#EF4444", label: "Rojo" },
  { value: "#F97316", label: "Naranja" },
];

const EMPTY_ITEM_FORM = {
  name: "",
  role: "Mid",
  tier: "A",
  winrate: 50,
  usage: 15,
  type: "legendary",
  color: "#5B21B6",
};
type ItemForm = typeof EMPTY_ITEM_FORM;

// ─── Builds constants ─────────────────────────────────────────────────────────

const BUILD_ROLES = ["Mid", "Cazador", "Baron", "Support", "Jungla"];

const EMPTY_BUILD_FORM = {
  champion: "",
  role: "Mid",
  winrate: 50,
  itemsRaw: "",
};
type BuildForm = typeof EMPTY_BUILD_FORM;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Admin() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>("miembros");

  // ── Users state ────────────────────────────────────────────────────────────
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [contributions, setContributions] = useState(getContributions());
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editStats, setEditStats] = useState<UserStats | null>(null);
  const [newUser, setNewUser] = useState({ username: "", password: "" });
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserError, setAddUserError] = useState("");

  // ── Patches state ──────────────────────────────────────────────────────────
  const [patchDialogOpen, setPatchDialogOpen] = useState(false);
  const [editingPatch, setEditingPatch] = useState<PatchEntry | null>(null);
  const [patchForm, setPatchForm] = useState<PatchForm>({ ...EMPTY_PATCH_FORM });
  const [patchFormError, setPatchFormError] = useState("");
  const [patchSaving, setPatchSaving] = useState(false);

  // ── Events state ───────────────────────────────────────────────────────────
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventEntry | null>(null);
  const [eventForm, setEventForm] = useState<EventForm>({ ...EMPTY_EVENT_FORM });
  const [eventFormError, setEventFormError] = useState("");
  const [eventSaving, setEventSaving] = useState(false);

  // ── Champions state ────────────────────────────────────────────────────────
  const [champDialogOpen, setChampDialogOpen] = useState(false);
  const [editingChamp, setEditingChamp] = useState<ChampionEntry | null>(null);
  const [champForm, setChampForm] = useState<ChampForm>({ ...EMPTY_CHAMP_FORM });
  const [champFormError, setChampFormError] = useState("");
  const [champSaving, setChampSaving] = useState(false);

  // ── Items state ────────────────────────────────────────────────────────────
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemEntry | null>(null);
  const [itemForm, setItemForm] = useState<ItemForm>({ ...EMPTY_ITEM_FORM });
  const [itemFormError, setItemFormError] = useState("");
  const [itemSaving, setItemSaving] = useState(false);

  // ── Builds state ───────────────────────────────────────────────────────────
  const [buildDialogOpen, setBuildDialogOpen] = useState(false);
  const [editingBuild, setEditingBuild] = useState<BuildEntry | null>(null);
  const [buildForm, setBuildForm] = useState<BuildForm>({ ...EMPTY_BUILD_FORM });
  const [buildFormError, setBuildFormError] = useState("");
  const [buildSaving, setBuildSaving] = useState(false);

  // ── Profile edit state ────────────────────────────────────────────────────
  const [profileEditId, setProfileEditId] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState<PerfilInput>({
    servidor: "", rango: "", partidas: "", kda: "", winrate: "", victorias: "", derrotas: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [patches, setPatches] = useState<PatchEntry[]>([]);
  const [events, setEvents] = useState<EventEntry[]>([]);
  const [champions, setChampions] = useState<ChampionEntry[]>([]);
  const [items, setItems] = useState<ItemEntry[]>([]);
  const [builds, setBuilds] = useState<BuildEntry[]>([]);
  const [serverUsers, setServerUsers] = useState<UsuarioAdmin[]>([]);

  const session = getSession();

  useEffect(() => {
    setPageMeta("Panel Admin – WR Hub", "Panel de administración de WR Hub.");
    if (!session?.isAdmin) {
      setLocation("/");
      return;
    }
    refreshUsers();
    loadContent();
  }, []);

  function loadContent() {
    setPatches(fetchPatches());
    setEvents(fetchEvents());
    setChampions(fetchChampions());
    setItems(fetchItems());
    setBuilds(fetchBuilds());
  }

  function refreshUsers() { setUsers(getUsers()); }
  function refreshContent(key: string) {
    if (key === "patches") setPatches(fetchPatches());
    else if (key === "events") setEvents(fetchEvents());
    else if (key === "champions") setChampions(fetchChampions());
    else if (key === "items") setItems(fetchItems());
    else if (key === "builds") setBuilds(fetchBuilds());
  }

  async function refreshServerUsers() {
    const data = await fetchAdminUsuarios();
    setServerUsers(data);
  }

  function handleEditPerfil(u: UsuarioAdmin) {
    setProfileEditId(u.id);
    setProfileForm({
      servidor: u.servidor ?? "",
      rango: u.rango ?? "",
      partidas: u.partidas != null ? String(u.partidas) : "",
      kda: u.kda ?? "",
      winrate: u.winrate ?? "",
      victorias: u.victorias != null ? String(u.victorias) : "",
      derrotas: u.derrotas != null ? String(u.derrotas) : "",
    });
    setProfileError("");
  }

  async function handleSavePerfil() {
    if (!profileEditId) return;
    setProfileSaving(true);
    setProfileError("");
    try {
      await actualizarPerfilUsuario(profileEditId, profileForm);
      setProfileEditId(null);
      await refreshServerUsers();
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setProfileSaving(false);
    }
  }

  // ─── User handlers ─────────────────────────────────────────────────────────

  function handleDeleteUser(username: string) {
    if (username === "admin") return;
    if (!confirm(`¿Eliminar al usuario "${username}"?`)) return;
    deleteUser(username);
    refreshUsers();
  }

  function handleEditStats(user: UserProfile) {
    setEditingUser(user.username);
    setEditStats({ ...user.stats });
  }

  function handleSaveStats() {
    if (!editingUser || !editStats) return;
    updateUserStats(editingUser, editStats);
    setEditingUser(null);
    setEditStats(null);
    refreshUsers();
  }

  function handleApprove(id: string) {
    approveContribution(id);
    setContributions(getContributions());
  }

  function handleDeleteContribution(id: string) {
    deleteContribution(id);
    setContributions(getContributions());
  }

  function handleAddUser() {
    setAddUserError("");
    if (newUser.username.trim().length < 4) { setAddUserError("El nombre debe tener al menos 4 caracteres."); return; }
    if (newUser.password.length < 4) { setAddUserError("La contraseña debe tener al menos 4 caracteres."); return; }
    const all = getUsers();
    if (all.find((u) => u.username.toLowerCase() === newUser.username.trim().toLowerCase())) {
      setAddUserError("Ese nombre de usuario ya existe.");
      return;
    }
    const defaultStats = {
      kda: "3.0 / 2.0 / 6.0", winrate: "50.0", games: "0", mastery: "0",
      rank: "Sin clasificar", wins: "0", losses: "0",
    };
    all.push({ username: newUser.username.trim(), password: newUser.password, stats: defaultStats, createdAt: new Date().toISOString() });
    saveUsers(all);
    setNewUser({ username: "", password: "" });
    setShowAddUser(false);
    refreshUsers();
  }

  // ─── Patch handlers ────────────────────────────────────────────────────────

  function openAddPatch() {
    setEditingPatch(null);
    setPatchForm({ ...EMPTY_PATCH_FORM, date: new Date().toISOString().slice(0, 10) });
    setPatchFormError("");
    setPatchDialogOpen(true);
  }

  function openEditPatch(p: PatchEntry) {
    setEditingPatch(p);
    setPatchForm({ title: p.title, version: p.version, type: p.type, date: p.date, summary: p.summary, image: p.image, image_url: p.image_url ?? "" });
    setPatchFormError("");
    setPatchDialogOpen(true);
  }

  async function handleSavePatch() {
    if (!patchForm.title.trim()) { setPatchFormError("El título es obligatorio."); return; }
    if (!patchForm.version.trim()) { setPatchFormError("La versión es obligatoria."); return; }
    if (!patchForm.date) { setPatchFormError("La fecha es obligatoria."); return; }
    if (!patchForm.summary.trim()) { setPatchFormError("La descripción es obligatoria."); return; }

    const data = {
      title: patchForm.title.trim(),
      version: patchForm.version.trim(),
      type: patchForm.type,
      date: patchForm.date,
      summary: patchForm.summary.trim(),
      image: patchForm.image,
      image_url: patchForm.image_url.trim(),
    };

    setPatchSaving(true);
    setPatchFormError("");
    try {
      if (editingPatch) {
        await updateContent("patches", editingPatch.id, data);
      } else {
        await addContent("patches", data);
      }
      refreshContent("patches");
      setPatchDialogOpen(false);
    } catch (err) {
      setPatchFormError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setPatchSaving(false);
    }
  }

  async function handleDeletePatch(id: number) {
    if (!confirm("¿Eliminar este parche? Esta acción no se puede deshacer.")) return;
    try {
      await deleteContent("patches", id);
      refreshContent("patches");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar.");
    }
  }

  async function handleResetPatches() {
    if (!confirm("¿Restaurar los parches a los valores predeterminados? Se perderán todos los cambios.")) return;
    try {
      await seedContent("patches");
      refreshContent("patches");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al restaurar.");
    }
  }

  // ─── Event handlers ────────────────────────────────────────────────────────

  function openAddEvent() {
    setEditingEvent(null);
    setEventForm({ ...EMPTY_EVENT_FORM, date: new Date().toISOString().slice(0, 10) });
    setEventFormError("");
    setEventDialogOpen(true);
  }

  function openEditEvent(e: EventEntry) {
    setEditingEvent(e);
    setEventForm({ title: e.title, date: e.date, type: e.type, color: e.color, description: e.description });
    setEventFormError("");
    setEventDialogOpen(true);
  }

  async function handleSaveEvent() {
    if (!eventForm.title.trim()) { setEventFormError("El título es obligatorio."); return; }
    if (!eventForm.date) { setEventFormError("La fecha es obligatoria."); return; }
    if (!eventForm.description.trim()) { setEventFormError("La descripción es obligatoria."); return; }

    const data = {
      title: eventForm.title.trim(),
      date: eventForm.date,
      type: eventForm.type,
      color: eventForm.color,
      description: eventForm.description.trim(),
    };

    setEventSaving(true);
    setEventFormError("");
    try {
      if (editingEvent) {
        await updateContent("events", editingEvent.id, data);
      } else {
        await addContent("events", data);
      }
      refreshContent("events");
      setEventDialogOpen(false);
    } catch (err) {
      setEventFormError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setEventSaving(false);
    }
  }

  async function handleDeleteEvent(id: number) {
    if (!confirm("¿Eliminar este evento? Esta acción no se puede deshacer.")) return;
    try {
      await deleteContent("events", id);
      refreshContent("events");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar.");
    }
  }

  async function handleResetEvents() {
    if (!confirm("¿Restaurar los eventos a los valores predeterminados? Se perderán todos los cambios.")) return;
    try {
      await seedContent("events");
      refreshContent("events");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al restaurar.");
    }
  }

  // ─── Champion handlers ─────────────────────────────────────────────────────

  function openAddChamp() {
    setEditingChamp(null);
    setChampForm({ ...EMPTY_CHAMP_FORM });
    setChampFormError("");
    setChampDialogOpen(true);
  }

  function openEditChamp(c: ChampionEntry) {
    setEditingChamp(c);
    setChampForm({ name: c.name, role: c.role, tier: c.tier, winrate: c.winrate, pickrate: c.pickrate, banrate: c.banrate, icon: c.icon, image_url: c.image_url ?? "" });
    setChampFormError("");
    setChampDialogOpen(true);
  }

  async function handleSaveChamp() {
    if (!champForm.name.trim()) { setChampFormError("El nombre es obligatorio."); return; }
    if (champForm.winrate < 0 || champForm.winrate > 100) { setChampFormError("El winrate debe estar entre 0 y 100."); return; }

    const icon = champForm.icon.trim() || champForm.name.slice(0, 2).toUpperCase();
    const data = {
      name: champForm.name.trim(),
      role: champForm.role,
      tier: champForm.tier,
      winrate: Number(champForm.winrate),
      pickrate: Number(champForm.pickrate),
      banrate: Number(champForm.banrate),
      icon,
      image_url: champForm.image_url.trim(),
    };

    setChampSaving(true);
    setChampFormError("");
    try {
      if (editingChamp) {
        await updateContent("champions", editingChamp.id, data);
      } else {
        await addContent("champions", data);
      }
      refreshContent("champions");
      setChampDialogOpen(false);
    } catch (err) {
      setChampFormError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setChampSaving(false);
    }
  }

  async function handleDeleteChamp(id: number) {
    if (!confirm("¿Eliminar este campeón? Esta acción no se puede deshacer.")) return;
    try {
      await deleteContent("champions", id);
      refreshContent("champions");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar.");
    }
  }

  async function handleResetChampions() {
    if (!confirm("¿Restaurar los campeones a los valores predeterminados? Se perderán todos los cambios.")) return;
    try {
      await seedContent("champions");
      refreshContent("champions");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al restaurar.");
    }
  }

  // ─── Item handlers ─────────────────────────────────────────────────────────

  function openAddItem() {
    setEditingItem(null);
    setItemForm({ ...EMPTY_ITEM_FORM });
    setItemFormError("");
    setItemDialogOpen(true);
  }

  function openEditItem(item: ItemEntry) {
    setEditingItem(item);
    setItemForm({ name: item.name, role: item.role, tier: item.tier, winrate: item.winrate, usage: item.usage, type: item.type, color: item.color });
    setItemFormError("");
    setItemDialogOpen(true);
  }

  async function handleSaveItem() {
    if (!itemForm.name.trim()) { setItemFormError("El nombre es obligatorio."); return; }
    if (itemForm.winrate < 0 || itemForm.winrate > 100) { setItemFormError("El winrate debe estar entre 0 y 100."); return; }

    const data = {
      name: itemForm.name.trim(),
      role: itemForm.role,
      tier: itemForm.tier,
      winrate: Number(itemForm.winrate),
      usage: Number(itemForm.usage),
      type: itemForm.type,
      color: itemForm.color,
    };

    setItemSaving(true);
    setItemFormError("");
    try {
      if (editingItem) {
        await updateContent("items", editingItem.id, data);
      } else {
        await addContent("items", data);
      }
      refreshContent("items");
      setItemDialogOpen(false);
    } catch (err) {
      setItemFormError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setItemSaving(false);
    }
  }

  async function handleDeleteItem(id: number) {
    if (!confirm("¿Eliminar este item? Esta acción no se puede deshacer.")) return;
    try {
      await deleteContent("items", id);
      refreshContent("items");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar.");
    }
  }

  async function handleResetItems() {
    if (!confirm("¿Restaurar los items a los valores predeterminados? Se perderán todos los cambios.")) return;
    try {
      await seedContent("items");
      refreshContent("items");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al restaurar.");
    }
  }

  // ─── Build handlers ────────────────────────────────────────────────────────

  function openAddBuild() {
    setEditingBuild(null);
    setBuildForm({ ...EMPTY_BUILD_FORM });
    setBuildFormError("");
    setBuildDialogOpen(true);
  }

  function openEditBuild(b: BuildEntry) {
    setEditingBuild(b);
    setBuildForm({ champion: b.champion, role: b.role, winrate: b.winrate, itemsRaw: b.items.join(", ") });
    setBuildFormError("");
    setBuildDialogOpen(true);
  }

  async function handleSaveBuild() {
    if (!buildForm.champion.trim()) { setBuildFormError("El campeón es obligatorio."); return; }
    if (!buildForm.itemsRaw.trim()) { setBuildFormError("Agrega al menos un item."); return; }
    if (buildForm.winrate < 0 || buildForm.winrate > 100) { setBuildFormError("El winrate debe estar entre 0 y 100."); return; }

    const items = buildForm.itemsRaw.split(",").map((s) => s.trim()).filter(Boolean);
    if (items.length === 0) { setBuildFormError("Agrega al menos un item."); return; }

    const data = {
      champion: buildForm.champion.trim(),
      role: buildForm.role,
      winrate: Number(buildForm.winrate),
      items,
    };

    setBuildSaving(true);
    setBuildFormError("");
    try {
      if (editingBuild) {
        await updateContent("builds", editingBuild.id, data);
      } else {
        await addContent("builds", data);
      }
      refreshContent("builds");
      setBuildDialogOpen(false);
    } catch (err) {
      setBuildFormError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setBuildSaving(false);
    }
  }

  async function handleDeleteBuild(id: number) {
    if (!confirm("¿Eliminar esta build? Esta acción no se puede deshacer.")) return;
    try {
      await deleteContent("builds", id);
      refreshContent("builds");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar.");
    }
  }

  async function handleResetBuilds() {
    if (!confirm("¿Restaurar las builds a los valores predeterminados? Se perderán todos los cambios.")) return;
    try {
      await seedContent("builds");
      refreshContent("builds");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al restaurar.");
    }
  }

  if (!session?.isAdmin) return null;

  const tabList: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: "miembros", label: "Miembros", icon: Gamepad2 },
    { id: "patches", label: "Parches", icon: Newspaper },
    { id: "events", label: "Eventos", icon: Calendar },
    { id: "champions", label: "Campeones", icon: Sword },
    { id: "items", label: "Items", icon: Package },
    { id: "builds", label: "Builds", icon: Layers },
    { id: "puntos", label: "Sistema de Puntos", icon: Star },
    { id: "users", label: "Usuarios", icon: Users },
    { id: "contributions", label: "Contribuciones", icon: FileText },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
            <p className="text-[#A5B4FC]/60 text-sm">Control total del contenido — solo tú puedes ver esto</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#1D2B64] border border-white/10 rounded-xl p-1 mb-6 w-fit flex-wrap">
          {tabList.map((t) => (
            <button
              key={t.id}
              data-testid={`admin-tab-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id ? "bg-primary text-white" : "text-[#A5B4FC] hover:text-white"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* ── MIEMBROS TAB ─────────────────────────────────────────────────── */}
        {tab === "miembros" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-semibold">Miembros del Gremio</h2>
                <p className="text-[#A5B4FC]/50 text-xs mt-0.5">
                  {serverUsers.length} {serverUsers.length === 1 ? "miembro registrado" : "miembros registrados"} en la base de datos — ordenados por fecha de ingreso
                </p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => void refreshServerUsers()} className="text-[#A5B4FC]/50 hover:text-[#A5B4FC] h-8 px-3 text-xs">
                <RotateCcw className="w-3.5 h-3.5 mr-1" />Actualizar
              </Button>
            </div>

            <div className="bg-[#1D2B64] rounded-xl border border-white/10 overflow-hidden">
              {serverUsers.length === 0 ? (
                <div className="py-16 text-center text-[#A5B4FC]/40">
                  <Gamepad2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Aún no hay miembros registrados.</p>
                  <p className="text-xs mt-1 text-[#A5B4FC]/25">Los usuarios aparecerán aquí una vez se registren en la web.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-[auto_1fr_1fr_1fr_120px] gap-4 px-5 py-3 border-b border-white/10 text-[#A5B4FC]/40 text-xs font-semibold uppercase tracking-wider">
                    <span>Avatar</span>
                    <span>Usuario</span>
                    <span>Tag Wild Rift</span>
                    <span>Rango / Servidor</span>
                    <span className="text-right">Registro</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {serverUsers.map((u) => {
                      const fecha = u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
                        : "—";
                      return (
                        <div key={u.id} className="grid grid-cols-[auto_1fr_1fr_1fr_120px] gap-4 items-center px-5 py-4 hover:bg-white/5 transition-colors">
                          <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-none">
                            {(u.username ?? "?").slice(0, 1).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-white font-medium text-sm truncate">{u.username ?? "—"}</div>
                            <div className="text-[#A5B4FC]/40 text-xs mt-0.5">{u.puntosTotales} pts totales</div>
                          </div>
                          <div className="min-w-0">
                            {u.tagWildRift ? (
                              <span className="inline-flex items-center gap-1.5 text-teal-400 text-sm font-medium">
                                <Gamepad2 className="w-3.5 h-3.5 flex-none" />
                                <span className="truncate">{u.tagWildRift}</span>
                              </span>
                            ) : (
                              <span className="text-[#A5B4FC]/25 text-sm">—</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            {u.rango ? (
                              <div className="text-white text-sm truncate">{u.rango}</div>
                            ) : (
                              <span className="text-[#A5B4FC]/25 text-sm">Sin rango</span>
                            )}
                            {u.servidor && (
                              <div className="text-[#A5B4FC]/40 text-xs mt-0.5 flex items-center gap-1">
                                <Globe className="w-3 h-3" />{u.servidor}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-[#A5B4FC]/60 text-xs">{fecha}</div>
                            <Button
                              size="sm" variant="ghost"
                              onClick={() => handleEditPerfil(u)}
                              className="text-[#A5B4FC]/40 hover:text-white hover:bg-white/10 h-7 px-2 text-xs mt-1"
                            >
                              <Pencil className="w-3 h-3 mr-1" />Perfil
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── PUNTOS TAB ───────────────────────────────────────────────────── */}
        {tab === "puntos" && <PuntosAdmin />}

        {/* ── PATCHES TAB ──────────────────────────────────────────────────── */}
        {tab === "patches" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-semibold">Parches y Actualizaciones</h2>
                <p className="text-[#A5B4FC]/50 text-xs mt-0.5">
                  {patches.length} entradas — los cambios se reflejan en /actualizaciones al instante
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm" variant="ghost" onClick={handleResetPatches}
                  className="text-[#A5B4FC]/50 hover:text-[#A5B4FC] h-8 px-3 text-xs"
                  title="Restaurar predeterminados"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />Restaurar
                </Button>
                <Button size="sm" onClick={openAddPatch} className="bg-primary/20 text-primary hover:bg-primary/30 border-0 h-8">
                  <Plus className="w-4 h-4 mr-1" />Nuevo parche
                </Button>
              </div>
            </div>

            <div className="bg-[#1D2B64] rounded-xl border border-white/10 overflow-hidden">
              <div className="grid grid-cols-[auto_1fr_140px_100px_80px] gap-4 px-5 py-3 border-b border-white/10 text-[#A5B4FC]/40 text-xs font-semibold uppercase tracking-wider">
                <span>Visual</span><span>Título</span><span>Tipo / Versión</span><span>Fecha</span>
                <span className="text-right">Acciones</span>
              </div>
              {patches.length === 0 ? (
                <div className="py-16 text-center text-[#A5B4FC]/40">
                  <Newspaper className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No hay parches. Agrega el primero.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {patches.map((p) => {
                    const gradient = GRADIENT_OPTIONS.find((g) => g.value === p.image);
                    return (
                      <div key={p.id} className="grid grid-cols-[auto_1fr_140px_100px_80px] gap-4 items-center px-5 py-3.5 hover:bg-white/5 transition-colors">
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${gradient?.css ?? "from-purple-600 to-indigo-700"} flex-none`} />
                        <div className="min-w-0">
                          <div className="text-white font-medium text-sm truncate">{p.title}</div>
                          <div className="text-[#A5B4FC]/40 text-xs truncate mt-0.5">{p.summary}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full w-fit font-medium ${PATCH_TYPE_COLORS[p.type] ?? "bg-gray-500/20 text-gray-400"}`}>{p.type}</span>
                          <span className="text-[#A5B4FC]/40 text-xs font-mono">v{p.version}</span>
                        </div>
                        <div className="text-[#A5B4FC]/50 text-xs">{p.date}</div>
                        <div className="flex gap-1.5 justify-end">
                          <button onClick={() => openEditPatch(p)} className="w-7 h-7 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors" title="Editar">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeletePatch(p.id)} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors" title="Eliminar">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── EVENTS TAB ───────────────────────────────────────────────────── */}
        {tab === "events" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-semibold">Eventos del Calendario</h2>
                <p className="text-[#A5B4FC]/50 text-xs mt-0.5">
                  {events.length} eventos — los cambios se reflejan en /calendario al instante
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm" variant="ghost" onClick={handleResetEvents}
                  className="text-[#A5B4FC]/50 hover:text-[#A5B4FC] h-8 px-3 text-xs"
                  title="Restaurar predeterminados"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />Restaurar
                </Button>
                <Button size="sm" onClick={openAddEvent} className="bg-primary/20 text-primary hover:bg-primary/30 border-0 h-8">
                  <Plus className="w-4 h-4 mr-1" />Nuevo evento
                </Button>
              </div>
            </div>

            <div className="bg-[#1D2B64] rounded-xl border border-white/10 overflow-hidden">
              <div className="grid grid-cols-[auto_1fr_120px_100px_80px] gap-4 px-5 py-3 border-b border-white/10 text-[#A5B4FC]/40 text-xs font-semibold uppercase tracking-wider">
                <span>Color</span><span>Título</span><span>Tipo</span><span>Fecha</span>
                <span className="text-right">Acciones</span>
              </div>
              {events.length === 0 ? (
                <div className="py-16 text-center text-[#A5B4FC]/40">
                  <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No hay eventos. Agrega el primero.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {events.map((e) => (
                    <div key={e.id} className="grid grid-cols-[auto_1fr_120px_100px_80px] gap-4 items-center px-5 py-3.5 hover:bg-white/5 transition-colors">
                      <div className="w-7 h-7 rounded-lg flex-none" style={{ backgroundColor: `${e.color}40`, border: `1.5px solid ${e.color}60` }}>
                        <div className="w-full h-full rounded-lg" style={{ backgroundColor: e.color }} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-medium text-sm truncate">{e.title}</div>
                        <div className="text-[#A5B4FC]/40 text-xs truncate mt-0.5">{e.description}</div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full w-fit font-medium ${EVENT_TYPE_COLORS[e.type] ?? "bg-gray-500/20 text-gray-400"}`}>{e.type}</span>
                      <div className="text-[#A5B4FC]/50 text-xs">{e.date}</div>
                      <div className="flex gap-1.5 justify-end">
                        <button onClick={() => openEditEvent(e)} className="w-7 h-7 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors" title="Editar">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteEvent(e.id)} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors" title="Eliminar">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CHAMPIONS TAB ────────────────────────────────────────────────── */}
        {tab === "champions" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-semibold">Tier List de Campeones</h2>
                <p className="text-[#A5B4FC]/50 text-xs mt-0.5">
                  {champions.length} campeones — los cambios se reflejan en /meta/campeones al instante
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm" variant="ghost" onClick={handleResetChampions}
                  className="text-[#A5B4FC]/50 hover:text-[#A5B4FC] h-8 px-3 text-xs"
                  title="Restaurar predeterminados"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />Restaurar
                </Button>
                <Button size="sm" onClick={openAddChamp} className="bg-primary/20 text-primary hover:bg-primary/30 border-0 h-8">
                  <Plus className="w-4 h-4 mr-1" />Nuevo campeón
                </Button>
              </div>
            </div>

            <div className="bg-[#1D2B64] rounded-xl border border-white/10 overflow-hidden">
              <div className="grid grid-cols-[auto_1fr_80px_60px_60px_60px_60px_80px] gap-3 px-5 py-3 border-b border-white/10 text-[#A5B4FC]/40 text-xs font-semibold uppercase tracking-wider">
                <span>Icon</span><span>Nombre</span><span>Rol</span><span>Tier</span>
                <span className="text-right">WR%</span><span className="text-right">PR%</span><span className="text-right">BR%</span>
                <span className="text-right">Acciones</span>
              </div>
              {champions.length === 0 ? (
                <div className="py-16 text-center text-[#A5B4FC]/40">
                  <Sword className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No hay campeones. Agrega el primero.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {champions.map((c) => (
                    <div key={c.id} className="grid grid-cols-[auto_1fr_80px_60px_60px_60px_60px_80px] gap-3 items-center px-5 py-3 hover:bg-white/5 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-none">
                        {c.icon}
                      </div>
                      <div className="text-white font-medium text-sm truncate">{c.name}</div>
                      <div className="text-[#A5B4FC]/60 text-xs">{c.role}</div>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${TIER_COLORS[c.tier] ?? "bg-gray-500/20 text-gray-400"}`}>{c.tier}</span>
                      <div className="text-right text-xs font-semibold text-[#A5B4FC]">{c.winrate}%</div>
                      <div className="text-right text-xs text-[#A5B4FC]/60">{c.pickrate}%</div>
                      <div className="text-right text-xs text-[#A5B4FC]/40">{c.banrate}%</div>
                      <div className="flex gap-1.5 justify-end">
                        <button onClick={() => openEditChamp(c)} className="w-7 h-7 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors" title="Editar">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteChamp(c.id)} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors" title="Eliminar">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ITEMS TAB ────────────────────────────────────────────────────── */}
        {tab === "items" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-semibold">Tier List de Items</h2>
                <p className="text-[#A5B4FC]/50 text-xs mt-0.5">
                  {items.length} items — los cambios se reflejan en /meta/items al instante
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm" variant="ghost" onClick={handleResetItems}
                  className="text-[#A5B4FC]/50 hover:text-[#A5B4FC] h-8 px-3 text-xs"
                  title="Restaurar predeterminados"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />Restaurar
                </Button>
                <Button size="sm" onClick={openAddItem} className="bg-primary/20 text-primary hover:bg-primary/30 border-0 h-8">
                  <Plus className="w-4 h-4 mr-1" />Nuevo item
                </Button>
              </div>
            </div>

            <div className="bg-[#1D2B64] rounded-xl border border-white/10 overflow-hidden">
              <div className="grid grid-cols-[auto_1fr_80px_60px_70px_70px_80px_80px] gap-3 px-5 py-3 border-b border-white/10 text-[#A5B4FC]/40 text-xs font-semibold uppercase tracking-wider">
                <span>Color</span><span>Nombre</span><span>Rol</span><span>Tier</span>
                <span className="text-right">WR%</span><span className="text-right">Uso%</span><span>Tipo</span>
                <span className="text-right">Acciones</span>
              </div>
              {items.length === 0 ? (
                <div className="py-16 text-center text-[#A5B4FC]/40">
                  <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No hay items. Agrega el primero.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-[auto_1fr_80px_60px_70px_70px_80px_80px] gap-3 items-center px-5 py-3 hover:bg-white/5 transition-colors">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-none"
                        style={{ backgroundColor: `${item.color}25`, color: item.color }}>
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="text-white font-medium text-sm truncate">{item.name}</div>
                      <div className="text-[#A5B4FC]/60 text-xs">{item.role}</div>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${TIER_COLORS[item.tier] ?? "bg-gray-500/20 text-gray-400"}`}>{item.tier}</span>
                      <div className="text-right text-xs font-semibold text-[#A5B4FC]">{item.winrate}%</div>
                      <div className="text-right text-xs text-[#A5B4FC]/60">{item.usage}%</div>
                      <div className="text-xs text-[#A5B4FC]/40 capitalize">{item.type}</div>
                      <div className="flex gap-1.5 justify-end">
                        <button onClick={() => openEditItem(item)} className="w-7 h-7 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors" title="Editar">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteItem(item.id)} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors" title="Eliminar">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── BUILDS TAB ───────────────────────────────────────────────────── */}
        {tab === "builds" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-semibold">Builds Recomendadas</h2>
                <p className="text-[#A5B4FC]/50 text-xs mt-0.5">
                  {builds.length} builds — los cambios se reflejan en /meta/items al instante
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm" variant="ghost" onClick={handleResetBuilds}
                  className="text-[#A5B4FC]/50 hover:text-[#A5B4FC] h-8 px-3 text-xs"
                  title="Restaurar predeterminados"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />Restaurar
                </Button>
                <Button size="sm" onClick={openAddBuild} className="bg-primary/20 text-primary hover:bg-primary/30 border-0 h-8">
                  <Plus className="w-4 h-4 mr-1" />Nueva build
                </Button>
              </div>
            </div>

            <div className="bg-[#1D2B64] rounded-xl border border-white/10 overflow-hidden">
              <div className="grid grid-cols-[1fr_80px_60px_1fr_80px] gap-3 px-5 py-3 border-b border-white/10 text-[#A5B4FC]/40 text-xs font-semibold uppercase tracking-wider">
                <span>Campeón</span><span>Rol</span><span className="text-right">WR%</span><span>Items</span>
                <span className="text-right">Acciones</span>
              </div>
              {builds.length === 0 ? (
                <div className="py-16 text-center text-[#A5B4FC]/40">
                  <Layers className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No hay builds. Agrega la primera.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {builds.map((b) => (
                    <div key={b.id} className="grid grid-cols-[1fr_80px_60px_1fr_80px] gap-3 items-center px-5 py-3 hover:bg-white/5 transition-colors">
                      <div className="text-white font-medium text-sm truncate">{b.champion}</div>
                      <div className="text-[#A5B4FC]/60 text-xs">{b.role}</div>
                      <div className="text-right text-xs font-semibold text-green-400">{b.winrate}%</div>
                      <div className="flex flex-wrap gap-1">
                        {b.items.map((item, j) => (
                          <span key={j} className="px-1.5 py-0.5 bg-primary/10 border border-primary/20 rounded text-xs text-primary">{item}</span>
                        ))}
                      </div>
                      <div className="flex gap-1.5 justify-end">
                        <button onClick={() => openEditBuild(b)} className="w-7 h-7 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors" title="Editar">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteBuild(b.id)} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors" title="Eliminar">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── USERS TAB ────────────────────────────────────────────────────── */}
        {tab === "users" && (
          <div className="bg-[#1D2B64] rounded-xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-white font-semibold">Usuarios registrados ({users.length})</h2>
              <Button size="sm" onClick={() => setShowAddUser(!showAddUser)} className="bg-primary/20 text-primary hover:bg-primary/30 border-0">
                <Plus className="w-4 h-4 mr-1" />Agregar usuario
              </Button>
            </div>
            {showAddUser && (
              <div className="px-6 py-4 border-b border-white/10 bg-primary/5">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} placeholder="Usuario (min. 4)" className="bg-[#0B1635] border-white/10 text-white" />
                  <Input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} placeholder="Contraseña (min. 4)" className="bg-[#0B1635] border-white/10 text-white" />
                  <Button onClick={handleAddUser} className="bg-green-600 hover:bg-green-600/90 text-white flex-none">
                    <Save className="w-4 h-4 mr-1" />Crear
                  </Button>
                </div>
                {addUserError && <p className="text-red-400 text-xs mt-2">{addUserError}</p>}
              </div>
            )}
            <div className="divide-y divide-white/5">
              {users.map((user) => (
                <div key={user.username} className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-none">
                    {user.username.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm">{user.username}</span>
                      {user.isAdmin && <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">Admin</span>}
                    </div>
                    <div className="text-[#A5B4FC]/40 text-xs mt-0.5">Cuenta local</div>
                  </div>
                  <div className="flex gap-2">
                    {user.username !== "admin" && (
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteUser(user.username)} className="text-red-400/60 hover:text-red-400 hover:bg-red-400/10 h-8 px-3 text-xs">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Server registered users — profile editing */}
            {serverUsers.length > 0 && (
              <div className="border-t border-white/10">
                <div className="px-6 py-3 text-[#A5B4FC]/40 text-xs font-semibold uppercase tracking-wider">
                  Cuentas del servidor ({serverUsers.length}) — edita perfil competitivo
                </div>
                <div className="divide-y divide-white/5">
                  {serverUsers.map((u) => (
                    <div key={u.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-teal-500/20 flex items-center justify-center text-sm font-bold text-teal-400 flex-none">
                        {(u.username ?? "?").slice(0, 1).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-sm">{u.username ?? "—"}</div>
                        <div className="text-[#A5B4FC]/40 text-xs mt-0.5">
                          {u.rango ?? "Sin rango"} · {u.servidor ? `Servidor: ${u.servidor}` : "Servidor: —"} · {u.partidas != null ? `${u.partidas} partidas` : "Sin partidas"}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleEditPerfil(u)} className="text-[#A5B4FC] hover:text-white hover:bg-white/10 h-8 px-3 text-xs">
                        <Globe className="w-3.5 h-3.5 mr-1" />Editar perfil
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STATS TAB ────────────────────────────────────────────────────── */}
        {tab === "stats" && (
          <div className="space-y-4">
            <p className="text-[#A5B4FC]/60 text-sm">Edita las estadísticas de cualquier usuario.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map((user) => (
                <div key={user.username} className="bg-[#1D2B64] rounded-xl border border-white/10 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                        {user.username.slice(0, 1).toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{user.username}</span>
                    </div>
                    {editingUser === user.username ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveStats} className="bg-green-600 hover:bg-green-600/90 text-white h-8 px-3 text-xs">
                          <Save className="w-3.5 h-3.5 mr-1" />Guardar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { setEditingUser(null); setEditStats(null); }} className="text-[#A5B4FC] h-8 px-3 text-xs">
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => handleEditStats(user)} className="text-[#A5B4FC] hover:text-white h-8 px-3 text-xs">
                        Editar
                      </Button>
                    )}
                  </div>
                  {editingUser === user.username && editStats ? (
                    <div className="grid grid-cols-2 gap-3">
                      {(Object.keys(editStats) as (keyof UserStats)[]).map((key) => (
                        <div key={key}>
                          <label className="text-xs text-[#A5B4FC]/50 capitalize">{key}</label>
                          <Input value={editStats[key]} onChange={(e) => setEditStats({ ...editStats, [key]: e.target.value })} className="bg-[#0B1635] border-white/10 text-white text-sm h-8 mt-1" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(user.stats).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-[#A5B4FC]/50 capitalize">{k}:</span>
                          <span className="text-white font-medium">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CONTRIBUTIONS TAB ────────────────────────────────────────────── */}
        {tab === "contributions" && (
          <div className="bg-[#1D2B64] rounded-xl border border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-white font-semibold">Contribuciones ({contributions.length})</h2>
            </div>
            {contributions.length === 0 ? (
              <div className="py-16 text-center text-[#A5B4FC]/40">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No hay contribuciones todavía</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {contributions.map((c) => (
                  <div key={c.id} className="flex items-start gap-4 px-6 py-4 hover:bg-white/5 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-white font-medium text-sm">{c.title}</span>
                        <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">{c.type}</span>
                        {c.approved
                          ? <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">Aprobado</span>
                          : <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">Pendiente</span>
                        }
                      </div>
                      <p className="text-[#A5B4FC]/60 text-xs leading-relaxed line-clamp-2">{c.description}</p>
                      <div className="text-[#A5B4FC]/30 text-xs mt-1">Por {c.author} · {c.date}</div>
                    </div>
                    <div className="flex gap-2 flex-none">
                      {!c.approved && (
                        <button onClick={() => handleApprove(c.id)} className="p-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors" title="Aprobar">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => handleDeleteContribution(c.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" title="Eliminar">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── PATCH DIALOG ──────────────────────────────────────────────────────── */}
      <Dialog open={patchDialogOpen} onOpenChange={setPatchDialogOpen}>
        <DialogContent className="bg-[#1D2B64] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-lg">
              {editingPatch ? "Editar parche" : "Nuevo parche"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Versión *</label>
                <Input value={patchForm.version} onChange={(e) => setPatchForm({ ...patchForm, version: e.target.value })} placeholder="Ej: 7.1" className="bg-[#0B1635] border-white/10 text-white placeholder:text-[#A5B4FC]/30 h-9" />
              </div>
              <div>
                <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Tipo *</label>
                <select value={patchForm.type} onChange={(e) => setPatchForm({ ...patchForm, type: e.target.value })} className="w-full h-9 rounded-md bg-[#0B1635] border border-white/10 text-white text-sm px-3 focus:outline-none focus:border-primary/50">
                  {PATCH_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Título *</label>
              <Input value={patchForm.title} onChange={(e) => setPatchForm({ ...patchForm, title: e.target.value })} placeholder="Ej: Patch 7.1 – Rune Overhaul" className="bg-[#0B1635] border-white/10 text-white placeholder:text-[#A5B4FC]/30 h-9" />
            </div>
            <div>
              <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Fecha *</label>
              <Input type="date" value={patchForm.date} onChange={(e) => setPatchForm({ ...patchForm, date: e.target.value })} className="bg-[#0B1635] border-white/10 text-white h-9" />
            </div>
            <div>
              <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Descripción *</label>
              <textarea value={patchForm.summary} onChange={(e) => setPatchForm({ ...patchForm, summary: e.target.value })} placeholder="Describe los cambios de este parche..." rows={3} className="w-full rounded-md bg-[#0B1635] border border-white/10 text-white placeholder:text-[#A5B4FC]/30 text-sm px-3 py-2 focus:outline-none focus:border-primary/50 resize-none" />
            </div>
            <div>
              <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">URL de imagen <span className="text-[#A5B4FC]/30 font-normal">(opcional)</span></label>
              <Input value={patchForm.image_url} onChange={(e) => setPatchForm({ ...patchForm, image_url: e.target.value })} placeholder="https://ejemplo.com/imagen.jpg" className="bg-[#0B1635] border-white/10 text-white placeholder:text-[#A5B4FC]/30 h-9" />
              {patchForm.image_url.trim() ? (
                <ImagePreview
                  url={patchForm.image_url}
                  className="mt-2 h-28 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center bg-[#0B1635]"
                  imgClassName="w-full h-full object-cover"
                  fallback={<span className="text-[#A5B4FC]/40 text-xs px-3 text-center">No se pudo cargar la imagen</span>}
                />
              ) : (
                <p className="text-[#A5B4FC]/30 text-xs mt-1.5">Si la dejas vacía, se usa el color de fondo de abajo.</p>
              )}
            </div>
            <div>
              <label className="text-xs text-[#A5B4FC]/60 mb-2 block font-medium">Color de fondo <span className="text-[#A5B4FC]/30 font-normal">(si no hay imagen)</span></label>
              <div className="flex flex-wrap gap-2">
                {GRADIENT_OPTIONS.map((g) => (
                  <button key={g.value} type="button" onClick={() => setPatchForm({ ...patchForm, image: g.value })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${patchForm.image === g.value ? "border-primary/60 bg-primary/10 text-white" : "border-white/10 text-[#A5B4FC]/60 hover:border-white/20 hover:text-white"}`}>
                    <span className={`w-3.5 h-3.5 rounded-sm bg-gradient-to-br ${g.css} flex-none`} />
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
            {patchFormError && <p className="text-red-400 text-xs">{patchFormError}</p>}
            <div className="flex gap-3 pt-1">
              <Button onClick={handleSavePatch} disabled={patchSaving} className="flex-1 bg-primary hover:bg-primary/90 text-white disabled:opacity-60">
                <Save className="w-4 h-4 mr-2" />
                {patchSaving ? "Guardando..." : editingPatch ? "Guardar cambios" : "Crear parche"}
              </Button>
              <Button variant="ghost" onClick={() => setPatchDialogOpen(false)} disabled={patchSaving} className="text-[#A5B4FC] hover:text-white">
                <X className="w-4 h-4 mr-1" />Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── EVENT DIALOG ──────────────────────────────────────────────────────── */}
      <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
        <DialogContent className="bg-[#1D2B64] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-lg">
              {editingEvent ? "Editar evento" : "Nuevo evento"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Título *</label>
              <Input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="Ej: Patch 7.2 Release" className="bg-[#0B1635] border-white/10 text-white placeholder:text-[#A5B4FC]/30 h-9" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Fecha *</label>
                <Input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className="bg-[#0B1635] border-white/10 text-white h-9" />
              </div>
              <div>
                <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Tipo *</label>
                <select value={eventForm.type} onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })} className="w-full h-9 rounded-md bg-[#0B1635] border border-white/10 text-white text-sm px-3 focus:outline-none focus:border-primary/50">
                  {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Descripción *</label>
              <textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} placeholder="Describe el evento..." rows={3} className="w-full rounded-md bg-[#0B1635] border border-white/10 text-white placeholder:text-[#A5B4FC]/30 text-sm px-3 py-2 focus:outline-none focus:border-primary/50 resize-none" />
            </div>
            <div>
              <label className="text-xs text-[#A5B4FC]/60 mb-2 block font-medium">Color del evento</label>
              <div className="flex flex-wrap gap-2">
                {EVENT_COLOR_OPTIONS.map((c) => (
                  <button key={c.value} type="button" onClick={() => setEventForm({ ...eventForm, color: c.value })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${eventForm.color === c.value ? "border-primary/60 bg-primary/10 text-white" : "border-white/10 text-[#A5B4FC]/60 hover:border-white/20 hover:text-white"}`}>
                    <span className="w-3.5 h-3.5 rounded-full flex-none" style={{ backgroundColor: c.value }} />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            {eventFormError && <p className="text-red-400 text-xs">{eventFormError}</p>}
            <div className="flex gap-3 pt-1">
              <Button onClick={handleSaveEvent} disabled={eventSaving} className="flex-1 bg-primary hover:bg-primary/90 text-white disabled:opacity-60">
                <Save className="w-4 h-4 mr-2" />
                {eventSaving ? "Guardando..." : editingEvent ? "Guardar cambios" : "Crear evento"}
              </Button>
              <Button variant="ghost" onClick={() => setEventDialogOpen(false)} disabled={eventSaving} className="text-[#A5B4FC] hover:text-white">
                <X className="w-4 h-4 mr-1" />Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── CHAMPION DIALOG ───────────────────────────────────────────────────── */}
      <Dialog open={champDialogOpen} onOpenChange={setChampDialogOpen}>
        <DialogContent className="bg-[#1D2B64] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-lg">
              {editingChamp ? "Editar campeón" : "Nuevo campeón"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Nombre *</label>
                <Input value={champForm.name} onChange={(e) => setChampForm({ ...champForm, name: e.target.value })} placeholder="Ej: Jinx" className="bg-[#0B1635] border-white/10 text-white placeholder:text-[#A5B4FC]/30 h-9" />
              </div>
              <div>
                <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Icono (2 chars)</label>
                <Input value={champForm.icon} onChange={(e) => setChampForm({ ...champForm, icon: e.target.value.slice(0, 2).toUpperCase() })} placeholder="Auto" className="bg-[#0B1635] border-white/10 text-white placeholder:text-[#A5B4FC]/30 h-9" maxLength={2} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Rol</label>
                <select value={champForm.role} onChange={(e) => setChampForm({ ...champForm, role: e.target.value })} className="w-full h-9 rounded-md bg-[#0B1635] border border-white/10 text-white text-sm px-3 focus:outline-none focus:border-primary/50">
                  {CHAMP_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Tier</label>
                <select value={champForm.tier} onChange={(e) => setChampForm({ ...champForm, tier: e.target.value })} className="w-full h-9 rounded-md bg-[#0B1635] border border-white/10 text-white text-sm px-3 focus:outline-none focus:border-primary/50">
                  {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Winrate %</label>
                <Input type="number" min={0} max={100} step={0.1} value={champForm.winrate} onChange={(e) => setChampForm({ ...champForm, winrate: Number(e.target.value) })} className="bg-[#0B1635] border-white/10 text-white h-9" />
              </div>
              <div>
                <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Pickrate %</label>
                <Input type="number" min={0} max={100} step={0.1} value={champForm.pickrate} onChange={(e) => setChampForm({ ...champForm, pickrate: Number(e.target.value) })} className="bg-[#0B1635] border-white/10 text-white h-9" />
              </div>
              <div>
                <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Banrate %</label>
                <Input type="number" min={0} max={100} step={0.1} value={champForm.banrate} onChange={(e) => setChampForm({ ...champForm, banrate: Number(e.target.value) })} className="bg-[#0B1635] border-white/10 text-white h-9" />
              </div>
            </div>
            <div>
              <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">URL de imagen <span className="text-[#A5B4FC]/30 font-normal">(opcional)</span></label>
              <div className="flex items-center gap-3">
                <Input value={champForm.image_url} onChange={(e) => setChampForm({ ...champForm, image_url: e.target.value })} placeholder="https://ejemplo.com/campeon.png" className="bg-[#0B1635] border-white/10 text-white placeholder:text-[#A5B4FC]/30 h-9 flex-1" />
                <ImagePreview
                  url={champForm.image_url}
                  className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center overflow-hidden flex-none"
                  imgClassName="w-full h-full object-cover"
                  fallback={<span className="text-xs font-bold text-primary">{champForm.icon.trim() || champForm.name.slice(0, 2).toUpperCase() || "?"}</span>}
                />
              </div>
              <p className="text-[#A5B4FC]/30 text-xs mt-1.5">Si la dejas vacía, se usan las iniciales del campeón.</p>
            </div>
            {champFormError && <p className="text-red-400 text-xs">{champFormError}</p>}
            <div className="flex gap-3 pt-1">
              <Button onClick={handleSaveChamp} disabled={champSaving} className="flex-1 bg-primary hover:bg-primary/90 text-white disabled:opacity-60">
                <Save className="w-4 h-4 mr-2" />
                {champSaving ? "Guardando..." : editingChamp ? "Guardar cambios" : "Crear campeón"}
              </Button>
              <Button variant="ghost" onClick={() => setChampDialogOpen(false)} disabled={champSaving} className="text-[#A5B4FC] hover:text-white">
                <X className="w-4 h-4 mr-1" />Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── BUILD DIALOG ──────────────────────────────────────────────────────── */}
      <Dialog open={buildDialogOpen} onOpenChange={setBuildDialogOpen}>
        <DialogContent className="bg-[#1D2B64] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-lg">
              {editingBuild ? "Editar build" : "Nueva build recomendada"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Campeón *</label>
                <Input value={buildForm.champion} onChange={(e) => setBuildForm({ ...buildForm, champion: e.target.value })} placeholder="Ej: Ahri" className="bg-[#0B1635] border-white/10 text-white placeholder:text-[#A5B4FC]/30 h-9" />
              </div>
              <div>
                <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Rol</label>
                <select value={buildForm.role} onChange={(e) => setBuildForm({ ...buildForm, role: e.target.value })} className="w-full h-9 rounded-md bg-[#0B1635] border border-white/10 text-white text-sm px-3 focus:outline-none focus:border-primary/50">
                  {BUILD_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Winrate %</label>
              <Input type="number" min={0} max={100} step={0.1} value={buildForm.winrate} onChange={(e) => setBuildForm({ ...buildForm, winrate: Number(e.target.value) })} className="bg-[#0B1635] border-white/10 text-white h-9" />
            </div>
            <div>
              <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Items * <span className="text-[#A5B4FC]/30 font-normal">(separados por coma)</span></label>
              <textarea value={buildForm.itemsRaw} onChange={(e) => setBuildForm({ ...buildForm, itemsRaw: e.target.value })} placeholder="Ej: Luden's Tempest, Rabadon's Deathcap, Lich Bane" rows={3} className="w-full rounded-md bg-[#0B1635] border border-white/10 text-white placeholder:text-[#A5B4FC]/30 text-sm px-3 py-2 focus:outline-none focus:border-primary/50 resize-none" />
              {buildForm.itemsRaw && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {buildForm.itemsRaw.split(",").map((s) => s.trim()).filter(Boolean).map((item, i) => (
                    <span key={i} className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-xs text-primary">{item}</span>
                  ))}
                </div>
              )}
            </div>
            {buildFormError && <p className="text-red-400 text-xs">{buildFormError}</p>}
            <div className="flex gap-3 pt-1">
              <Button onClick={handleSaveBuild} disabled={buildSaving} className="flex-1 bg-primary hover:bg-primary/90 text-white disabled:opacity-60">
                <Save className="w-4 h-4 mr-2" />
                {buildSaving ? "Guardando..." : editingBuild ? "Guardar cambios" : "Crear build"}
              </Button>
              <Button variant="ghost" onClick={() => setBuildDialogOpen(false)} disabled={buildSaving} className="text-[#A5B4FC] hover:text-white">
                <X className="w-4 h-4 mr-1" />Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── ITEM DIALOG ───────────────────────────────────────────────────────── */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent className="bg-[#1D2B64] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-lg">
              {editingItem ? "Editar item" : "Nuevo item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Nombre *</label>
              <Input value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} placeholder="Ej: Trinity Force" className="bg-[#0B1635] border-white/10 text-white placeholder:text-[#A5B4FC]/30 h-9" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Rol</label>
                <select value={itemForm.role} onChange={(e) => setItemForm({ ...itemForm, role: e.target.value })} className="w-full h-9 rounded-md bg-[#0B1635] border border-white/10 text-white text-sm px-3 focus:outline-none focus:border-primary/50">
                  {ITEM_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Tier</label>
                <select value={itemForm.tier} onChange={(e) => setItemForm({ ...itemForm, tier: e.target.value })} className="w-full h-9 rounded-md bg-[#0B1635] border border-white/10 text-white text-sm px-3 focus:outline-none focus:border-primary/50">
                  {TIERS.slice(0, 5).map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Tipo</label>
                <select value={itemForm.type} onChange={(e) => setItemForm({ ...itemForm, type: e.target.value })} className="w-full h-9 rounded-md bg-[#0B1635] border border-white/10 text-white text-sm px-3 focus:outline-none focus:border-primary/50">
                  {ITEM_TYPES_LIST.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Winrate %</label>
                <Input type="number" min={0} max={100} step={0.1} value={itemForm.winrate} onChange={(e) => setItemForm({ ...itemForm, winrate: Number(e.target.value) })} className="bg-[#0B1635] border-white/10 text-white h-9" />
              </div>
              <div>
                <label className="text-xs text-[#A5B4FC]/60 mb-1.5 block font-medium">Uso %</label>
                <Input type="number" min={0} max={100} step={0.1} value={itemForm.usage} onChange={(e) => setItemForm({ ...itemForm, usage: Number(e.target.value) })} className="bg-[#0B1635] border-white/10 text-white h-9" />
              </div>
            </div>
            <div>
              <label className="text-xs text-[#A5B4FC]/60 mb-2 block font-medium">Color del item</label>
              <div className="flex flex-wrap gap-2">
                {ITEM_COLOR_OPTIONS.map((c) => (
                  <button key={c.value} type="button" onClick={() => setItemForm({ ...itemForm, color: c.value })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${itemForm.color === c.value ? "border-primary/60 bg-primary/10 text-white" : "border-white/10 text-[#A5B4FC]/60 hover:border-white/20 hover:text-white"}`}>
                    <span className="w-3.5 h-3.5 rounded-full flex-none" style={{ backgroundColor: c.value }} />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            {itemFormError && <p className="text-red-400 text-xs">{itemFormError}</p>}
            <div className="flex gap-3 pt-1">
              <Button onClick={handleSaveItem} disabled={itemSaving} className="flex-1 bg-primary hover:bg-primary/90 text-white disabled:opacity-60">
                <Save className="w-4 h-4 mr-2" />
                {itemSaving ? "Guardando..." : editingItem ? "Guardar cambios" : "Crear item"}
              </Button>
              <Button variant="ghost" onClick={() => setItemDialogOpen(false)} disabled={itemSaving} className="text-[#A5B4FC] hover:text-white">
                <X className="w-4 h-4 mr-1" />Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── PROFILE EDIT DIALOG ───────────────────────────────────────────────── */}
      <Dialog open={!!profileEditId} onOpenChange={(open) => { if (!open) setProfileEditId(null); }}>
        <DialogContent className="bg-[#1D2B64] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-teal-400" />
              Editar perfil competitivo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#A5B4FC] text-sm mb-1">Servidor</label>
                <Input
                  placeholder="EUW, NA, LATAM…"
                  value={profileForm.servidor}
                  onChange={(e) => setProfileForm({ ...profileForm, servidor: e.target.value })}
                  className="bg-[#0B1635] border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-[#A5B4FC] text-sm mb-1">Rango</label>
                <Input
                  placeholder="Plata III, Oro I…"
                  value={profileForm.rango}
                  onChange={(e) => setProfileForm({ ...profileForm, rango: e.target.value })}
                  className="bg-[#0B1635] border-white/10 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[#A5B4FC] text-sm mb-1">Partidas</label>
                <Input
                  type="number" min={0}
                  placeholder="0"
                  value={profileForm.partidas}
                  onChange={(e) => setProfileForm({ ...profileForm, partidas: e.target.value })}
                  className="bg-[#0B1635] border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-[#A5B4FC] text-sm mb-1">Victorias</label>
                <Input
                  type="number" min={0}
                  placeholder="0"
                  value={profileForm.victorias}
                  onChange={(e) => setProfileForm({ ...profileForm, victorias: e.target.value })}
                  className="bg-[#0B1635] border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-[#A5B4FC] text-sm mb-1">Derrotas</label>
                <Input
                  type="number" min={0}
                  placeholder="0"
                  value={profileForm.derrotas}
                  onChange={(e) => setProfileForm({ ...profileForm, derrotas: e.target.value })}
                  className="bg-[#0B1635] border-white/10 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#A5B4FC] text-sm mb-1">KDA Promedio</label>
                <Input
                  placeholder="3.2 / 2.1 / 7.8"
                  value={profileForm.kda}
                  onChange={(e) => setProfileForm({ ...profileForm, kda: e.target.value })}
                  className="bg-[#0B1635] border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-[#A5B4FC] text-sm mb-1">Winrate (%)</label>
                <Input
                  placeholder="58.3"
                  value={profileForm.winrate}
                  onChange={(e) => setProfileForm({ ...profileForm, winrate: e.target.value })}
                  className="bg-[#0B1635] border-white/10 text-white"
                />
              </div>
            </div>
            {profileError && <p className="text-red-400 text-xs">{profileError}</p>}
            <div className="flex gap-3 pt-1">
              <Button
                onClick={handleSavePerfil}
                disabled={profileSaving}
                className="flex-1 bg-primary hover:bg-primary/90 text-white disabled:opacity-60"
              >
                <Save className="w-4 h-4 mr-2" />
                {profileSaving ? "Guardando..." : "Guardar perfil"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setProfileEditId(null)}
                disabled={profileSaving}
                className="text-[#A5B4FC] hover:text-white"
              >
                <X className="w-4 h-4 mr-1" />Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
