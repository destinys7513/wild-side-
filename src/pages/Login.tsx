import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Swords, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setPageMeta } from "@/lib/seo";
import { getSession, login as localLogin, setAdminSession } from "@/lib/auth";
import { useAppAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login: authLogin } = useAppAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPageMeta(
      "Iniciar Sesión – WR Hub | Accede a tu cuenta",
      "Inicia sesión en WR Hub con tu nombre de usuario y contraseña para acceder a estadísticas personales, historial de partidas y el sistema de puntos."
    );
    if (getSession()) {
      setLocation("/perfil");
    }
  }, [setLocation]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await authLogin(username, password);
      if (!result.ok) {
        setError(result.error || "Error al iniciar sesión.");
        return;
      }
      if (result.ok && username.trim().toLowerCase() === "admin") {
        setAdminSession(username);
        setLocation("/admin");
      } else {
        setLocation("/perfil");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Swords className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">WR Hub</h1>
          <p className="text-[#A5B4FC]/60 text-sm mt-1">Inicia sesión o crea tu cuenta</p>
        </div>

        <div className="bg-[#1D2B64] border border-white/10 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#A5B4FC] mb-1.5">Nombre de usuario</label>
              <Input
                data-testid="input-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tu nombre de usuario"
                autoComplete="username"
                className="bg-[#0B1635] border-white/10 text-white placeholder:text-[#A5B4FC]/30 focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A5B4FC] mb-1.5">Contraseña</label>
              <div className="relative">
                <Input
                  data-testid="input-password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                  className="bg-[#0B1635] border-white/10 text-white placeholder:text-[#A5B4FC]/30 focus:border-primary/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A5B4FC]/40 hover:text-[#A5B4FC] transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400 flex-none" />
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            <Button
              data-testid="button-login-submit"
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold"
            >
              {loading ? "Iniciando..." : "Iniciar sesión"}
            </Button>
          </form>

          <p className="text-center text-[#A5B4FC]/40 text-xs mt-4">
            Si no tienes cuenta, se creará automáticamente
          </p>
        </div>
      </div>
    </div>
  );
}