/**
 * AGB CHANTIER - Composant Modal Métier Réutilisable
 */

import React from "react";
import { AppDialog } from "./app_dialog";

export interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export const AppModal: React.FC<AppModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  size = "lg",
}) => {
  return (
    <AppDialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={icon}
      footer={footer}
      maxWidth={size}
    >
      {children}
    </AppDialog>
  );
};
