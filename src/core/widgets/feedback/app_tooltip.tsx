/**
 * AGB CHANTIER - Composant Infobulle Métier (Tooltip)
 * Affiche une infobulle stylisée au survol d'un bouton ou élément d'action
 * pour expliquer en détail l'intervention ou l'action déclenchée.
 */

import React, { useState, useRef, useEffect } from "react";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface AppTooltipProps {
  content?: string | React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  disabled?: boolean;
  children: React.ReactElement;
  className?: string;
}

export const AppTooltip: React.FC<AppTooltipProps> = ({
  content,
  position = "top",
  delay = 200,
  disabled = false,
  children,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  if (!content || disabled) {
    return children;
  }

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const getPositionStyles = () => {
    switch (position) {
      case "top":
        return "bottom-full left-1/2 -translate-x-1/2 mb-2";
      case "bottom":
        return "top-full left-1/2 -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-2";
    }
  };

  const getArrowStyles = () => {
    switch (position) {
      case "top":
        return "top-full left-1/2 -translate-x-1/2 border-t-slate-900 dark:border-t-slate-800 border-x-transparent border-b-transparent border-4";
      case "bottom":
        return "bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 dark:border-b-slate-800 border-x-transparent border-t-transparent border-4";
      case "left":
        return "left-full top-1/2 -translate-y-1/2 border-l-slate-900 dark:border-l-slate-800 border-y-transparent border-r-transparent border-4";
      case "right":
        return "right-full top-1/2 -translate-y-1/2 border-r-slate-900 dark:border-r-slate-800 border-y-transparent border-l-transparent border-4";
    }
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}

      {isVisible && (
        <div
          role="tooltip"
          className={`absolute ${getPositionStyles()} z-50 pointer-events-none transition-all duration-150 ease-out animate-in fade-in zoom-in-95 ${className}`}
        >
          <div className="bg-slate-900 dark:bg-slate-800 text-slate-100 text-xs font-medium px-2.5 py-1.5 rounded-md shadow-xl border border-slate-700/80 max-w-xs w-max text-center leading-relaxed">
            {content}
          </div>
          <div className={`absolute w-0 h-0 ${getArrowStyles()}`} />
        </div>
      )}
    </div>
  );
};
