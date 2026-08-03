import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Zap, Trophy, CheckCircle, Star, Gift, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setPageMeta } from "@/lib/seo";
import { getSession } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import {
  fetchUsuarioPuntos,
  fetchRecompensas,
  fetchRetos,
  fetchClasificacion,
  canjearRecompensa,
} from "@/lib/points";

const levels = [
  { name: "Bronce", min: 0, max: 500, color: "#CD7F32" },
  { name: "Plata", min: 500, max: 1500, color: "#C0C0C0" },
  { name: "Oro", min: 1500, max: 3500, color: "#EAB308" },
  { name: "Platino", min: 3500, max: Infinity, color: "#22C55E" },
];

const levelColors: Record<string, string> = {
  "Bronce": "text-amber-700 bg-amber-700/10 border-amber-700/20",
  "Plata": "text-gray-400 bg-gray-400/10 border-gray-400/20",
  "Oro": "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  "Platino": "text-green-400 bg-green-400/10 border-green-400/20",
};

export default function Puntos() {
  const session = getSession();
  const loggedIn = !!session && !session.isAdmin;
  const { toast } = useToast();
  const [usuario, setUsuario] = useState<Awaited<ReturnType<typeof fetchUsuarioPuntos>> | null>(null);
  const [recompensas, setRecompensas] = useState<Awaited<ReturnType<typeof fetchRecompensas>>>([]);
  const [retos, setRetos] = useState<Awaited<ReturnType<typeof fetchRetos>>>([]);
  const [clasificacion, setClasificacion] = useState<Awaited<ReturnType<typeof fetchClasificacion>>>([]);
  const [loading, setLoading] = useState(true);
  const [canjearPending, setCanjearPending] = useState<number | null>(null);

  useEffect(() => {
    setPageMeta(
      "Sistema de Puntos – WR Hub | Leaderboard Wild Rift",
      "Gana puntos en WR Hub completando acciones diarias, canjea recompensas y sube en el leaderboard de la comunidad Wild Rift."
    );
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [u, r, rt, c] = await Promise.all([
        loggedIn ? fetchUsuarioPuntos() : Promise.resolve(null),
        fetchRecompensas(),
        fetchRetos(),
        fetchClasificacion(),
      ]);
      setUsuario(u);
      setRecompensas(r);
      setRetos(rt);
      setClasificacion(c);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [loggedIn]);

  async function handleCanjear(id: number) {
    setCanjearPending(id);
    try {
      await canjearRecompensa(id);
      toast({ title: "¡Recompensa canjeada!", description: "Tu canje quedó registrado como pendiente." });
      await loadData();
    } catch (err) {
      toast({
        title: "No se pudo canjear",
        description: err instanceof Error ? err.message : "Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setCanjearPending(null);
    }
  }

  const puntosTotales = usuario?.puntosTotales ?? 0;
  const nivel = usuario?.nivel ?? "Bronce";
  const progreso = usuario?.progreso ?? 0;
  const siguienteNivel = usuario?.siguienteNivel ?? null;
  const puntosParaSiguiente = usuario?.puntosParaSiguiente ?? 0;
  const siguienteNivelMin = usuario?.siguienteNivelMin ?? null;

  const retoCards =
    retos.length > 0
      ? retos.map((r) => ({ label: r.titulo, desc: r.descripcion, points: `+${r.puntosRecompensa} pts` }))
      : [
          { label: "Login Diario", desc: "Entra cada día", points: "+10 pts" },
          { label: "Compartir Actualización", desc: "Difunde la meta", points: "+25 pts" },
          { label: "Reportar Meta", desc: "Ayuda a la comunidad", points: "+50 pts" },
          { label: "Primera Victoria del Día", desc: "Gana tu primera partida", points: "+100 pts" },
          { label: "Completar Perfil", desc: "Rellena tus datos", points: "+200 pts" },
        ];

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#A5B4FC]/60">Cargando sistema de puntos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sistema de Puntos</h1>
          <p className="text-[#A5B4FC]/70">Gana puntos, canjea recompensas y compite en el leaderboard</p>
        </div>

        {/* How to earn points */}
        <div className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-5">Cómo Ganar Puntos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {retoCards.map((item) => (
              <div
                key={item.label}
                data-testid={`point-action-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex flex-col items-center text-center p-5 bg-[#1D2B64] rounded-xl border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-primary bg-primary/10">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="text-white font-semibold text-sm mb-1">{item.label}</div>
                {item.desc && <div className="text-[#A5B4FC]/50 text-xs mb-2 line-clamp-2">{item.desc}</div>}
                <div className="text-primary font-bold mt-auto">{item.points}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* My Score */}
          <div className="bg-[#1D2B64] rounded-xl border border-white/10 p-6">
            <h2 className="text-white font-semibold text-lg mb-5">Mi Puntuación</h2>

            {loggedIn ? (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Star className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-4xl font-black text-white" data-testid="text-mis-puntos">
                      {puntosTotales.toLocaleString()}
                    </div>
                    <div className="text-[#A5B4FC]/60 text-sm">puntos totales</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${levelColors[nivel]}`}>
                        {nivel}
                      </span>
                      <span className="text-[#A5B4FC]/60 text-sm">{puntosTotales} pts</span>
                    </div>
                    {siguienteNivelMin !== null && (
                      <span className="text-[#A5B4FC]/40 text-xs">{siguienteNivelMin} pts</span>
                    )}
                  </div>
                  <div className="h-3 bg-[#0B1635] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full transition-all"
                      style={{ width: `${progreso}%` }}
                      data-testid="bar-progreso"
                    />
                  </div>
                  {siguienteNivel && (
                    <div className="text-[#A5B4FC]/40 text-xs mt-2 text-center">
                      {puntosParaSiguiente} puntos para {siguienteNivel}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Lock className="w-7 h-7 text-primary" />
                </div>
                <p className="text-white font-medium mb-1">Inicia sesión para ver tus puntos</p>
                <p className="text-[#A5B4FC]/50 text-sm mb-4">Crea tu cuenta y empieza a ganar recompensas.</p>
                <Link href="/login">
                  <Button className="bg-primary hover:bg-primary/90 text-white" data-testid="link-login-puntos">
                    Iniciar sesión
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Level Badges */}
          <div className="bg-[#1D2B64] rounded-xl border border-white/10 p-6">
            <h2 className="text-white font-semibold text-lg mb-5">Niveles y Recompensas</h2>
            <div className="space-y-4">
              {levels.map((level) => {
                const isActive = puntosTotales >= level.min;
                return (
                  <div
                    key={level.name}
                    data-testid={`level-${level.name.toLowerCase()}`}
                    className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                      isActive ? "border-white/10 bg-white/5" : "border-white/5 opacity-50"
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-none"
                      style={{ backgroundColor: `${level.color}20`, color: level.color }}
                    >
                      {level.name.slice(0, 1)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm">{level.name}</div>
                      <div className="text-[#A5B4FC]/50 text-xs">
                        {level.max === Infinity ? `${level.min}+ pts` : `${level.min} – ${level.max} pts`}
                      </div>
                    </div>
                    {isActive && <CheckCircle className="w-4 h-4 text-green-400 flex-none" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rewards shop */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Gift className="w-5 h-5 text-primary" />
            <h2 className="text-white font-semibold text-lg">Tienda de Recompensas</h2>
          </div>
          {recompensas.length === 0 ? (
            <div className="bg-[#1D2B64] rounded-xl border border-white/10 py-16 text-center text-[#A5B4FC]/40">
              <Gift className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aún no hay recompensas disponibles. ¡Vuelve pronto!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recompensas.map((r) => {
                const affordable = loggedIn && puntosTotales >= r.costoPuntos;
                const isPending = canjearPending === r.id;
                return (
                  <div
                    key={r.id}
                    data-testid={`reward-${r.id}`}
                    className="bg-[#1D2B64] rounded-xl border border-white/10 overflow-hidden flex flex-col"
                  >
                    <div className="h-32 bg-gradient-to-br from-primary/30 to-purple-900/40 flex items-center justify-center">
                      {r.imagenUrl ? (
                        <img src={r.imagenUrl} alt={r.titulo} className="w-full h-full object-cover" />
                      ) : (
                        <Gift className="w-10 h-10 text-primary/60" />
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="text-white font-semibold mb-1">{r.titulo}</div>
                      {r.descripcion && (
                        <div className="text-[#A5B4FC]/50 text-sm mb-4 line-clamp-2">{r.descripcion}</div>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="flex items-center gap-1.5 text-primary font-bold">
                          <Star className="w-4 h-4" />
                          {r.costoPuntos.toLocaleString()} pts
                        </div>
                        <Button
                          size="sm"
                          data-testid={`button-canjear-${r.id}`}
                          disabled={!affordable || isPending}
                          onClick={() => handleCanjear(r.id)}
                          className="bg-primary hover:bg-primary/90 text-white disabled:opacity-40"
                        >
                          {isPending
                            ? "Canjeando..."
                            : !loggedIn
                            ? "Inicia sesión"
                            : affordable
                            ? "Reclamar"
                            : "Sin puntos"}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="bg-[#1D2B64] rounded-xl border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <div>
              <h2 className="text-white font-semibold text-lg">Leaderboard del Mes – Top 10</h2>
              <p className="text-[#A5B4FC]/50 text-xs mt-0.5">Los usuarios con más puntos este mes</p>
            </div>
          </div>
          {clasificacion.length === 0 ? (
            <div className="py-16 text-center text-[#A5B4FC]/40">
              <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Todavía no hay puntuaciones. ¡Sé el primero!</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {clasificacion.slice(0, 10).map((user) => {
                const isMe = loggedIn && user.username === session?.username;
                return (
                  <div
                    key={user.rank}
                    data-testid={`leaderboard-row-${user.rank}`}
                    className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                      isMe ? "bg-primary/10" : user.rank <= 3 ? "bg-primary/5" : "hover:bg-white/5"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-none ${
                      user.rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
                      user.rank === 2 ? "bg-gray-400/20 text-gray-400" :
                      user.rank === 3 ? "bg-amber-700/20 text-amber-600" :
                      "bg-white/5 text-[#A5B4FC]/60"
                    }`}>
                      {user.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm truncate">
                        {user.username ?? "Anónimo"}
                        {isMe && <span className="text-primary text-xs ml-2">(tú)</span>}
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border ${levelColors[user.nivel] ?? levelColors["Bronce"]}`}>
                      {user.nivel}
                    </span>
                    <div className="text-white font-bold text-sm text-right">
                      {user.puntosMensuales.toLocaleString()} pts
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}