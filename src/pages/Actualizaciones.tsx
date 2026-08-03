import { useEffect, useRef, useState } from "react";
import { useSearch } from "wouter";
import { Search, Calendar, Users, TrendingUp, TrendingDown, Minus, Sparkles, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getContributions } from "@/lib/auth";
import { fetchPatches, fetchPatchUpdates, type PatchEntry, type PatchUpdateEntry } from "@/lib/content";

const patchGradients: Record<string, string> = {
  "gradient-purple": "from-purple-900/80 to-indigo-900/80",
  "gradient-blue": "from-blue-900/80 to-cyan-900/80",
  "gradient-gold": "from-yellow-900/80 to-amber-900/80",
  "gradient-red": "from-red-900/80 to-rose-900/80",
  "gradient-orange": "from-orange-900/80 to-amber-900/80",
  "gradient-teal": "from-teal-900/80 to-emerald-900/80",
  "gradient-yellow": "from-yellow-900/80 to-lime-900/80",
  "gradient-green": "from-green-900/80 to-teal-900/80",
};

const patchTypeColors: Record<string, string> = {
  "Parche": "bg-purple-500/20 text-purple-400",
  "Temporada": "bg-orange-500/20 text-orange-400",
  "Campeón": "bg-red-500/20 text-red-400",
  "Evento": "bg-green-500/20 text-green-400",
  "Torneo": "bg-yellow-500/20 text-yellow-400",
};

const allTypes = ["Todos", "Parche", "Temporada", "Campeón", "Evento", "Torneo"];

function formatMonth(ym: string) {
  const [year, month] = ym.split("-");
  const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

type DisplayItem = {
  id: string | number;
  title: string;
  summary: string;
  date: string;
  version: string;
  type: string;
  image: string;
  image_url?: string | null;
  isContrib: boolean;
  author?: string;
  contrib?: ReturnType<typeof getContributions>[0];
};

function PatchImage({ imageUrl, version, title, versionClassName }: {
  imageUrl?: string | null;
  version: string;
  title: string;
  versionClassName: string;
}) {
  const [errored, setErrored] = useState(false);
  if (imageUrl && !errored) {
    return (
      <img
        key={imageUrl}
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={() => setErrored(true)}
      />
    );
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className={versionClassName}>{version}</span>
    </div>
  );
}

const changeTypeConfig: Record<string, { label: string; border: string; bg: string; text: string; icon: React.ReactNode }> = {
  buff: {
    label: "Buff",
    border: "border-green-500/50",
    bg: "bg-green-500/10",
    text: "text-green-400",
    icon: <TrendingUp className="w-3.5 h-3.5" />,
  },
  nerf: {
    label: "Nerf",
    border: "border-red-500/50",
    bg: "bg-red-500/10",
    text: "text-red-400",
    icon: <TrendingDown className="w-3.5 h-3.5" />,
  },
  ajuste: {
    label: "Ajuste",
    border: "border-yellow-500/50",
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    icon: <Minus className="w-3.5 h-3.5" />,
  },
  nuevo: {
    label: "Nuevo",
    border: "border-purple-500/50",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    icon: <Sparkles className="w-3.5 h-3.5" />,
  },
  default: {
    label: "Cambio",
    border: "border-white/30",
    bg: "bg-white/5",
    text: "text-white",
    icon: null,
  },
};

export default function Actualizaciones() {
  const [, setSearch] = useSearch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
  const [showOnlyContrib, setShowOnlyContrib] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "type">("date");
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DisplayItem | null>(null);

  const [patches, setPatches] = useState<PatchEntry[]>([]);
  const [patchUpdates, setPatchUpdates] = useState<PatchUpdateEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const contributions = getContributions();

  useEffect(() => {
    async function load() {
      try {
        const [p, u] = await Promise.all([fetchPatches(), fetchPatchUpdates()]);
        setPatches(p);
        setPatchUpdates(u);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const contribByPatch: Record<string, ReturnType<typeof getContributions>> = {};
  contributions.forEach((c) => {
    const key = c.title;
    if (!contribByPatch[key]) contribByPatch[key] = [];
    contribByPatch[key].push(c);
  });

  const displayItems: DisplayItem[] = patches.map((p) => {
    const contribs = contribByPatch[p.title] ?? [];
    if (contribs.length > 0) {
      return contribs.map((c) => ({
        id: `${p.id}-${c.id}`,
        title: c.title,
        summary: c.description,
        date: c.date,
        version: p.version,
        type: p.type,
        image: p.image,
        image_url: p.image_url,
        isContrib: true,
        author: c.author,
        contrib: c,
      }));
    }
    return {
      id: p.id,
      title: p.title,
      summary: p.summary,
      date: p.date,
      version: p.version,
      type: p.type,
      image: p.image,
      image_url: p.image_url,
      isContrib: false,
    };
  }).flat();

  const filtered = displayItems
    .filter((item) => {
      if (selectedType !== "Todos" && item.type !== selectedType) return false;
      if (showOnlyContrib && !item.isContrib) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const haystack = `${item.title} ${item.summary} ${item.version} ${item.type}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime();
      return a.type.localeCompare(b.type);
    });

  const grouped = filtered.reduce((acc, item) => {
    const monthKey = item.date.slice(0, 7);
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(item);
    return acc;
  }, {} as Record<string, DisplayItem[]>);

  const monthKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  function handleOpen(item: DisplayItem) {
    setSelectedItem(item);
    setDialogOpen(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#A5B4FC]/60">Cargando actualizaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Actualizaciones</h1>
          <p className="text-[#A5B4FC]/70">Parches, eventos, torneos y todo lo nuevo en Wild Rift</p>
        </div>

        <div className="bg-[#1D2B64] border border-white/10 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A5B4FC]/40" />
            <Input
              placeholder="Buscar parche, evento, campeón..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#0B1635] border-white/10 text-white placeholder:text-[#A5B4FC]/30"
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {allTypes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedType === t
                    ? "bg-primary text-white"
                    : "text-[#A5B4FC] hover:text-white hover:bg-white/5"
                }`}
              >
                {t}
              </button>
            ))}
            <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-[#A5B4FC] hover:text-white hover:bg-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyContrib}
                onChange={(e) => setShowOnlyContrib(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              Solo contribuciones
            </label>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "type")}
              className="w-full sm:w-auto px-3 py-2 rounded-lg bg-[#0B1635] border border-white/10 text-white text-sm focus:outline-none focus:border-primary/50"
            >
              <option value="date">Fecha (nuevos primero)</option>
              <option value="type">Tipo</option>
            </select>
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2 rounded-lg ${viewMode === "cards" ? "bg-primary text-white" : "text-[#A5B4FC] hover:text-white hover:bg-white/5"}`}
              >
                <Calendar className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${viewMode === "list" ? "bg-primary text-white" : "text-[#A5B4FC] hover:text-white hover:bg-white/5"}`}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {monthKeys.length === 0 ? (
          <div className="bg-[#1D2B64] border border-white/10 rounded-2xl p-12 text-center text-[#A5B4FC]/40">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg">No hay actualizaciones que coincidan</p>
            <p className="text-sm mt-1">Intenta cambiar los filtros o la búsqueda</p>
          </div>
        ) : (
          <div className="space-y-8">
            {monthKeys.map((monthKey) => (
              <section key={monthKey}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-white font-semibold text-lg flex-shrink-0">{formatMonth(monthKey)}</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                {viewMode === "cards" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {grouped[monthKey].map((item) => (
                      <article
                        key={item.id}
                        onClick={() => handleOpen(item)}
                        className="bg-[#1D2B64] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all cursor-pointer group"
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <div className={patchGradients[item.image] ?? "from-purple-900/80 to-indigo-900/80"}>
                            <PatchImage
                              imageUrl={item.image_url}
                              version={item.version}
                              title={item.title}
                              versionClassName="text-3xl font-bold text-white/80"
                            />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${patchTypeColors[item.type] ?? "bg-gray-500/20 text-gray-400"}`}>
                              {item.type}
                            </span>
                            {item.isContrib && (
                              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-400">
                                <Users className="w-3 h-3" />
                                Contribución
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="text-white font-semibold text-base mb-2 line-clamp-1">{item.title}</div>
                          <div className="text-[#A5B4FC]/60 text-sm line-clamp-2">{item.summary}</div>
                          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
                            <span className="text-[#A5B4FC]/40 text-xs flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(item.date).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                            <span className="text-[#A5B4FC]/40 text-xs font-mono">v{item.version}</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#1D2B64] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-5 py-3 border-b border-white/10 text-[#A5B4FC]/40 text-xs font-semibold uppercase tracking-wider">
                      <span>Fecha</span>
                      <span>Actualización</span>
                      <span>Tipo</span>
                      <span className="text-right">Versión</span>
                    </div>
                    <div className="divide-y divide-white/5">
                      {grouped[monthKey].map((item) => (
                        <div key={item.id} onClick={() => handleOpen(item)} className="grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-white/5 transition-colors cursor-pointer">
                          <div className="text-[#A5B4FC]/60 text-sm">
                            {new Date(item.date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                          </div>
                          <div className="min-w-0">
                            <div className="text-white font-medium text-sm truncate">{item.title}</div>
                            <div className="text-[#A5B4FC]/50 text-xs truncate mt-0.5">{item.summary}</div>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${patchTypeColors[item.type] ?? "bg-gray-500/20 text-gray-400"}`}>
                            {item.type}
                            {item.isContrib && <span className="ml-1">★</span>}
                          </span>
                          <span className="text-[#A5B4FC]/60 text-xs font-mono text-right">v{item.version}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>
        )}

        {/* Detail Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-[#1D2B64] border-white/10 text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-white text-lg flex items-center gap-2">
                {selectedItem && (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${patchTypeColors[selectedItem.type] ?? "bg-gray-500/20 text-gray-400"}`}>
                    {selectedItem.type}
                  </span>
                )}
                Detalle de actualización
              </DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4 mt-2">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className={`relative aspect-video rounded-xl overflow-hidden flex-1 ${patchGradients[selectedItem.image] ?? "from-purple-900/80 to-indigo-900/80"}`}>
                    <PatchImage
                      imageUrl={selectedItem.image_url}
                      version={selectedItem.version}
                      title={selectedItem.title}
                      versionClassName="text-4xl font-bold text-white/80"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedItem.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${patchTypeColors[selectedItem.type] ?? "bg-gray-500/20 text-gray-400"}`}>
                        {selectedItem.type}
                      </span>
                      <span className="text-[#A5B4FC]/60 text-sm flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(selectedItem.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                      <span className="text-[#A5B4FC]/60 text-sm font-mono">v{selectedItem.version}</span>
                    </div>
                    {selectedItem.isContrib && selectedItem.contrib && (
                      <div className="flex items-center gap-2 text-purple-400 text-sm">
                        <Users className="w-4 h-4" />
                        Contribución de <span className="font-medium">{selectedItem.author}</span>
                        {selectedItem.contrib.approved && <span className="text-green-400">✓ Aprobada</span>}
                      </div>
                    )}
                  </div>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-[#A5B4FC]/80 leading-relaxed">{selectedItem.summary}</p>
                </div>
                {selectedItem.isContrib && selectedItem.contrib && (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <h4 className="text-white font-medium mb-2">Comentario del autor</h4>
                    <p className="text-[#A5B4FC]/70">{selectedItem.contrib.description}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}