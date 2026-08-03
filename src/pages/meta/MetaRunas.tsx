import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { runesByPath, recommendedRunePages } from "@/data/mockData";
import { setPageMeta } from "@/lib/seo";

type PathKey = keyof typeof runesByPath;

const pathColors: Record<PathKey, string> = {
  Precision: "#EAB308",
  Domination: "#EF4444",
  Sorcery: "#3B82F6",
  Resolve: "#22C55E",
  Inspiration: "#8B5CF6",
};

const pathDescriptions: Record<PathKey, string> = {
  Precision: "Aumenta ataques y otorga habilidades de pelea sostenida",
  Domination: "Golpes directos y acceso a objetivos",
  Sorcery: "Potencia habilidades con efectos empoderados",
  Resolve: "Resistencia y aguante superior en combate",
  Inspiration: "Herramientas creativas que rompen las reglas",
};

export default function MetaRunas() {
  useEffect(() => {
    setPageMeta(
      "Meta Runas – WR Hub | Runas Wild Rift Patch 7.1",
      "Árbol de runas y páginas recomendadas para Wild Rift Patch 7.1. Explora las 5 sendas: Precisión, Dominación, Hechicería, Determinación e Inspiración."
    );
  }, []);

  const [selectedPath, setSelectedPath] = useState<PathKey>("Precision");
  const path = runesByPath[selectedPath];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Meta Runas</h1>
          <p className="text-[#A5B4FC]/70">Árbol de runas y páginas recomendadas para Patch 7.1</p>
        </div>

        {/* Path Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
          {(Object.keys(runesByPath) as PathKey[]).map((pathName) => (
            <button
              key={pathName}
              data-testid={`rune-path-${pathName.toLowerCase()}`}
              onClick={() => setSelectedPath(pathName)}
              className={`p-4 rounded-xl border transition-all text-center ${
                selectedPath === pathName
                  ? "border-white/30 bg-white/10"
                  : "border-white/10 bg-[#1D2B64] hover:border-white/20 hover:bg-white/5"
              }`}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
                style={{ backgroundColor: `${pathColors[pathName]}25` }}
              >
                <Star className="w-5 h-5" style={{ color: pathColors[pathName] }} />
              </div>
              <div className="text-white text-sm font-semibold">{pathName}</div>
              <div className="text-[#A5B4FC]/50 text-xs mt-0.5 line-clamp-2">{pathDescriptions[pathName]}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Keystones */}
          <div>
            <h2 className="text-white font-semibold text-lg mb-4">
              <span style={{ color: pathColors[selectedPath] }}>Piedras Angulares</span> – {selectedPath}
            </h2>
            <div className="space-y-3">
              {path.keystones.map((rune) => (
                <div
                  key={rune.name}
                  data-testid={`keystone-${rune.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`p-4 rounded-xl border transition-all ${
                    rune.recommended
                      ? "border-primary/30 bg-primary/10"
                      : "border-white/10 bg-[#1D2B64]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-none"
                        style={{ backgroundColor: `${pathColors[selectedPath]}25`, color: pathColors[selectedPath] }}
                      >
                        {rune.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold text-sm">{rune.name}</span>
                          {rune.recommended && (
                            <span className="text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded-full">Recomendado</span>
                          )}
                        </div>
                        <div className="text-green-400 text-xs mt-0.5">{rune.winrate}% WR</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[#A5B4FC]/60 text-xs leading-relaxed">{rune.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary Runes */}
          <div>
            <h2 className="text-white font-semibold text-lg mb-4">Runas Secundarias</h2>
            <div className="space-y-3">
              {path.secondary.map((rune) => (
                <div
                  key={rune.name}
                  data-testid={`secondary-rune-${rune.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="p-4 rounded-xl border border-white/10 bg-[#1D2B64] hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-none"
                      style={{ backgroundColor: `${pathColors[selectedPath]}20`, color: pathColors[selectedPath] }}
                    >
                      {rune.name.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{rune.name}</div>
                      <div className="text-green-400 text-xs">{rune.winrate}% WR</div>
                    </div>
                  </div>
                  <p className="text-[#A5B4FC]/60 text-xs leading-relaxed">{rune.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Pages */}
        <div>
          <h2 className="text-white font-semibold text-lg mb-4">Páginas Recomendadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recommendedRunePages.map((page, i) => (
              <div
                key={i}
                data-testid={`recommended-page-${page.champion.toLowerCase()}`}
                className="bg-[#1D2B64] rounded-xl border border-white/10 p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-white font-semibold">{page.champion}</div>
                    <div className="text-[#A5B4FC]/50 text-xs mt-0.5">{page.path}</div>
                  </div>
                  <span className="text-green-400 text-sm font-semibold">{page.winrate}% WR</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: `${pathColors[page.path as PathKey] || "#5B21B6"}25`, color: pathColors[page.path as PathKey] || "#5B21B6" }}
                    >
                      {page.keystone.slice(0, 2)}
                    </div>
                    <span className="text-white text-sm">{page.keystone}</span>
                    <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full ml-auto">Keystones</span>
                  </div>
                  {page.secondary.map((r) => (
                    <div key={r} className="flex items-center gap-2 pl-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#A5B4FC]/30" />
                      <span className="text-[#A5B4FC] text-xs">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[#A5B4FC]/30 text-xs text-center mt-8">
          Datos basados en Patch 7.1 · Actualizado diariamente
        </p>
      </div>
    </div>
  );
}
