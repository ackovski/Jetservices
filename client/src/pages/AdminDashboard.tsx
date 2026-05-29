import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Mail, Users, DollarSign, MessageSquare } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "conseiller" | "partenaire">("conseiller");
  const [studentSearch, setStudentSearch] = useState("");

  // Queries
  const studentsQuery = trpc.students.list.useQuery({ limit: 20 });
  const paymentsQuery = trpc.payments.list.useQuery({ limit: 20 });
  const invitationsQuery = trpc.invitations.list.useQuery({ limit: 20 });

  // Mutations
  const createInvitationMutation = trpc.invitations.create.useMutation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!user || !["super_admin", "admin"].includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Accès Refusé</h1>
          <p>Vous n'avez pas les permissions pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const handleInviteUser = async () => {
    if (!inviteEmail) return;
    try {
      await createInvitationMutation.mutateAsync({
        email: inviteEmail,
        role: inviteRole,
      });
      setInviteEmail("");
      invitationsQuery.refetch();
    } catch (error) {
      console.error("Failed to create invitation:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Admin</h1>
          <p className="text-gray-600 mt-2">Gérez les utilisateurs, les étudiants et les paiements</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Étudiants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentsQuery.data?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Paiements Reçus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {paymentsQuery.data?.filter((p: any) => p.status === "paid").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Invitations Envoyées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invitationsQuery.data?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Rôle</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge>{user.role === "super_admin" ? "Super Admin" : "Admin"}</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="students" className="space-y-4">
          <TabsList>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Étudiants
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Paiements
            </TabsTrigger>
            <TabsTrigger value="invitations" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Invitations
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Messages
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Étudiants</CardTitle>
                <CardDescription>Liste de tous les étudiants inscrits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Rechercher un étudiant..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                  />
                </div>

                {studentsQuery.isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : studentsQuery.data?.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">ID</th>
                          <th className="text-left py-2">Pays Cible</th>
                          <th className="text-left py-2">Niveau d'Études</th>
                          <th className="text-left py-2">Statut</th>
                          <th className="text-left py-2">Progression</th>
                          <th className="text-left py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentsQuery.data.map((student: any) => (
                          <tr key={student.id} className="border-b hover:bg-gray-50">
                            <td className="py-2">{student.id}</td>
                            <td className="py-2">{student.countryTarget}</td>
                            <td className="py-2">{student.studyLevel}</td>
                            <td className="py-2">
                              <Badge variant="outline">{student.status}</Badge>
                            </td>
                            <td className="py-2">{student.progressPercentage || 0}%</td>
                            <td className="py-2">
                              <Button variant="ghost" size="sm">
                                Voir Détails
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">Aucun étudiant trouvé</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Paiements</CardTitle>
                <CardDescription>Suivi des paiements et des transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentsQuery.isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : paymentsQuery.data?.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">ID</th>
                          <th className="text-left py-2">Montant</th>
                          <th className="text-left py-2">Statut</th>
                          <th className="text-left py-2">Méthode</th>
                          <th className="text-left py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentsQuery.data.map((payment: any) => (
                          <tr key={payment.id} className="border-b hover:bg-gray-50">
                            <td className="py-2">{payment.id}</td>
                            <td className="py-2">{(payment.amount / 100).toFixed(2)}€</td>
                            <td className="py-2">
                              <Badge
                                variant={payment.status === "paid" ? "default" : "outline"}
                              >
                                {payment.status}
                              </Badge>
                            </td>
                            <td className="py-2">{payment.paymentMethod}</td>
                            <td className="py-2">
                              <Button variant="ghost" size="sm">
                                Détails
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">Aucun paiement trouvé</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invitations Tab */}
          <TabsContent value="invitations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inviter un Utilisateur</CardTitle>
                <CardDescription>Créer une nouvelle invitation pour rejoindre l'équipe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="utilisateur@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Rôle</label>
                  <Select value={inviteRole} onValueChange={(value: any) => setInviteRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conseiller">Conseiller</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="partenaire">Partenaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleInviteUser}
                  disabled={!inviteEmail || createInvitationMutation.isPending}
                  className="w-full"
                >
                  {createInvitationMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Envoyer l'Invitation
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invitations Envoyées</CardTitle>
              </CardHeader>
              <CardContent>
                {invitationsQuery.isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : invitationsQuery.data?.length ? (
                  <div className="space-y-2">
                      {invitationsQuery.data.map((invitation: any) => (
                      <div
                        key={invitation.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{invitation.email}</p>
                          <p className="text-sm text-gray-500">Rôle: {invitation.role}</p>
                        </div>
                        <Badge variant={invitation.usedAt ? "secondary" : "default"}>
                          {invitation.usedAt ? "Utilisée" : "En attente"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">Aucune invitation</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Messagerie</CardTitle>
                <CardDescription>Gérez les messages et les communications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Section messagerie - À implémenter
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
