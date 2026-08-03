import { useEffect } from "react";
import { useLocation } from "wouter";
import { Swords, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setPageMeta } from "@/lib/seo";

export default function NotFound() {
  useEffect(() => {
    setPageMeta(
      "404 – Página no encontrada | WR Hub",
      "La página que buscas no existe en WR Hub. Regresa al inicio para explorar la meta, actualizaciones y estadísticas de Wild Rift."
    );
  }, []);

  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
          <Swords className="w-10 h-10 text-primary" />
        </div>
        <div className="text-8xl font-black text-white/10 mb-4 leading-none">404</div>
        <h1 className="text-2xl font-bold text-white mb-3">Página no encontrada</h1>
        <p className="text-[#A5B4FC]/60 text-sm leading-relaxed mb-8">
          Esta ruta no existe en WR Hub. Puede que haya sido movida o simplemente no esté disponible.
        </p>
        <Button
          onClick={() => setLocation("/")}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Home className="w-4 h-4 mr-2" />
          Volver al Inicio
        </Button>
      </div>
    </div>
  );
}
