import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Swords, Menu, X, ChevronDown, PlusCircle, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getSession, saveContribution } from "@/lib/auth";
import { usePatchNotification } from "@/hooks/usePatchNotification";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Actualizaciones", href: "/actualizaciones" },
  { label: "Calendario", href: "/calendario" },
  { label: "Puntos", href: "/puntos" },
];

const metaLinks = [
  { label: "Campeones", href: "/meta/campeones" },
  { label: "Items", href: "/meta/items" },
  { label: "Runas", href: "/meta/runas" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [metaOpen, setMetaOpen] = useState(false);
  const [contribuirOpen, setContribuirOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [session, setSession] = useState(getSession());
  const { hasNewPatch } = usePatchNotification();

  const [form, setForm] = useState({
    tipo: "Estadistica de campeón",
    titulo: "",
    descripcion: "",
    fecha: new Date().toISOString().slice(0, 10),
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const update = () => setSession(getSession());
    window.addEventListener("storage", update);
    const timer = setInterval(update, 1000);
    return () => { window.removeEventListener("storage", update); clearInterval(timer); };
  }, []);

  useEffect(() => {
    if (!contribuirOpen) {
      setSubmitted(false);
      setFormError("");
    }
  }, [contribuirOpen]);

  function handleSubmitContribuir() {
    setFormError("");
    if (!form.titulo.trim()) { setFormError("El título es obligatorio."); return; }
    if (!form.descripcion.trim()) { setFormError("La descripción es obligatoria."); return; }
    saveContribution({
      title: form.titulo.trim(),
      description: form.descripcion.trim(),
      date: form.fecha,
      author: session?.username ?? "Anónimo",
      type: form.tipo,
    });
    setSubmitted(true);
    setForm({ tipo: "Estadistica de campeón", titulo: "", descripcion: "", fecha: new Date().toISOString().slice(0, 10) });
    setTimeout(() => setContribuirOpen(false), 2200);
  }

  const loggedIn = !!session;

  return (
    <>
      <header
        data-testid="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0B1635]/95 backdrop-blur-md border-b border-white/10 shadow-lg"
            : "bg-[#0B1635]/80 backdrop-blur-sm border-b border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" data-testid="link-logo">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                  <Swords className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold text-lg tracking-tight">WR Hub</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} data-testid={`link-${link.label.toLowerCase()}`}>
                  <span
                    className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                      location === link.href
                        ? "text-white bg-white/10"
                        : "text-[#A5B4FC] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                    {link.href === "/actualizaciones" && hasNewPatch && (
                      <span
                        data-testid="badge-new-patch"
                        className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0B1635]"
                      />
                    )}
                  </span>
                </Link>
              ))}
              <div className="relative" onMouseLeave={() => setMetaOpen(false)}>
                <button
                  onMouseEnter={() => setMetaOpen(true)}
                  onClick={() => setMetaOpen((v) => !v)}
                  data-testid="button-meta-dropdown"
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.startsWith("/meta")
                      ? "text-white bg-white/10"
                      : "text-[#A5B4FC] hover:text-white hover:bg-white/5"
                  }`}
                >
                  Meta
                  <ChevronDown className={`w-4 h-4 transition-transform ${metaOpen ? "rotate-180" : ""}`} />
                </button>
                {metaOpen && (
                  <div className="absolute top-full left-0 mt-1 w-40 bg-[#1D2B64] border border-white/10 rounded-lg shadow-xl overflow-hidden">
                    {metaLinks.map((link) => (
                      <Link key={link.href} href={link.href} data-testid={`link-meta-${link.label.toLowerCase()}`}>
                        <span
                          className="block px-4 py-2.5 text-sm text-[#A5B4FC] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                          onClick={() => setMetaOpen(false)}
                        >
                          {link.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setContribuirOpen(true)}
                data-testid="button-contribuir"
                className="border-primary text-primary hover:bg-primary hover:text-white transition-all"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Contribuir
              </Button>
              {loggedIn ? (
                <Link href="/perfil" data-testid="link-perfil">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                    {session!.username}
                  </Button>
                </Link>
              ) : (
                <Link href="/login" data-testid="link-login">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                    Iniciar Sesión
                  </Button>
                </Link>
              )}
            </div>

            <button
              className="md:hidden p-2 text-[#A5B4FC] hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-[#0B1635]/98 backdrop-blur-xl border-t border-white/10 px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} data-testid={`mobile-link-${link.label.toLowerCase()}`}>
                <span
                  className="relative block px-3 py-2 rounded-md text-sm font-medium text-[#A5B4FC] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                  {link.href === "/actualizaciones" && hasNewPatch && (
                    <span className="absolute top-2.5 right-3 w-2 h-2 rounded-full bg-red-500" />
                  )}
                </span>
              </Link>
            ))}
            <div className="pl-3 text-xs text-[#A5B4FC]/60 uppercase tracking-wider pt-2 pb-1">Meta</div>
            {metaLinks.map((link) => (
              <Link key={link.href} href={link.href} data-testid={`mobile-link-meta-${link.label.toLowerCase()}`}>
                <span
                  className="block px-3 py-2 rounded-md text-sm font-medium text-[#A5B4FC] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setContribuirOpen(true); setMobileOpen(false); }}
                className="border-primary text-primary w-full"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Contribuir
              </Button>
              {loggedIn ? (
                <Link href="/perfil">
                  <Button size="sm" className="bg-primary text-white w-full" onClick={() => setMobileOpen(false)}>
                    {session!.username}
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button size="sm" className="bg-primary text-white w-full" onClick={() => setMobileOpen(false)}>
                    Iniciar Sesión
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <Dialog open={contribuirOpen} onOpenChange={setContribuirOpen}>
        <DialogContent className="bg-[#1D2B64] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Contribuir al Hub</DialogTitle>
          </DialogHeader>
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-white font-semibold text-lg">Contribución enviada</p>
              <p className="text-[#A5B4FC]/60 text-sm mt-1">Gracias por tu aporte. Aparecerá en Actualizaciones cuando sea aprobada.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#A5B4FC] mb-1.5">Tipo</label>
                <select
                  data-testid="select-contribuir-tipo"
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                  className="w-full bg-[#0B1635] border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-primary/50"
                >
                  <option>Estadistica de campeón</option>
                  <option>Build recomendada</option>
                  <option>Datamine / Información filtrada</option>
                  <option>Corrección de datos</option>
                  <option>Parche</option>
                  <option>Evento</option>
                  <option>Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#A5B4FC] mb-1.5">Título</label>
                <Input
                  data-testid="input-contribuir-titulo"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  className="bg-[#0B1635] border-white/10 text-white"
                  placeholder="Ej: Jinx S+ con nueva build de Kraken"
                />
              </div>
              <div>
                <label className="block text-sm text-[#A5B4FC] mb-1.5">Descripción</label>
                <Textarea
                  data-testid="input-contribuir-descripcion"
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="bg-[#0B1635] border-white/10 text-white resize-none"
                  rows={4}
                  placeholder="Describe tu contribución con el mayor detalle posible..."
                />
              </div>
              <div>
                <label className="block text-sm text-[#A5B4FC] mb-1.5">Fecha</label>
                <Input
                  data-testid="input-contribuir-fecha"
                  type="date"
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                  className="bg-[#0B1635] border-white/10 text-white"
                />
              </div>
              {formError && (
                <p className="text-red-400 text-xs">{formError}</p>
              )}
              <Button
                data-testid="button-contribuir-submit"
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleSubmitContribuir}
              >
                Enviar Contribución
              </Button>
              {!loggedIn && (
                <p className="text-center text-[#A5B4FC]/40 text-xs">Aparecerá como "Anónimo" — inicia sesión para acreditar tu nombre</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
