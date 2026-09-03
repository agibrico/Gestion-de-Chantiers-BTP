/**
 * AGB SIGNATURE OFFICIELLE DU CONCEPTEUR
 * Signature officielle présente en dessous de toutes les applications créées par AGB.
 * Identité visuelle : Monogramme AGB Circuit Bleu + Coordonnées Concepteur
 */

import React, { useState } from "react";
import { Mail, Phone, ExternalLink, Check, Copy, Sparkles, Smartphone, Code2 } from "lucide-react";

interface AgbCreatorSignatureProps {
  variant?: "full" | "compact" | "badge" | "card";
  className?: string;
  showContacts?: boolean;
}

export const AgbCreatorSignature: React.FC<AgbCreatorSignatureProps> = ({
  variant = "full",
  className = "",
  showContacts = true,
}) => {
  const [copied, setCopied] = useState<string | null>(null);

  const email = "atsegillesbrice@gmail.com";
  const phones = ["0104818092", "0797709693"];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  // Monogramme AGB Stylisé Circuit Vectoriel Haute Définition
  const AgbCircuitEmblem = ({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) => {
    const dimensions = {
      sm: { w: 90, h: 42 },
      md: { w: 140, h: 64 },
      lg: { w: 200, h: 92 },
      xl: { w: 280, h: 130 },
    }[size];

    return (
      <div className="relative inline-flex items-center justify-center select-none shrink-0 group">
        <svg
          viewBox="0 0 600 280"
          width={dimensions.w}
          height={dimensions.h}
          className="drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="blueGlowAgb" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1D4ED8" />
              <stop offset="45%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="circuitCyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <filter id="agbCardGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0284C7" floodOpacity="0.3" />
            </filter>
          </defs>

          <g filter="url(#agbCardGlow)">
            {/* Letter 'A' Dynamic Chevron */}
            <path
              d="M130 30 L220 220 L165 220 L140 160 L80 220 L35 220 Z"
              fill="url(#blueGlowAgb)"
            />
            {/* A Inner Cut */}
            <path d="M130 85 L102 185 L138 185 Z" fill="#FFFFFF" opacity="0.9" />
            {/* A Ribbon curve connecting to G */}
            <path
              d="M130 30 C75 160 45 220 70 245 C95 270 145 230 175 190 C205 150 235 145 275 180"
              fill="none"
              stroke="url(#blueGlowAgb)"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Letter 'G' Circuit Ring */}
            <circle
              cx="310"
              cy="135"
              r="75"
              fill="none"
              stroke="url(#blueGlowAgb)"
              strokeWidth="28"
            />
            <path
              d="M310 60 A75 75 0 0 1 385 135 L320 135"
              fill="none"
              stroke="url(#circuitCyan)"
              strokeWidth="28"
              strokeLinecap="round"
            />
            {/* Center G Node */}
            <circle cx="310" cy="135" r="18" fill="url(#blueGlowAgb)" />
            <circle cx="310" cy="135" r="8" fill="#FFFFFF" />

            {/* Letter 'B' Circuit Horizontal Lines with Nodes */}
            <path
              d="M375 90 L435 90"
              fill="none"
              stroke="url(#circuitCyan)"
              strokeWidth="15"
              strokeLinecap="round"
            />
            <circle cx="440" cy="90" r="12" fill="#0284C7" />
            <circle cx="440" cy="90" r="5" fill="#FFFFFF" />

            <path
              d="M375 180 L435 180"
              fill="none"
              stroke="url(#circuitCyan)"
              strokeWidth="15"
              strokeLinecap="round"
            />
            <circle cx="440" cy="180" r="12" fill="#0284C7" />
            <circle cx="440" cy="180" r="5" fill="#FFFFFF" />

            {/* 'B' Outer Curved Ribs */}
            <path
              d="M390 55 C480 55 520 90 520 125 C520 145 505 158 480 162 C515 170 535 195 535 225 C535 270 480 275 390 275"
              fill="none"
              stroke="url(#blueGlowAgb)"
              strokeWidth="28"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    );
  };

  // 1. VARIANT : FULL SIGNATURE (Matching the exact uploaded designer card)
  if (variant === "full") {
    return (
      <div
        className={`flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}
      >
        {/* Top Official Emblem */}
        <AgbCircuitEmblem size="lg" />

        {/* Designer Title */}
        <div className="mt-4 space-y-0.5">
          <h3 className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white uppercase leading-snug">
            CONCEPTEUR D'APPLICATIONS MOBILES
          </h3>
          <h4 className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white uppercase leading-snug">
            ET SOLUTIONS WEB SUR MESURE
          </h4>
        </div>

        {/* Contact info badges */}
        {showContacts && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {/* Email link & copy */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
              <Mail className="w-3.5 h-3.5 text-sky-500" />
              <a
                href={`mailto:${email}`}
                className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400"
              >
                {email}
              </a>
              <button
                onClick={() => handleCopy(email, "email")}
                className="ml-1 p-1 hover:bg-slate-300 dark:hover:bg-slate-600 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
                title="Copier l'email"
              >
                {copied === "email" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            {/* Phones links & copy */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
              <div className="flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white font-mono">
                <a href={`tel:${phones[0]}`} className="hover:text-emerald-600 dark:hover:text-emerald-400">
                  {phones[0]}
                </a>
                <span className="text-slate-400">/</span>
                <a href={`tel:${phones[1]}`} className="hover:text-emerald-600 dark:hover:text-emerald-400">
                  {phones[1]}
                </a>
              </div>
              <button
                onClick={() => handleCopy(`${phones[0]} / ${phones[1]}`, "phones")}
                className="ml-1 p-1 hover:bg-slate-300 dark:hover:bg-slate-600 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
                title="Copier les numéros"
              >
                {copied === "phones" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. VARIANT : COMPACT FOOTER STRIP
  if (variant === "compact") {
    return (
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-950 text-white rounded-xl border border-slate-800/90 shadow-md ${className}`}>
        <div className="flex items-center gap-3.5">
          <AgbCircuitEmblem size="sm" />
          <div className="flex flex-col text-left">
            <span className="text-xs font-black tracking-tight text-white uppercase leading-none">
              CONCEPTEUR D'APPLICATIONS MOBILES & WEB SUR MESURE
            </span>
            <span className="text-[11px] text-slate-400 font-medium mt-1">
              Signature Officielle AGB • {email} • {phones[0]} / {phones[1]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contacter le Concepteur</span>
          </a>
        </div>
      </div>
    );
  }

  // 3. VARIANT : BADGE / PILL
  if (variant === "badge") {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-xs text-xs select-none ${className}`}>
        <AgbCircuitEmblem size="sm" />
        <div className="flex flex-col text-left leading-none">
          <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase">AGB Concepteur</span>
          <span className="text-[9px] text-slate-500 dark:text-slate-400">Mobile & Web sur mesure</span>
        </div>
      </div>
    );
  }

  // 4. VARIANT : EMBEDDED CARD
  return (
    <div className={`p-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl border border-slate-800 shadow-md relative overflow-hidden ${className}`}>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <AgbCircuitEmblem size="md" />

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3" /> Signature Concepteur
          </div>
          <h3 className="text-sm font-black text-white uppercase tracking-tight">
            CONCEPTEUR D'APPLICATIONS MOBILES ET SOLUTIONS WEB SUR MESURE
          </h3>
          <p className="text-xs text-slate-400">
            Développement d'applications SaaS, mobiles natives et plateformes d'entreprise sur mesure.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 text-sky-400 hover:underline font-semibold"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{email}</span>
            </a>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1.5 text-slate-300 font-mono font-bold">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{phones[0]} / {phones[1]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
