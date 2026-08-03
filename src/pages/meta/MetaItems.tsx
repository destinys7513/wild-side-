import { useEffect, useState } from "react";
import { fetchItems, fetchBuilds, updateContent, type ItemEntry, type BuildEntry } from "@/lib/content";
import { setPageMeta } from "@/lib/seo";
import { useAppAuth } from "@/contexts/AuthContext";

const tierColors: Record<string, string> = {
  "S+": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "S": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "A": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "B": "bg-green-500/20 text-green-400 border-green-500/30",
  "C": "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const TIERS = ["S+", "S", "A", "B", "C"] as const;

const roles = ["Todos", "Mid", "Cazador", "Baron", "Support", "Jungla"];

function ItemTierBadge({ item, onRefresh }: { item: ItemEntry; onRefresh: () => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleTierChange(newTier: string) {
    setSaving(true);
    try {
      await updateContent("items", item.id, {
        name: item.name,
        role: item.role,
        tier: newTier,
        winrate: item.winrate,
        usage: item.usage,
        type: item.type,
        color: item.color,
      });
      await onRefresh();
    } finally {
      setSaving(false);
      setEditing(false);
    }
  }

  if (editing) {
    return (
      <select
        autoFocus
        defaultValue={item.tier}
        disabled={saving}
        onChange={(e) => void handleTierChange(e.target.value)}
        onBlur={() => setEditing(false)}
        className="bg-[#0B1635] border border-primary/40 text-white text-xs rounded-md px-1.5 py-0.5 focus:outline-none focus:border-primary cursor-pointer flex-none"
        data-testid={`tier-select-item-${item.id}`}
      >
        {TIERS.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    );
  }

  return (
    <div className="flex items-center gap-1 group/tier flex-none">
      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${tierColors[item.tier]}`}>
        {item.tier}
      </span>
      <button
        data-testid={`edit-tier-item-${item.id}`}
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
export default function MetaItems() {
  useEffect(() => {
    setPageMeta(
      "Meta Items – WR Hub | Tier List de Items Wild Rift",
      "Tier list de items y builds recomendadas para Wild Rift Patch 7.1. Descubre los items más usados, su winrate y las mejores combinaciones por rol."
    );
  }, []);

  const { isAdmin } = useAppAuth();
  const [selectedRole, setSelectedRole] = useState("Todos");
  const [items, setItems] = useState<ItemEntry[]>([]);
  const [builds, setBuilds] = useState<BuildEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [i, b] = await Promise.all([fetchItems(), fetchBuilds()]);
        setItems(i);
        setBuilds(b);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const TIERS = ["S+", "S", "A", "B", "C"] as const;
  const tierOrder = ["S+", "S", "A", "B", "C"];
  const roles = ["Todos", "Mid", "Cazador", "Baron", "Support", "Jungla"];

  const filteredItems = items
    .filter((i) => selectedRole === "Todos" || i.role === selectedRole)
    .sort((a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier));

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#A5B4FC]/60">Cargando tier list de items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Meta Items</h1>
          <p className="text-[#A5B4FC]/70">Tier list y builds recomendadas para Patch 7.1</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {roles.map((role) => (
              <button
                key={role}
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
        </div>

        <div className="bg-[#1D2B64] rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#A5B4FC]/60 uppercase tracking-wider">Color</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#A5B4FC]/60 uppercase tracking-wider">Nombre</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#A5B4FC]/60 uppercase tracking-wider">Rol</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#A5B4FC]/60 uppercase tracking-wider">Tier</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#A5B4FC]/60 uppercase tracking-wider">Winrate</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#A5B4FC]/60 uppercase tracking-wider">Uso%</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#A5B4FC]/60 uppercase tracking-wider">Tipo</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-none`} style={{ backgroundColor: `${item.color}25`, color: item.color }}>
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white font-medium text-sm truncate max-w-xs">{item.name}</td>
                    <td className="px-4 py-3 text-[#A5B4FC]/70 text-sm">{item.role}</td>
                    <td className="px-4 py-3 text-center">
                      {isAdmin ? (
                        <ItemTierBadge item={item} onRefresh={async () => { const data = await fetchItems(); setItems(data); }} />
                      ) : (
                        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${tierColors[item.tier]}`}>
                          {item.tier}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-[#A5B4FC] font-semibold">{item.winrate}%</td>
                    <td className="px-4 py-3 text-right text-[#A5B4FC]/60">{item.usage}%</td>
                    <td className="px-4 py-3 text-[#A5B4FC]/40 capitalize">{item.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}