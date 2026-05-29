import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function ConseillerDashboard() {
  const { user, loading } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [messageContent, setMessageContent] = useState("");

  // Queries
  const studentsQuery = trpc.students.list.useQuery({ consultantId: user?.id });
  const selectedStudentQuery = selectedStudent ? trpc.students.getById.useQuery(selectedStudent) : null;
  const messagesQuery = selectedStudent ? trpc.messaging.getMessages.useQuery({ otherUserId: selectedStudent }) : null;

  // Mutations
  const sendMessageMutation = trpc.messaging.send.useMutation();
  const updateTaskMutation = trpc.students.updateTaskStatus.useMutation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "conseiller") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Accès Refusé</h1>
          <p>Vous n'avez pas les permissions pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!messageContent || !selectedStudent) return;
    try {
      await sendMessageMutation.mutateAsync({
        receiverId: selectedStudent,
        content: messageContent,
      });
      setMessageContent("");
      messagesQuery?.refetch();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Conseiller</h1>
          <p className="text-gray-600 mt-2">Gérez vos étudiants assignés et suivez leur progression</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Students List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Mes Étudiants</CardTitle>
              <CardDescription>{studentsQuery.data?.length || 0} étudiants</CardDescription>
            </CardHeader>
            <CardContent>
              {studentsQuery.isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin" />
                </div>
              ) : studentsQuery.data?.length ? (
                <div className="space-y-2">
                  {studentsQuery.data?.map((student: any) => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudent(student.id)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition ${
                        selectedStudent === student.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="font-medium text-sm">Étudiant #{student.id}</p>
                      <p className="text-xs text-gray-600">{student.countryTarget}</p>
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          {student.progressPercentage || 0}%
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Aucun étudiant assigné</div>
              )}
            </CardContent>
          </Card>

          {/* Student Details */}
          <div className="lg:col-span-2 space-y-4">
            {selectedStudentQuery?.data ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Détails de l'Étudiant</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Pays Cible</p>
                        <p className="font-medium">{selectedStudentQuery.data.countryTarget}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Niveau d'Études</p>
                        <p className="font-medium">{selectedStudentQuery.data.studyLevel}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Statut</p>
                        <Badge className="mt-1">{selectedStudentQuery.data.status}</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Progression</p>
                        <p className="font-medium">{selectedStudentQuery.data.progressPercentage || 0}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Messaging */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto space-y-3">
                      {messagesQuery?.data?.map((msg: any) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.senderId === user.id ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs p-3 rounded-lg ${
                              msg.senderId === user.id
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {new Date(msg.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Textarea
                        placeholder="Écrivez votre message..."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        className="resize-none"
                        rows={3}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageContent || sendMessageMutation.isPending}
                        className="w-full"
                      >
                        {sendMessageMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Envoi...
                          </>
                        ) : (
                          "Envoyer"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-gray-500">
                    Sélectionnez un étudiant pour voir les détails
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
