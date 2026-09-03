/**
 * AGB CHANTIER - Modal de Collecte de Signature Manuscrite Tactile
 */

import React from "react";
import { AppModal } from "./app_modal";
import { AppSignaturePad, SignatureData } from "../inputs/app_signature_pad";
import { PenTool } from "lucide-react";

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentRef: string;
  defaultSignatoryName?: string;
  defaultSignatoryRole?: string;
  defaultSignatoryCompany?: string;
  rolesOptions?: string[];
  onConfirmSignature: (data: SignatureData) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  documentRef,
  defaultSignatoryName,
  defaultSignatoryRole,
  defaultSignatoryCompany,
  rolesOptions,
  onConfirmSignature,
}) => {
  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Émargement & Signature Tactile"
      subtitle="Apposez votre signature manuscrite pour certifier ce document de chantier"
      icon={<PenTool className="w-5 h-5 text-orange-600" />}
      size="lg"
    >
      <AppSignaturePad
        documentTitle={documentTitle}
        documentRef={documentRef}
        defaultSignatoryName={defaultSignatoryName}
        defaultSignatoryRole={defaultSignatoryRole}
        defaultSignatoryCompany={defaultSignatoryCompany}
        rolesOptions={rolesOptions}
        onSaveSignature={(data) => {
          onConfirmSignature(data);
          onClose();
        }}
        onCancel={onClose}
      />
    </AppModal>
  );
};
