import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clock, XCircle, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface DocumentStatus {
  id: number;
  documentType: "passport" | "national_id" | "driver_license" | "birth_certificate" | "residence_permit";
  fileName: string;
  status: "pending" | "verified" | "rejected" | "expired";
  uploadedAt: Date;
  verificationNotes?: string | null;
  expiresAt?: Date | null;
}

interface DocumentStatusCardProps {
  documents: DocumentStatus[];
  isLoading?: boolean;
}

const getDocumentTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    passport: "Passeport",
    national_id: "Carte d'identité",
    driver_license: "Permis de conduire",
    birth_certificate: "Acte de naissance",
    residence_permit: "Titre de séjour",
  };
  return labels[type] || type;
};

const getStatusConfig = (status: string) => {
  const configs: Record<
    string,
    {
      label: string;
      color: string;
      bgColor: string;
      icon: React.ReactNode;
      description: string;
    }
  > = {
    pending: {
      label: "En attente",
      color: "bg-yellow-100 text-yellow-800",
      bgColor: "bg-yellow-50",
      icon: <Clock className="w-4 h-4" />,
      description: "Votre document est en attente de vérification par notre équipe.",
    },
    verified: {
      label: "Vérifié",
      color: "bg-green-100 text-green-800",
      bgColor: "bg-green-50",
      icon: <CheckCircle2 className="w-4 h-4" />,
      description: "Votre document a été vérifié avec succès.",
    },
    rejected: {
      label: "Rejeté",
      color: "bg-red-100 text-red-800",
      bgColor: "bg-red-50",
      icon: <XCircle className="w-4 h-4" />,
      description: "Votre document a été rejeté. Veuillez télécharger un nouveau document.",
    },
    expired: {
      label: "Expiré",
      color: "bg-orange-100 text-orange-800",
      bgColor: "bg-orange-50",
      icon: <AlertCircle className="w-4 h-4" />,
      description: "Votre document a expiré. Veuillez télécharger un nouveau document.",
    },
  };

  return configs[status] || configs.pending;
};

const DocumentItem: React.FC<{ doc: DocumentStatus }> = ({ doc }) => {
  const statusConfig = getStatusConfig(doc.status);
  const uploadDate = new Date(doc.uploadedAt).toLocaleDateString("fr-FR");

  return (
    <div className={`p-4 rounded-lg border ${statusConfig.bgColor}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <FileText className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-gray-900">{getDocumentTypeLabel(doc.documentType)}</h4>
              <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">{doc.fileName}</p>
            <p className="text-xs text-gray-500">Téléchargé le {uploadDate}</p>

            {doc.expiresAt && (
              <p className="text-xs text-gray-500 mt-1">
                Expire le {new Date(doc.expiresAt).toLocaleDateString("fr-FR")}
              </p>
            )}

            {doc.verificationNotes && (
              <div className="mt-2 p-2 bg-white bg-opacity-50 rounded text-sm text-gray-700">
                <p className="font-medium text-gray-800">Notes :</p>
                <p>{doc.verificationNotes}</p>
              </div>
            )}
          </div>
        </div>
        <div className="text-2xl flex-shrink-0">{statusConfig.icon}</div>
      </div>
    </div>
  );
};

export const DocumentStatusCard: React.FC<DocumentStatusCardProps> = ({ documents, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statut de vos documents</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const pendingCount = documents.filter((d) => d.status === "pending").length;
  const verifiedCount = documents.filter((d) => d.status === "verified").length;
  const rejectedCount = documents.filter((d) => d.status === "rejected").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Statut de vos documents
        </CardTitle>
        <CardDescription>
          {verifiedCount} vérifié{verifiedCount !== 1 ? "s" : ""} • {pendingCount} en attente •{" "}
          {rejectedCount} rejeté{rejectedCount !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {documents.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Vous n'avez pas encore téléchargé de documents. Veuillez télécharger vos documents d'identité pour
              continuer.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {documents.map((doc) => (
              <DocumentItem key={doc.id} doc={doc} />
            ))}

            {rejectedCount > 0 && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Certains de vos documents ont été rejetés. Veuillez les remplacer pour continuer.
                </AlertDescription>
              </Alert>
            )}

            {pendingCount > 0 && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <Clock className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  {pendingCount} document{pendingCount !== 1 ? "s" : ""} en attente de vérification. Cela peut prendre
                  jusqu'à 48 heures.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
