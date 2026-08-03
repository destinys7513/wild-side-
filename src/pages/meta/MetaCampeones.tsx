import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fetchChampions, updateContent, type ChampionEntry } from "@/lib/content";
import { setPageMeta } from "@/lib/seo";
import { useAppAuth } from "@/contexts/AuthContext";

const tierColors: Record<string, string> = {
  "S+": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "S": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "A": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "B": "bg-green-500/20 text-green-400 border-green-500/30",
  "C": "bg-gray-500/20 text-gray-400 border-gray-500/30",
  "D": "bg-red-500/20 text-red-400 border-red-500/30",
};

const TIERS = ["S+", "S", "A", "B", "C", "D"] as const;

const roles = ["Todos", "Jungla", "Mid", "Baron", "Support", "Cazador"];

function ChampionIcon({ imageUrl, icon, name }: { imageUrl?: string; icon: string; name: string }) {
  const [errored, setErrored] = useState(false);
  return (
    <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-none overflow-hidden">
      {imageUrl && !errored ? (
        <img
          key={imageUrl}
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <span>{icon}</span>
      )}
    </div>
  );
}

function TierEditCell({ champ, onRefresh }: { champ: ChampionEntry; onRefresh: () => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleTierChange(newTier: string) {
    setSaving(true);
    try {
      await updateContent("champions", champ.id, {
        name: champ.name,
        role: champ.role,
        tier: newTier,
        winrate: champ.winrate,
        pickrate: champ.pickrate,
        banrate: champ.banrate,
        icon: champ.icon,
        image_url: champ.image_url,
      });
      await onRefresh();
    } finally {
      setSaving(false);
      setEditing(false);
    }
  }

  if (editing) {
    return (
      <div className="flex items-center justify-center gap-1">
        <select
          autoFocus
          defaultValue={champ.tier}
          disabled={saving}
          onChange={(e) => void handleTierChange(e.target.value)}
          onBlur={() => setEditing(false)}
          className="bg-[#0B1635] border border-primary/40 text-white text-xs rounded-md px-1.5 py-0.5 focus:outline-none focus:border-primary cursor-pointer"
          data-testid={`tier-select-${champ.id}`}
        >
          {TIERS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-1.5 group/tier">
      <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full border font-bold ${tierColors[champ.tier]}`}>
        {champ.tier}
      </span>
      <button
        data-testid={`edit-tier-${champ.id}`}
        onClick={() => setEditing(true)}
        title="Editar tier"
        className="opacity-0 group-hover/tier:opacity-100 transition-opacity text-[#A5B4FC]/50 hover:text-primary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </button>
    </div>
  );
}

export default function MetaCampeones() {
  useEffect(() => {
    setPageMeta(
      "Meta Campeones – WR Hub | Tier List Wild Rift",
      "Tier list de campeones actualizada para Wild Rift Patch 7.1. Consulta winrate, pickrate y banrate de cada campeón por rol: jungla, mid, baron, support y cazador."
    );
  }, []);

  const { isAdmin } = useAppAuth();
  const [selectedRole, setSelectedRole] = useState("Todos");
  const [sortBy, setSortBy] = useState<"tier" | "winrate" | "pickrate">("tier");
  const [champions, setChampions] = useState<ChampionEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchChampions();
        setChampions(data);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const tierOrder = ["S+", "S", "A", "B", "C", "D"];

  const filtered = champions
    .filter((c) => selectedRole === "Todos" || c.role === selectedRole)
    .sort((a, b) => {
      if (sortBy === "tier") return tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
      if (sortBy === "winrate") return b.winrate - a.winrate;
      return b.pickrate - a.pickrate;
    });

  const top5Winrate = [...champions]
    .sort((a, b) => b.winrate - a.winrate)
    .slice(0, 5)
    .map((c) => ({ name: c.name, winrate: c.winrate }));

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#A5B4FC]/60">Cargando tier list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Meta Campeones</h1>
          <p className="text-[#A5B4FC]/70">Tier list actualizada para Patch 7.1</p>
        </div>

        {/* Winrate Chart */}
        <div className="bg-[#1D2B64] rounded-xl border border-white/10 p-6 mb-8">
          <h2 className="text-white font-semibold mb-4">Top 5 por Winrate</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={top5Winrate} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: "#A5B4FC", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#A5B4FC", fontSize: 11 }} axisLine={false} tickLine={false} domain={[44, 58]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0B1635", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#F5F3FF" }}
                formatter={(val: number) => [`${val}%`, "Winrate"]}
              />
              <Bar dataKey="winrate" fill="#5B21B6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {roles.map((role) => (
              <button
                key={role}
                data-testid={`filter-role-${role.toLowerCase()}`}
                onClick={() => setSelectedRole(role)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedRole === role
                    ? "bg-primary text-white"
                    : "bg-[#1D2B64] text-[#A5B4FC] border border-white/10 hover:bg-white/5 hover:text-white"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          <div className="sm:ml-auto flex gap-2">
            {(["tier", "winrate", "pickrate"] as const).map((s) => (
              <button
                key={s}
                data-testid={`sort-${s}`}
                onClick={() => setSortBy(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                  sortBy === s
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-[#A5B4FC]/50 hover:text-[#A5B4FC]"
                }`}
              >
                {s === "tier" ? "Tier" : s === "winrate" ? "Winrate" : "Pickrate"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1D2B64] rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#A5B4FC]/60 uppercase tracking-wider">#</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#A5B4FC]/60 uppercase tracking-wider">Campeón</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#A5B4FC]/60 uppercase tracking-wider">Rol</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#A5B4FC]/60 uppercase tracking-wider">Tier</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#A5B4FC]/60 uppercase tracking-wider">Winrate</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#A5B4FC]/60 uppercase tracking-wider">Pickrate</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#A5B4FC]/60 uppercase tracking-wider">Banrate</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((champ, i) => (
                  <tr
                    key={champ.id}
                    data-testid={`champion-row-${champ.id}`}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-[#A5B4FC]/40 text-sm">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ChampionIcon imageUrl={champ.image_url} icon={champ.icon} name={champ.name} />
                        <span className="text-white font-medium text-sm">{champ.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#A5B4FC]/70 text-sm">{champ.role}</td>
                    <td className="px-4 py-3 text-center">
                      {isAdmin ? (
                        <TierEditCell champ={champ} onRefresh={async () => { const data = await fetchChampions(); setChampions(data); }} />
                      ) : (
                        <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full border font-bold ${tierColors[champ.tier]}`}>
                          {champ.tier}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-semibold ${champ.winrate >= 52 ? "text-green-400" : champ.winrate >= 49 ? "text-[#A5B4FC]" : "text-red-400"}`}>
                        {champ.winrate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-[#A5B4FC] text-sm">{champ.pickrate}%</td>
                    <td className="px-4 py-3 text-right text-[#A5B4FC]/60 text-sm">{champ.banrate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-[#A5B4FC]/40">
              No hay campeones para este filtro
            </div>
          )}
        </div>

        <p className="text-[#A5B4FC]/30 text-xs text-center mt-4">
          Datos basados en Patch 7.1 · Actualizado diariamente
        </p>
      </div>
    </div>
  );
}