import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ChevronRight, Trophy, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setPageMeta } from "@/lib/seo";
import {
  fetchPatches,
  fetchChampions,
  fetchItems,
  type PatchEntry,
  type ChampionEntry,
  type ItemEntry,
} from "@/lib/content";

const patchGradients = {
  "gradient-purple": "from-purple-600 to-indigo-700",
  "gradient-blue": "from-blue-600 to-cyan-700",
  "gradient-gold": "from-yellow-500 to-amber-700",
  "gradient-red": "from-red-600 to-rose-700",
  "gradient-orange": "from-orange-500 to-amber-700",
  "gradient-teal": "from-teal-600 to-emerald-700",
  "gradient-yellow": "from-yellow-400 to-lime-600",
  "gradient-green": "from-green-600 to-teal-700",
};

const tierColors: Record<string, string> = {
  "S+": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "S": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "A": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "B": "bg-green-500/20 text-green-400 border-green-500/30",
  "C": "bg-gray-500/20 text-gray-400 border-gray-500/30",
  "D": "bg-red-500/20 text-red-400 border-red-500/30",
};

interface PatchSummary {
  patchVersion: string;
  latestDate: string;
  championChanges: number;
  itemChanges: number;
  runeChanges: number;
  totalChanges: number;
  championNames?: string[];
}

function getPatchSummary(patches: PatchEntry[]): PatchSummary[] {
  return patches.slice(0, 8).map((p) => ({
    patchVersion: p.version,
    latestDate: p.date,
    championChanges: 0,
    itemChanges: 0,
    runeChanges: 0,
    totalChanges: 0,
    championNames: [],
  }));
}

export default function Home() {
  useEffect(() => {
    setPageMeta(
      "WR Hub – Meta Wild Rift, Estadísticas, Parches y Guías",
      "Tu hub definitivo para Wild Rift. Meta actual, tier lists de campeones e items, builds recomendadas, parches, eventos y estadísticas en tiempo real."
    );
  }, []);

  const [patches, setPatches] = useState<PatchEntry[]>([]);
  const [champions, setChampions] = useState<ChampionEntry[]>([]);
  const [items, setItems] = useState<ItemEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, c, i] = await Promise.all([fetchPatches(), fetchChampions(), fetchItems()]);
        setPatches(p);
        setChampions(c);
        setItems(i);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const patchList = getPatchSummary(patches);
  const latestPatch = patches[0]?.version ?? null;
  const championCount = champions.length;
  const topChampions = champions.slice(0, 5);
  const topItems = items.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#A5B4FC]/60">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-900/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Temporada 7 Activa
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 leading-tight">
              Tu Hub Definitivo de <span className="text-primary">Wild Rift</span>
            </h1>
            <p className="text-[#A5B4FC]/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
              Meta actual, tier lists, builds, parches, eventos y estadísticas en tiempo real.
              Todo lo que necesitas para dominar la Grieta.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/meta/campeones" data-testid="hero-cta-meta">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 h-12 text-base font-semibold">
                  Ver Meta Actual
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/actualizaciones" data-testid="hero-cta-updates">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 px-8 h-12 text-base">
                  Últimas Actualizaciones
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto mt-16 pt-10 border-t border-white/5">
              {[
                { label: "Campeones", value: championCount > 0 ? `${championCount}+` : "80+" },
                { label: "Actualizados", value: latestPatch ? `Parche ${latestPatch}` : "–" },
                { label: "Eventos", value: "7" },
              ].map((stat) => (
                <div key={stat.label} className="text-center" data-testid={`stat-${stat.label.toLowerCase()}`}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-[#A5B4FC]/60 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Últimas Actualizaciones */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Últimas Actualizaciones</h2>
              <p className="text-[#A5B4FC]/60 text-sm mt-1">Parches, eventos y noticias de Wild Rift</p>
            </div>
            <Link href="/actualizaciones" data-testid="link-ver-todo-actualizaciones">
              <span className="flex items-center gap-1 text-primary text-sm hover:underline cursor-pointer">
                Ver todo <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
            {patchList.length === 0 && (
              <p className="text-[#A5B4FC]/40 text-sm py-8">Sin datos de parches aún.</p>
            )}
            {patchList.map((patch: PatchSummary, idx: number) => {
              const gradientKeys = Object.keys(patchGradients);
              const gradient = gradientKeys[idx % gradientKeys.length];
              const formattedDate = new Date(patch.latestDate).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              const changeParts: string[] = [];
              if (patch.championChanges > 0) changeParts.push(`${patch.championChanges} campeón${patch.championChanges !== 1 ? "es" : ""}`);
              if (patch.itemChanges > 0) changeParts.push(`${patch.itemChanges} ítem${patch.itemChanges !== 1 ? "s" : ""}`);
              if (patch.runeChanges > 0) changeParts.push(`${patch.runeChanges} runa${patch.runeChanges !== 1 ? "s" : ""}`);
              const summary = changeParts.length > 0
                ? `${changeParts.join(", ")} afectados en este parche.`
                : `${patch.totalChanges} cambio${patch.totalChanges !== 1 ? "s" : ""} en este parche.`;
              const previewNames = patch.championNames ?? [];
              return (
                <Link key={patch.patchVersion} href={`/actualizaciones?version=${patch.patchVersion}`}>
                  <div
                    data-testid={`patch-card-${patch.patchVersion}`}
                    className="flex-none w-72 rounded-xl overflow-hidden border border-white/10 bg-[#1D2B64] hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    <div className={`h-32 bg-gradient-to-br ${patchGradients[gradient as keyof typeof patchGradients]} relative`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white/10 text-7xl font-black">{patch.patchVersion}</span>
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-purple-500/20 text-purple-400">
                          Parche
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-sm mb-1">Parche {patch.patchVersion}</h3>
                      <p className="text-[#A5B4FC]/60 text-xs line-clamp-2">{summary}</p>
                      {previewNames.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {previewNames.map((name) => (
                            <span key={name} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary/80 font-medium">
                              {name}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-2 text-[#A5B4FC]/40 text-xs">{formattedDate}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Meta Preview */}
      <section className="py-16 bg-[#060e24]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white">Meta Actual – Patch {latestPatch ?? "..."}</h2>
            <p className="text-[#A5B4FC]/60 text-sm mt-1">Los picks mas fuertes del meta actual</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Champions */}
            <div className="bg-[#1D2B64] rounded-xl border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <h3 className="text-white font-bold">Campeones Top</h3>
              </div>
              <ul className="space-y-3">
                {topChampions.map((champ, i) => (
                  <li key={champ.id} className="flex items-center gap-3" data-testid={`top-champion-${i}`}>
                    <span className="text-[#A5B4FC]/40 text-sm w-4">{i + 1}</span>
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-none">
                      {champ.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{champ.name}</div>
                      <div className="text-[#A5B4FC]/50 text-xs">{champ.role}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${tierColors[champ.tier]}`}>
                      {champ.tier}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/meta/campeones" data-testid="link-meta-campeones">
                <Button variant="ghost" size="sm" className="w-full mt-4 text-primary hover:bg-primary/10">
                  Ver Tier List Completa <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {/* Top Items */}
            <div className="bg-[#1D2B64] rounded-xl border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Shield className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-bold">Items Top</h3>
              </div>
              <ul className="space-y-3">
                {topItems.slice(0, 3).map((item, i) => (
                  <li key={item.id} className="flex items-center gap-3" data-testid={`top-item-${i}`}>
                    <span className="text-[#A5B4FC]/40 text-sm w-4">{i + 1}</span>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-none" style={{ backgroundColor: `${item.color}30`, color: item.color }}>
                      {item.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{item.name}</div>
                      <div className="text-[#A5B4FC]/50 text-xs">{item.role}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${tierColors[item.tier]}`}>
                      {item.tier}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/meta/items" data-testid="link-meta-items">
                <Button variant="ghost" size="sm" className="w-full mt-4 text-primary hover:bg-primary/10">
                  Ver Tier List de Items <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {/* Top Runes */}
            <div className="bg-[#1D2B64] rounded-xl border border-white/10 p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-5">
                <Star className="w-5 h-5 text-purple-400" />
                <h3 className="text-white font-bold">Runas Top</h3>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-medium">Próximamente</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center py-8 gap-3">
                <Star className="w-10 h-10 text-purple-400/30" />
                <p className="text-[#A5B4FC]/50 text-sm text-center">Los datos de runas estarán disponibles en una próxima actualización.</p>
              </div>
              <Link href="/meta/runas" data-testid="link-meta-runas">
                <Button variant="ghost" size="sm" className="w-full mt-4 text-primary hover:bg-primary/10">
                  Ver Todas las Runas <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Login */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-10">
            <h2 className="text-3xl font-bold text-white mb-3">Conecta tu cuenta de Riot</h2>
            <p className="text-[#A5B4FC] mb-8 text-lg">
              Accede a tus estadísticas personales, historial de partidas, maestría de campeones y mucho mas.
            </p>
            <Link href="/login" data-testid="cta-login">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-10 h-12 text-base font-semibold">
                Conectar con Riot ID
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <p className="text-[#A5B4FC]/40 text-sm mt-4">Gratis · Sin tarjeta de crédito · Desconecta cuando quieras</p>
          </div>
        </div>
      </section>
    </div>
  );
}