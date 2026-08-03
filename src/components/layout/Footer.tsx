import { Link } from "wouter";
import { Swords, MessageCircle, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#060e24] border-t border-white/5 pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Swords className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">WR Hub</span>
            </div>
            <p className="text-[#A5B4FC]/60 text-sm leading-relaxed">
              Tu plataforma de estadísticas, metas y actualizaciones para Wild Rift.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Navegacion</h4>
            <ul className="space-y-2">
              {[
                { label: "Inicio", href: "/" },
                { label: "Actualizaciones", href: "/actualizaciones" },
                { label: "Calendario", href: "/calendario" },
                { label: "Sistema de Puntos", href: "/puntos" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    <span className="text-[#A5B4FC]/60 hover:text-[#A5B4FC] text-sm transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Meta</h4>
            <ul className="space-y-2">
              {[
                { label: "Campeones", href: "/meta/campeones" },
                { label: "Items", href: "/meta/items" },
                { label: "Runas", href: "/meta/runas" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} data-testid={`footer-link-meta-${link.label.toLowerCase()}`}>
                    <span className="text-[#A5B4FC]/60 hover:text-[#A5B4FC] text-sm transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Comunidad</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  data-testid="footer-link-discord"
                  className="flex items-center gap-2 text-[#A5B4FC]/60 hover:text-[#A5B4FC] text-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Discord (Próximamente)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  data-testid="footer-link-twitter"
                  className="flex items-center gap-2 text-[#A5B4FC]/60 hover:text-[#A5B4FC] text-sm transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter (Próximamente)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 space-y-3">
          <p className="text-[#A5B4FC]/30 text-xs text-center max-w-3xl mx-auto leading-relaxed">
            WR Hub is baked under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-[#A5B4FC]/40 text-xs">
              © 2026 WR Hub. Todos los derechos reservados.
            </p>
            <p className="text-[#A5B4FC]/30 text-xs">
              No afiliado con Riot Games. Wild Rift es marca de Riot Games.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
