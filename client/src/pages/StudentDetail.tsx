import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Save, Upload } from "lucide-react";
import { useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";

export default function StudentDetail() {
  const { user, loading } = useAuth();
  const [, params] = useRoute("/student/:id");
  const studentId = params?.id ? parseInt(params.id) : null;

  const [formData, setFormData] = useState({
    countryTarget: "",
    studyLevel: "",
    status: "active",
  });

  // Queries
  const studentQuery = studentId ? trpc.students.getById.useQuery(studentId) : null;
  const tasksQuery = studentId ? trpc.students.getTasks.useQuery(studentId) : null;
  const documentsQuery = studentId ? trpc.documents.list.useQuery({ dossierId: studentId }) : null;

  // Mutations
  const updateStudentMutation = trpc.students.update.useMutation();
  const createTaskMutation = trpc.students.createTask.useMutation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!user || !["admin", "conseiller", "super_admin"].includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Accès Refusé</h1>
        </div>
      </div>
    );
  }

  const handleSaveStudent = async () => {
    if (!studentId) return;
    try {
      await updateStudentMutation.mutateAsync({
        id: studentId,
        ...formData,
      });
      studentQuery?.refetch();
    } catch (error) {
      console.error("Failed to update student:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Détail Étudiant #{studentId}</h1>
        </div>

        {studentQuery?.data ? (
          <Tabs defaultValue="info" className="space-y-4">
            <TabsList>
              <TabsTrigger value="info">Informations</TabsTrigger>
              <TabsTrigger value="dossiers">Dossiers</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="taches">Tâches</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            {/* Informations Tab */}
            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informations Personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Pays Cible</label>
                      <Input
                        value={formData.countryTarget}
                        onChange={(e) =>
                          setFormData({ ...formData, countryTarget: e.target.value })
                        }
                        placeholder="France, Canada, Maroc..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Niveau d'Études</label>
                      <Input
                        value={formData.studyLevel}
                        onChange={(e) =>
                          setFormData({ ...formData, studyLevel: e.target.value })
                        }
                        placeholder="Licence, Master..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Statut</label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Actif</SelectItem>
                          <SelectItem value="inactive">Inactif</SelectItem>
                          <SelectItem value="blocked">Bloqué</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveStudent}
                    disabled={updateStudentMutation.isPending}
                    className="w-full"
                  >
                    {updateStudentMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dossiers Tab */}
            <TabsContent value="dossiers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dossiers de l'Étudiant</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    Gestion des dossiers - À implémenter
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Glissez-déposez des fichiers ou cliquez pour télécharger
                    </p>
                  </div>

                  {documentsQuery?.data?.length ? (
                    <div className="space-y-2 mt-4">
                      {documentsQuery.data.map((doc: any) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-sm">{doc.fileName}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            Télécharger
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 text-sm mt-4">
                      Aucun document
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tâches Tab */}
            <TabsContent value="taches" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tâches Assignées</CardTitle>
                </CardHeader>
                <CardContent>
                  {tasksQuery?.data?.length ? (
                    <div className="space-y-2">
                      {tasksQuery.data.map((task: any) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-sm">{task.title}</p>
                            <p className="text-xs text-gray-600">{task.description}</p>
                          </div>
                          <Badge variant="outline">{task.status}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 text-sm">
                      Aucune tâche assignée
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notes Internes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Ajoutez des notes internes sur cet étudiant..."
                    className="resize-none"
                    rows={6}
                  />
                  <Button className="mt-4">Sauvegarder les Notes</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : studentQuery?.isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-gray-500">Étudiant non trouvé</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
