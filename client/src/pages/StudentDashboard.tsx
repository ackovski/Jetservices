import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, FileText, MessageSquare, DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const [selectedDossier, setSelectedDossier] = useState<number | null>(null);

  // Queries
  const profileQuery = trpc.clientProfile.getProfile.useQuery();
  const dossiersQuery = trpc.dossiers.list.useQuery();
  const documentsQuery = selectedDossier ? trpc.documents.list.useQuery({ dossierId: selectedDossier }) : null;
  const messagesQuery = trpc.messaging.getConversations.useQuery();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "etudiant") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Accès Refusé</h1>
          <p>Vous n'avez pas les permissions pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "pending_review":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      not_started: "Non commencé",
      in_progress: "En cours",
      pending_review: "En attente de révision",
      completed: "Complété",
      rejected: "Rejeté",
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Tableau de Bord</h1>
          <p className="text-gray-600 mt-2">Suivez votre progression et vos dossiers</p>
        </div>

        {/* Profile Card */}
        {profileQuery.data && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Mon Profil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nom</p>
                  <p className="font-medium">{user.name || "Non renseigné"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pays Cible</p>
                  <p className="font-medium">{profileQuery.data.targetCountry || "Non renseigné"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Domaine d'Études</p>
                  <p className="font-medium">{profileQuery.data.targetField || "Non renseigné"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="dossiers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dossiers" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Mes Dossiers
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="paiements" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Paiements
            </TabsTrigger>
          </TabsList>

          {/* Dossiers Tab */}
          <TabsContent value="dossiers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Suivi de Mes Dossiers</CardTitle>
                <CardDescription>État d'avancement de vos services</CardDescription>
              </CardHeader>
              <CardContent>
                {dossiersQuery.isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : dossiersQuery.data?.length ? (
                  <div className="space-y-4">
                    {dossiersQuery.data.map((dossier) => (
                      <div
                        key={dossier.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition cursor-pointer"
                        onClick={() => setSelectedDossier(dossier.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{dossier.serviceType}</h3>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getStatusIcon(dossier.status)}
                            {getStatusLabel(dossier.status)}
                          </Badge>
                        </div>
                        <Progress value={50} className="mb-2" />
                        <p className="text-sm text-gray-600">50% complété</p>
                        {dossier.notes && (
                          <p className="text-sm text-gray-700 mt-2 italic">Note: {dossier.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">Aucun dossier trouvé</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mes Documents</CardTitle>
                <CardDescription>Fichiers téléchargés et documents requis</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDossier ? (
                  documentsQuery?.isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="animate-spin" />
                    </div>
                  ) : documentsQuery?.data?.length ? (
                    <div className="space-y-2">
                      {documentsQuery.data.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{doc.fileName}</p>
                            <p className="text-xs text-gray-500">
                              Téléchargé le {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            Télécharger
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">Aucun document pour ce dossier</div>
                  )
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Sélectionnez un dossier dans l'onglet "Mes Dossiers"
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mes Conversations</CardTitle>
                <CardDescription>Communiquez avec votre conseiller</CardDescription>
              </CardHeader>
              <CardContent>
                {messagesQuery?.isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : messagesQuery?.data?.length ? (
                  <div className="space-y-2">
                    {messagesQuery.data.map((conv) => (
                      <div key={conv.otherUserId} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <p className="font-medium text-sm">Conversation #{conv.otherUserId}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Dernier message: {new Date(conv.lastMessage.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">Aucune conversation</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paiements Tab */}
          <TabsContent value="paiements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mes Paiements</CardTitle>
                <CardDescription>Historique des transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Section paiements - À implémenter
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
