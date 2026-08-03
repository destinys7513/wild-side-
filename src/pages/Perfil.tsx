import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Trophy, Target, Zap, LogOut, TrendingUp, Shield, Globe, Swords, Gamepad2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { recentMatches, championMastery, winrateHistory } from "@/data/mockData";
import { setPageMeta } from "@/lib/seo";
import { getSession, logout } from "@/lib/auth";
import { fetchUsuarioPuntos, actualizarTagPropio, type UsuarioPuntos } from "@/lib/points";
import { Link } from "wouter";

export default function Perfil() {
  const [, setLocation] = useLocation();
  const [serverProfile, setServerProfile] = useState<UsuarioPuntos | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [tagSaving, setTagSaving] = useState(false);
  const [tagSaved, setTagSaved] = useState(false);
  const session = getSession();

  useEffect(() => {
    setPageMeta(
      "Mi Perfil – WR Hub | Estadísticas Personales Wild Rift",
      "Consulta tus estadísticas personales en Wild Rift: KDA, winrate, rango, campeones más jugados e historial de partidas recientes."
    );
    if (!session) {
      setLocation("/login");
      return;
    }
    fetchUsuarioPuntos()
      .then((data) => {
        setServerProfile(data);
        setTagInput(data.tagWildRift ?? "");
      })
      .catch(() => {});
  }, []);

  function handleLogout() {
    logout();
    setLocation("/login");
  }

  async function handleSaveTag() {
    setTagSaving(true);
    try {
      await actualizarTagPropio(tagInput);
      setTagSaved(true);
      setTimeout(() => setTagSaved(false), 2500);
    } catch {
      /* ignore */
    } finally {
      setTagSaving(false);
    }
  }

  if (!session) return null;

  const rango = serverProfile?.rango ?? "Sin clasificar";
  const servidor = serverProfile?.servidor ?? "—";
  const partidas = serverProfile?.partidas != null ? String(serverProfile.partidas) : "—";
  const kda = serverProfile?.kda ?? "—";
  const winrate = serverProfile?.winrate != null ? `${serverProfile.winrate}%` : "—";
  const victorias = serverProfile?.victorias != null ? String(serverProfile.victorias) : "—";
  const derrotas = serverProfile?.derrotas != null ? String(serverProfile.derrotas) : "—";

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Profile Header */}
        <div className="bg-[#1D2B64] rounded-2xl border border-white/10 p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white text-3xl font-black flex-none select-none">
            {session.username.slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{session.username}</h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 border border-teal-500/30 text-teal-400 rounded-full text-xs font-semibold w-fit">
                <Trophy className="w-3.5 h-3.5" />
                {rango}
              </span>
              {session.isAdmin && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-full text-xs font-semibold w-fit">
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </span>
              )}
            </div>
            <div className="text-[#A5B4FC]/60 text-sm mt-1">
              Servidor: {servidor} · {partidas !== "—" ? `${partidas} partidas jugadas` : "Sin partidas registradas"}
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            {session.isAdmin && (
              <Link href="/admin">
                <Button size="sm" variant="outline" className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-400/10">
                  <Shield className="w-4 h-4 mr-1" />
                  Panel Admin
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              data-testid="button-logout"
              className="text-[#A5B4FC]/60 hover:text-red-400 hover:bg-red-400/10"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Cerrar sesión
            </Button>
          </div>
        </div>

        {/* Tag de Wild Rift — editable por el usuario */}
        <div className="bg-[#1D2B64] rounded-xl border border-white/10 p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Gamepad2 className="w-4 h-4 text-[#A5B4FC]/60" />
            <h2 className="text-white font-semibold text-sm">Tu Tag de Wild Rift</h2>
          </div>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Ej: Nombre#TAG o NombreDeJuego"
              className="bg-[#0B1635]/70 border-white/10 text-white placeholder:text-[#A5B4FC]/30 h-9 text-sm flex-1"
              maxLength={60}
            />
            <Button
              size="sm"
              onClick={handleSaveTag}
              disabled={tagSaving}
              className="h-9 px-4 bg-primary hover:bg-primary/90 text-white text-sm"
            >
              {tagSaved ? <><Check className="w-3.5 h-3.5 mr-1" />Guardado</> : "Guardar"}
            </Button>
          </div>
          <p className="text-[#A5B4FC]/30 text-xs mt-2">Este tag es visible para el administrador del gremio en la lista de miembros.</p>
        </div>

        {/* Stats Row */}
        <div className="bg-[#1D2B64] rounded-xl border border-white/10 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Estadísticas</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "KDA Promedio", value: kda, icon: Target, color: "text-yellow-400" },
              { label: "Winrate", value: winrate, icon: TrendingUp, color: "text-green-400" },
              { label: "Partidas", value: partidas, icon: Zap, color: "text-blue-400" },
            ].map((stat) => (
              <div key={stat.label} data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`} className="bg-[#0B1635]/50 rounded-xl p-4 text-center">
                <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-[#A5B4FC]/50 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Winrate Chart */}
          <div className="bg-[#1D2B64] rounded-xl border border-white/10 p-6">
            <h2 className="text-white font-semibold mb-4">Winrate – Últimos 7 Días</h2>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={winrateHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fill: "#A5B4FC", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#A5B4FC", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0B1635", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#F5F3FF" }}
                  formatter={(val: number) => [`${val}%`, "Winrate"]}
                />
                <Bar dataKey="winrate" fill="#5B21B6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Account Info */}
          <div className="bg-[#1D2B64] rounded-xl border border-white/10 p-6">
            <h2 className="text-white font-semibold mb-4">Datos de Cuenta</h2>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-teal-500/20 flex items-center justify-center">
                <Trophy className="w-7 h-7 text-teal-400" />
              </div>
              <div>
                <div className="text-white font-bold text-xl">{rango}</div>
                <div className="flex items-center gap-1.5 text-[#A5B4FC]/60 text-sm mt-0.5">
                  <Globe className="w-3.5 h-3.5" />
                  Servidor: {servidor}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Victorias", value: victorias, color: "text-green-400" },
                { label: "Derrotas", value: derrotas, color: "text-red-400" },
                { label: "WR", value: winrate, color: "text-yellow-400" },
              ].map((s) => (
                <div key={s.label} className="bg-[#0B1635]/50 rounded-lg p-2">
                  <div className={`text-base font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-[#A5B4FC]/40 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="text-[#A5B4FC]/30 text-xs mt-4 flex items-center gap-1">
              <Swords className="w-3 h-3" />
              Estadísticas verificadas por el administrador
            </p>
          </div>
        </div>

        {/* Champion Mastery */}
        <div className="bg-[#1D2B64] rounded-xl border border-white/10 p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Campeones Más Jugados</h2>
          <div className="space-y-3">
            {championMastery.map((champ, i) => (
              <div key={champ.champion} data-testid={`mastery-champ-${i}`} className="flex items-center gap-4">
                <span className="text-[#A5B4FC]/30 text-sm w-4 flex-none">{i + 1}</span>
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-none">
                  {champ.champion.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium text-sm">{champ.champion}</span>
                    <span className="text-[#A5B4FC]/60 text-xs">{champ.games} partidas</span>
                  </div>
                  <div className="h-1.5 bg-[#0B1635] rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(champ.winrate, 100)}%` }} />
                  </div>
                </div>
                <span className="text-green-400 text-sm font-semibold flex-none">{champ.winrate}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Matches */}
        <div className="bg-[#1D2B64] rounded-xl border border-white/10 p-6">
          <h2 className="text-white font-semibold mb-4">Partidas Recientes</h2>
          <div className="space-y-2">
            {recentMatches.map((match, i) => (
              <div
                key={i}
                data-testid={`recent-match-${i}`}
                className={`flex items-center gap-4 p-3 rounded-lg border ${
                  match.result === "Victoria" ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"
                }`}
              >
                <div className={`w-1 h-10 rounded-full flex-none ${match.result === "Victoria" ? "bg-green-400" : "bg-red-400"}`} />
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-none">
                  {match.champion.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">{match.champion}</span>
                    <span className="text-[#A5B4FC]/50 text-xs">·</span>
                    <span className="text-[#A5B4FC]/50 text-xs">{match.role}</span>
                  </div>
                  <div className="text-[#A5B4FC]/60 text-xs mt-0.5">KDA: {match.kda} · CS: {match.cs}</div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold text-sm ${match.result === "Victoria" ? "text-green-400" : "text-red-400"}`}>{match.result}</div>
                  <div className="text-[#A5B4FC]/40 text-xs mt-0.5">{match.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
