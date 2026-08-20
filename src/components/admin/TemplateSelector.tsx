"use client";

import React, { useState, useTransition } from "react";
import { Leaf, Snowflake, Flower2, Sun, CheckCircle2, Loader2 } from "lucide-react";

type Template = "default" | "otono" | "invierno" | "primavera" | "verano";

const TEMPLATES: {
  id: Template;
  label: string;
  description: string;
  bg: string;
  accent: string;
  icon: React.ReactNode;
  htmlClass: string;
}[] = [
  {
    id: "default",
    label: "Clásico",
    description: "Blanco hueso • Negro carbón",
    bg: "#FDFCFA",
    accent: "#161616",
    icon: <span className="text-lg font-bold">A</span>,
    htmlClass: "",
  },
  {
    id: "otono",
    label: "Otoño",
    description: "Tonos tierra • Naranja quemado • Burdeos",
    bg: "#F9F4EE",
    accent: "#8B3A1A",
    icon: <Leaf className="w-5 h-5" />,
    htmlClass: "template-otono",
  },
  {
    id: "invierno",
    label: "Invierno",
    description: "Azul medianoche • Gris pizarra • Plata",
    bg: "#F0F2F5",
    accent: "#1E3A5F",
    icon: <Snowflake className="w-5 h-5" />,
    htmlClass: "template-invierno",
  },
  {
    id: "primavera",
    label: "Primavera",
    description: "Rosa pálido • Verde sage • Lila suave",
    bg: "#FDF8F5",
    accent: "#A05070",
    icon: <Flower2 className="w-5 h-5" />,
    htmlClass: "template-primavera",
  },
  {
    id: "verano",
    label: "Verano",
    description: "Coral vivo • Arena dorada • Turquesa",
    bg: "#FFFDF7",
    accent: "#C4601A",
    icon: <Sun className="w-5 h-5" />,
    htmlClass: "template-verano",
  },
];

interface TemplateSelectorProps {
  currentTemplate: string;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ currentTemplate }) => {
  const [active, setActive] = useState<Template>((currentTemplate as Template) || "default");
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const applyTemplate = async (t: (typeof TEMPLATES)[0]) => {
    setActive(t.id);
    setSaved(false);

    // Aplicar al HTML inmediatamente (preview en vivo)
    const html = document.documentElement;
    TEMPLATES.forEach((tmpl) => {
      if (tmpl.htmlClass) html.classList.remove(tmpl.htmlClass);
    });
    if (t.htmlClass) html.classList.add(t.htmlClass);

    // Guardar en MySQL
    startTransition(async () => {
      try {
        await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active_template: t.id }),
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch (e) {
        console.error("Error guardando template:", e);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {TEMPLATES.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => applyTemplate(t)}
              className={`group relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-left ${
                isActive
                  ? "border-charcoal-950 shadow-lg scale-105"
                  : "border-charcoal-200 hover:border-charcoal-400 hover:shadow"
              }`}
              style={{ background: t.bg }}
            >
              {/* Color preview dot */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                style={{ background: t.accent, color: "#fff" }}
              >
                {t.icon}
              </div>

              <div className="w-full">
                <p className="text-xs font-semibold tracking-wide" style={{ color: t.accent }}>
                  {t.label}
                </p>
                <p className="text-[10px] text-charcoal-500 leading-tight mt-0.5">
                  {t.description}
                </p>
              </div>

              {isActive && (
                <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-emerald-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 text-xs">
        {isPending && (
          <span className="flex items-center gap-1.5 text-charcoal-500">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Guardando en base de datos...
          </span>
        )}
        {saved && !isPending && (
          <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Template guardado — visible para todos los visitantes
          </span>
        )}
      </div>
    </div>
  );
};
