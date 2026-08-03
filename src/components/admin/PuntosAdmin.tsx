import { useState, useEffect } from "react";
import { Gift, Target, Users, Plus, Pencil, Trash2, CheckCircle, Clock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  fetchAdminCanjes,
  completarCanje,
  fetchAdminRecompensas,
  crearRecompensa,
  actualizarRecompensa,
  eliminarRecompensa,
  fetchAdminRetos,
  crearReto,
  actualizarReto,
  eliminarReto,
  fetchAdminUsuarios,
  actualizarPuntosUsuario,
  type Recompensa,
  type Reto,
  type UsuarioAdmin,
} from "@/lib/points";

type SubTab = "canjes" | "recompensas" | "retos" | "usuarios";

const RETO_TIPOS = ["diario", "semanal", "único", "especial"];

const EMPTY_REWARD = { titulo: "", descripcion: "", costoPuntos: 100, imagenUrl: "", activa: true };
const EMPTY_RETO = { titulo: "", descripcion: "", puntosRecompensa: 10, tipo: "diario" };

export default function PuntosAdmin() {
  const [sub, setSub] = useState<SubTab>("canjes");
  const [canjes, setCanjes] = useState<Awaited<ReturnType<typeof fetchAdminCanjes>>>([]);
  const [recompensas, setRecompensas] = useState<Awaited<ReturnType<typeof fetchAdminRecompensas>>>([]);
  const [retos, setRetos] = useState<Awaited<ReturnType<typeof fetchAdminRetos>>>([]);
  const [usuarios, setUsuarios] = useState<Awaited<ReturnType<typeof fetchAdminUsuarios>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [c, r, rt, u] = await Promise.all([
        fetchAdminCanjes(),
        fetchAdminRecompensas(),
        fetchAdminRetos(),
        fetchAdminUsuarios(),
      ]);
      setCanjes(c);
      setRecompensas(r);
      setRetos(rt);
      setUsuarios(u);
      setLoading(false);
    }
    load();
  }, []);

  function refresh(key: string) {
    if (key === "canjes") fetchAdminCanjes().then(setCanjes);
    else if (key === "recompensas") fetchAdminRecompensas().then(setRecompensas);
    else if (key === "retos") fetchAdminRetos().then(setRetos);
    else if (key === "usuarios") fetchAdminUsuarios().then(setUsuarios);
  }

  // ── Reward dialog state ────────────────────────────────────
  const [rewardOpen, setRewardOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Recompensa | null>(null);
  const [rewardForm, setRewardForm] = useState({ ...EMPTY_REWARD });
  const [rewardError, setRewardError] = useState("");
  const [rewardSaving, setRewardSaving] = useState(false);

  function openAddReward() {
    setEditingReward(null);
    setRewardForm({ ...EMPTY_REWARD });
    setRewardError("");
    setRewardOpen(true);
  }
  function openEditReward(r: Recompensa) {
    setEditingReward(r);
    setRewardForm({
      titulo: r.titulo,
      descripcion: r.descripcion,
      costoPuntos: r.costoPuntos,
      imagenUrl: r.imagenUrl ?? "",
      activa: r.activa,
    });
    setRewardError("");
    setRewardOpen(true);
  }
  async function handleSaveReward() {
    if (!rewardForm.titulo.trim()) { setRewardError("El título es obligatorio."); return; }
    if (!Number.isFinite(rewardForm.costoPuntos) || rewardForm.costoPuntos < 0) {
      setRewardError("El costo debe ser un número válido."); return;
    }
    const data = {
      titulo: rewardForm.titulo.trim(),
      descripcion: rewardForm.descripcion.trim(),
      costoPuntos: Math.round(rewardForm.costoPuntos),
      imagenUrl: rewardForm.imagenUrl.trim() || null,
      activa: rewardForm.activa,
    };
    setRewardSaving(true);
    setRewardError("");
    try {
      if (editingReward) await actualizarRecompensa(editingReward.id, data);
      else await crearRecompensa(data);
      refresh("recompensas");
      setRewardOpen(false);
    } catch (err) {
      setRewardError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setRewardSaving(false);
    }
  }
  async function handleDeleteReward(id: number) {
    if (!confirm("¿Eliminar esta recompensa?")) return;
    try { await eliminarRecompensa(id); refresh("recompensas"); }
    catch (err) { alert(err instanceof Error ? err.message : "Error al eliminar."); }
  }

  // ── Reto dialog state ──────────────────────────────────────
  const [retoOpen, setRetoOpen] = useState(false);
  const [editingReto, setEditingReto] = useState<Reto | null>(null);
  const [retoForm, setRetoForm] = useState({ ...EMPTY_RETO });
  const [retoError, setRetoError] = useState("");
  const [retoSaving, setRetoSaving] = useState(false);

  function openAddReto() {
    setEditingReto(null);
    setRetoForm({ ...EMPTY_RETO });
    setRetoError("");
    setRetoOpen(true);
  }
  function openEditReto(r: Reto) {
    setEditingReto(r);
    setRetoForm({ titulo: r.titulo, descripcion: r.descripcion, puntosRecompensa: r.puntosRecompensa, tipo: r.tipo });
    setRetoError("");
    setRetoOpen(true);
  }
  async function handleSaveReto() {
    if (!retoForm.titulo.trim()) { setRetoError("El título es obligatorio."); return; }
    if (!Number.isFinite(retoForm.puntosRecompensa) || retoForm.puntosRecompensa < 0) {
      setRetoError("Los puntos deben ser un número válido."); return;
    }
    const data = {
      titulo: retoForm.titulo.trim(),
      descripcion: retoForm.descripcion.trim(),
      puntosRecompensa: Math.round(retoForm.puntosRecompensa),
      tipo: retoForm.tipo,
    };
    setRetoSaving(true);
    setRetoError("");
    try {
      if (editingReto) await actualizarReto(editingReto.id, data);
      else await crearReto(data);
      refresh("retos");
      setRetoOpen(false);
    } catch (err) {
      setRetoError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setRetoSaving(false);
    }
  }
  async function handleDeleteReto(id: number) {
    if (!confirm("¿Eliminar este reto?")) return;
    try { await eliminarReto(id); refresh("retos"); }
    catch (err) { alert(err instanceof Error ? err.message : "Error al eliminar."); }
  }

  async function handleCompletar(id: number) {
    try { await completarCanje(id); refresh("canjes"); }
    catch (err) { alert(err instanceof Error ? err.message : "Error."); }
  }

  // ── User points editing ────────────────────────────────────
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userPts, setUserPts] = useState({ puntosTotales: 0, puntosMensuales: 0 });
  const [userSaving, setUserSaving] = useState(false);

  function openEditUser(u: UsuarioAdmin) {
    setEditingUserId(u.id);
    setUserPts({ puntosTotales: u.puntosTotales, puntosMensuales: u.puntosMensuales });
  }
  async function handleSaveUser() {
    if (!editingUserId) return;
    setUserSaving(true);
    try {
      await actualizarPuntosUsuario(
        editingUserId,
        Math.round(userPts.puntosTotales) || 0,
        Math.round(userPts.puntosMensuales) || 0,
      );
      refresh("usuarios");
      refresh("canjes");
      setEditingUserId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setUserSaving(false);
    }
  }

  const subTabs: { id: SubTab; label: string; icon: typeof Gift }[] = [
    { id: "canjes", label: "Canjes", icon: Clock },
    { id: "recompensas", label: "Recompensas", icon: Gift },
    { id: "retos", label: "Retos", icon: Target },
    { id: "usuarios", label: "Usuarios y puntos", icon: Users },
  ];

  const inputCls = "bg-[#0B1635] border-white/10 text-white";
  const selectCls = "w-full h-10 rounded-md bg-[#0B1635] border border-white/10 text-white px-3 text-sm";

  if (loading) return <div className="flex items-center justify-center h-64">Cargando...</div>;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-white font-semibold">Sistema de Puntos</h2>
        <p className="text-[#A5B4FC]/50 text-xs mt-0.5">
          Gestiona canjes, recompensas, retos y los puntos de cada usuario
        </p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 bg-[#0B1635] border border-white/10 rounded-xl p-1 w-fit flex-wrap">
        {subTabs.map((t) => (
          <button
            key={t.id}
            data-testid={`puntos-subtab-${t.id}`}
            onClick={() => setSub(t.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              sub === t.id ? "bg-primary text-white" : "text-[#A5B4FC] hover:text-white"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CANJES ── */}
      {sub === "canjes" && (
        <div className="bg-[#1D2B64] rounded-xl border border-white/10 overflow-hidden">
          <div className="px-5 py-3 border-b border-white/10 text-[#A5B4FC]/50 text-xs">
            {canjes.length} canjes — marca como entregado cuando el usuario reciba su recompensa
          </div>
          {canjes.length === 0 ? (
            <div className="py-16 text-center text-[#A5B4FC]/40">
              <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No hay canjes todavía.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {canjes.map((c) => (
                <div key={c.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/5">
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">
                      {c.recompensaTitulo ?? "Recompensa eliminada"}
                    </div>
                    <div className="text-[#A5B4FC]/40 text-xs">
                      {c.username ?? "—"} · {c.costoPuntos ?? 0} pts · {new Date(c.fechaCanje).toLocaleDateString()}
                    </div>
                  </div>
                  {c.estado === "entregado" ? (
                    <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" /> Entregado
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      data-testid={`button-completar-${c.id}`}
                      onClick={() => handleCompletar(c.id)}
                      className="bg-primary/20 text-primary hover:bg-primary/30 border-0 h-8"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" /> Marcar entregado
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── RECOMPENSAS ── */}
      {sub === "recompensas" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={openAddReward} data-testid="button-add-recompensa" className="bg-primary/20 text-primary hover:bg-primary/30 border-0 h-8">
              <Plus className="w-4 h-4 mr-1" /> Nueva recompensa
            </Button>
          </div>
          <div className="bg-[#1D2B64] rounded-xl border border-white/10 overflow-hidden">
            {recompensas.length === 0 ? (
              <div className="py-16 text-center text-[#A5B4FC]/40">
                <Gift className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No hay recompensas. Agrega la primera.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {recompensas.map((r) => (
                  <div key={r.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/5">
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {r.titulo}
                        {!r.activa && <span className="text-[#A5B4FC]/40 text-xs ml-2">(oculta)</span>}
                      </div>
                      <div className="text-[#A5B4FC]/40 text-xs truncate">{r.costoPuntos} pts · {r.descripcion}</div>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => openEditReward(r)} data-testid={`button-edit-recompensa-${r.id}`} className="w-7 h-7 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center" title="Editar">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteReward(r.id)} data-testid={`button-delete-recompensa-${r.id}`} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center" title="Eliminar">
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

      {/* ── RETOS ── */}
      {sub === "retos" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={openAddReto} data-testid="button-add-reto" className="bg-primary/20 text-primary hover:bg-primary/30 border-0 h-8">
              <Plus className="w-4 h-4 mr-1" /> Nuevo reto
            </Button>
          </div>
          <div className="bg-[#1D2B64] rounded-xl border border-white/10 overflow-hidden">
            {retos.length === 0 ? (
              <div className="py-16 text-center text-[#A5B4FC]/40">
                <Target className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No hay retos. Los retos se muestran en "Cómo Ganar Puntos".</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {retos.map((r) => (
                  <div key={r.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/5">
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{r.titulo}</div>
                      <div className="text-[#A5B4FC]/40 text-xs truncate">+{r.puntosRecompensa} pts · {r.tipo} · {r.descripcion}</div>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => openEditReto(r)} data-testid={`button-edit-reto-${r.id}`} className="w-7 h-7 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center" title="Editar">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteReto(r.id)} data-testid={`button-delete-reto-${r.id}`} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center" title="Eliminar">
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

      {/* ── USUARIOS ── */}
      {sub === "usuarios" && (
        <div className="bg-[#1D2B64] rounded-xl border border-white/10 overflow-hidden">
          <div className="px-5 py-3 border-b border-white/10 text-[#A5B4FC]/50 text-xs">
            {usuarios.length} cuentas registradas — edita puntos manualmente si es necesario
          </div>
          {usuarios.length === 0 ? (
            <div className="py-16 text-center text-[#A5B4FC]/40">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No hay usuarios registrados todavía.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {usuarios.map((u) => (
                <div key={u.id} className="px-5 py-3.5 hover:bg-white/5">
                  {editingUserId === u.id ? (
                    <div className="flex items-end gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium">{u.username ?? "—"}</div>
                      </div>
                      <div>
                        <label className="block text-[#A5B4FC]/50 text-xs mb-1">Totales</label>
                        <Input
                          type="number"
                          data-testid={`input-puntos-totales-${u.id}`}
                          value={userPts.puntosTotales}
                          onChange={(e) => setUserPts({ ...userPts, puntosTotales: Number(e.target.value) })}
                          className={`${inputCls} w-28 h-9`}
                        />
                      </div>
                      <div>
                        <label className="block text-[#A5B4FC]/50 text-xs mb-1">Del mes</label>
                        <Input
                          type="number"
                          data-testid={`input-puntos-mensuales-${u.id}`}
                          value={userPts.puntosMensuales}
                          onChange={(e) => setUserPts({ ...userPts, puntosMensuales: Number(e.target.value) })}
                          className={`${inputCls} w-28 h-9`}
                        />
                      </div>
                      <Button size="sm" disabled={userSaving} onClick={handleSaveUser} data-testid={`button-save-user-${u.id}`} className="bg-primary hover:bg-primary/90 text-white h-9">
                        <Save className="w-4 h-4 mr-1" /> Guardar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingUserId(null)} className="text-[#A5B4FC]/60 h-9">
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{u.username ?? "—"}</div>
                        <div className="text-[#A5B4FC]/40 text-xs">
                          {u.puntosTotales} pts totales · {u.puntosMensuales} pts del mes
                        </div>
                      </div>
                      <Button size="sm" onClick={() => openEditUser(u)} data-testid={`button-edit-user-${u.id}`} className="bg-primary/20 text-primary hover:bg-primary/30 border-0 h-8">
                        <Pencil className="w-4 h-4 mr-1" /> Editar puntos
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Reward dialog ── */}
      <Dialog open={rewardOpen} onOpenChange={setRewardOpen}>
        <DialogContent className="bg-[#1D2B64] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>{editingReward ? "Editar recompensa" : "Nueva recompensa"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="block text-[#A5B4FC] text-sm mb-1">Título</label>
              <Input data-testid="input-reward-titulo" value={rewardForm.titulo} onChange={(e) => setRewardForm({ ...rewardForm, titulo: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-[#A5B4FC] text-sm mb-1">Descripción</label>
              <Input data-testid="input-reward-descripcion" value={rewardForm.descripcion} onChange={(e) => setRewardForm({ ...rewardForm, descripcion: e.target.value })} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#A5B4FC] text-sm mb-1">Costo (puntos)</label>
                <Input type="number" data-testid="input-reward-costo" value={rewardForm.costoPuntos} onChange={(e) => setRewardForm({ ...rewardForm, costoPuntos: Number(e.target.value) })} className={inputCls} />
              </div>
              <div>
                <label className="block text-[#A5B4FC] text-sm mb-1">Estado</label>
                <select data-testid="select-reward-activa" value={rewardForm.activa ? "1" : "0"} onChange={(e) => setRewardForm({ ...rewardForm, activa: e.target.value === "1" })} className={selectCls}>
                  <option value="1">Visible</option>
                  <option value="0">Oculta</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[#A5B4FC] text-sm mb-1">URL de imagen (opcional)</label>
              <Input data-testid="input-reward-imagen" value={rewardForm.imagenUrl} onChange={(e) => setRewardForm({ ...rewardForm, imagenUrl: e.target.value })} className={inputCls} placeholder="https://..." />
            </div>
            {rewardError && <p className="text-red-400 text-xs">{rewardError}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setRewardOpen(false)} className="text-[#A5B4FC]/60">Cancelar</Button>
              <Button disabled={rewardSaving} onClick={handleSaveReward} data-testid="button-save-recompensa" className="bg-primary hover:bg-primary/90 text-white">
                <Save className="w-4 h-4 mr-1" /> {rewardSaving ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Reto dialog ── */}
      <Dialog open={retoOpen} onOpenChange={setRetoOpen}>
        <DialogContent className="bg-[#1D2B64] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>{editingReto ? "Editar reto" : "Nuevo reto"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="block text-[#A5B4FC] text-sm mb-1">Título</label>
              <Input data-testid="input-reto-titulo" value={retoForm.titulo} onChange={(e) => setRetoForm({ ...retoForm, titulo: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-[#A5B4FC] text-sm mb-1">Descripción</label>
              <Input data-testid="input-reto-descripcion" value={retoForm.descripcion} onChange={(e) => setRetoForm({ ...retoForm, descripcion: e.target.value })} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#A5B4FC] text-sm mb-1">Puntos</label>
                <Input type="number" data-testid="input-reto-puntos" value={retoForm.puntosRecompensa} onChange={(e) => setRetoForm({ ...retoForm, puntosRecompensa: Number(e.target.value) })} className={inputCls} />
              </div>
              <div>
                <label className="block text-[#A5B4FC] text-sm mb-1">Tipo</label>
                <select data-testid="select-reto-tipo" value={retoForm.tipo} onChange={(e) => setRetoForm({ ...retoForm, tipo: e.target.value })} className={selectCls}>
                  {RETO_TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            {retoError && <p className="text-red-400 text-xs">{retoError}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setRetoOpen(false)} className="text-[#A5B4FC]/60">Cancelar</Button>
              <Button disabled={retoSaving} onClick={handleSaveReto} data-testid="button-save-reto" className="bg-primary hover:bg-primary/90 text-white">
                <Save className="w-4 h-4 mr-1" /> {retoSaving ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}