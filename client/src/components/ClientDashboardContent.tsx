import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const statusConfig = {
  not_started: { label: "Non commencé", color: "bg-gray-100", textColor: "text-gray-700", icon: AlertCircle },
  in_progress: { label: "En cours", color: "bg-blue-100", textColor: "text-blue-700", icon: Clock },
  pending_review: { label: "En attente de révision", color: "bg-yellow-100", textColor: "text-yellow-700", icon: Clock },
  completed: { label: "Complété", color: "bg-green-100", textColor: "text-green-700", icon: CheckCircle },
  rejected: { label: "Rejeté", color: "bg-red-100", textColor: "text-red-700", icon: AlertCircle },
};

export default function ClientDashboardContent() {
  const [selectedDossier, setSelectedDossier] = useState<number | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const { data: profile, isLoading: profileLoading } = trpc.clientProfile.getProfile.useQuery();
  const { data: dossiers, isLoading: dossiersLoading, refetch: refetchDossiers } = trpc.dossiers.list.useQuery();
  const { data: documents, isLoading: documentsLoading } = trpc.documents.list.useQuery(
    { dossierId: selectedDossier || 0 },
    { enabled: selectedDossier !== null }
  );

  const updateStatusMutation = trpc.dossiers.updateStatus.useMutation();
  const uploadDocumentMutation = trpc.documents.upload.useMutation();

  const handleStatusChange = async (dossierId: number, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        dossierId,
        status: newStatus as any,
      });
      toast.success("Statut mis à jour avec succès");
      refetchDossiers();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedDossier || !e.target.files?.[0]) return;

    const file = e.target.files[0];
    setIsUploadingFile(true);

    try {
      // In a real scenario, you would upload the file to S3 first
      // For now, we'll simulate the upload
      await uploadDocumentMutation.mutateAsync({
        dossierId: selectedDossier,
        fileName: file.name,
        fileKey: `documents/${selectedDossier}/${file.name}`,
        fileUrl: `/manus-storage/documents/${selectedDossier}/${file.name}`,
        fileType: file.type,
        fileSize: file.size,
      });
      toast.success("Document téléversé avec succès");
      e.target.value = "";
    } catch (error) {
      toast.error("Erreur lors du téléversement du document");
    } finally {
      setIsUploadingFile(false);
    }
  };

  if (profileLoading || dossiersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      {profile && (
        <Card className="p-6 bg-accent/5">
          <h2 className="text-2xl font-bold text-foreground mb-4">Bienvenue, {profile.firstName || "Étudiant"} !</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Destination cible</p>
              <p className="font-semibold text-foreground">{profile.targetCountry || "Non définie"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Domaine d'études</p>
              <p className="font-semibold text-foreground">{profile.targetField || "Non défini"}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Dossiers Section */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Suivi de vos Dossiers</h2>
        
        {!dossiers || dossiers.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Aucun dossier pour le moment. Contactez-nous pour commencer votre projet.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {dossiers.map((dossier) => {
              const config = statusConfig[dossier.status as keyof typeof statusConfig] || statusConfig.not_started;
              const StatusIcon = config.icon;
              
              return (
                <Card
                  key={dossier.id}
                  className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedDossier(dossier.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{dossier.serviceType}</h3>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                        <span className={`text-sm font-medium ${config.textColor}`}>{config.label}</span>
                      </div>
                      {dossier.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{dossier.notes || ""}</p>
                      )}
                    </div>
                    <StatusIcon size={24} className={`${config.textColor} ml-4`} />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Documents Section */}
      {selectedDossier && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Documents du Dossier</h2>
          
          <Tabs defaultValue="documents" className="space-y-6">
            <TabsList>
              <TabsTrigger value="documents">Mes Documents</TabsTrigger>
              <TabsTrigger value="upload">Téléverser un Document</TabsTrigger>
            </TabsList>

            <TabsContent value="documents">
              {!documents || documents.length === 0 ? (
                <Card className="p-8 text-center">
                  <FileText size={32} className="text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Aucun document pour le moment</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <Card key={doc.id} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-accent" />
                        <div>
                          <p className="font-medium text-foreground">{doc.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            Téléversé le {new Date(doc.uploadedAt).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                      <a
                        href={doc.fileUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline text-sm font-medium"
                      >
                        Télécharger
                      </a>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="upload">
              <Card className="p-8">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload size={32} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-2">Téléversez un document</p>
                  <p className="text-sm text-muted-foreground mb-4">Glissez-déposez votre fichier ou cliquez pour parcourir</p>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={isUploadingFile}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button
                      disabled={isUploadingFile}
                      className="cursor-pointer"
                    >
                      {isUploadingFile ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />
                          Téléversement...
                        </>
                      ) : (
                        "Sélectionner un fichier"
                      )}
                    </Button>
                  </label>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
