import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowLeft, CheckCircle2, XCircle, Clock, FileText, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const verificationSchema = z.object({
  status: z.enum(["verified", "rejected"]),
  notes: z.string().min(5, "Les notes doivent contenir au moins 5 caractères"),
});

type VerificationFormValues = z.infer<typeof verificationSchema>;

interface DocumentWithUser {
  id: number;
  userId: number;
  documentType: string;
  fileName: string;
  status: string;
  uploadedAt: Date;
  fileUrl: string;
  userName?: string | null;
  userEmail?: string | null;
}

export default function AdminDocuments() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [selectedDocument, setSelectedDocument] = useState<DocumentWithUser | null>(null);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"verified" | "rejected" | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      status: "verified",
      notes: "",
    },
  });

  // Fetch pending documents
  const documentsQuery = trpc.identityDocuments.getPendingIdentityDocuments.useQuery();

  // Verify document mutation
  const verifyMutation = trpc.identityDocuments.verifyIdentityDocument.useMutation({
    onSuccess: () => {
      toast.success("Document vérifié avec succès !");
      setIsVerificationOpen(false);
      setIsConfirmOpen(false);
      setSelectedDocument(null);
      form.reset();
      documentsQuery.refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la vérification");
    },
  });

  const handleVerifyClick = (doc: DocumentWithUser) => {
    setSelectedDocument(doc);
    setIsVerificationOpen(true);
  };

  const onSubmit = (values: VerificationFormValues) => {
    setPendingAction(values.status);
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedDocument || !pendingAction) return;

    const formValues = form.getValues();
    verifyMutation.mutate({
      documentId: selectedDocument.id,
      status: pendingAction,
      notes: formValues.notes,
    });
  };

  if (!user || (user.role !== "admin" && user.role !== "conseiller")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Vous n'avez pas accès à cette page</p>
      </div>
    );
  }

  const documents = documentsQuery.data || [];
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; variant: any; icon: React.ReactNode }> = {
      pending: {
        label: "En attente",
        variant: "outline",
        icon: <Clock className="w-3 h-3" />,
      },
      verified: {
        label: "Vérifié",
        variant: "default",
        icon: <CheckCircle2 className="w-3 h-3" />,
      },
      rejected: {
        label: "Rejeté",
        variant: "destructive",
        icon: <XCircle className="w-3 h-3" />,
      },
    };

    const config = configs[status] || configs.pending;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/admin-dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Gestion des Documents</h1>
          <p className="text-muted-foreground mt-2">
            Vérifiez, approuvez ou rejetez les documents d'identité en attente
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Documents en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.filter((d) => d.status === "pending").length}</div>
              <p className="text-xs text-muted-foreground mt-1">À vérifier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Documents vérifiés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {documents.filter((d) => d.status === "verified").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Approuvés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Documents rejetés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {documents.filter((d) => d.status === "rejected").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Refusés</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Rechercher</label>
                <Input
                  placeholder="Nom de fichier ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Statut</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="verified">Vérifiés</SelectItem>
                    <SelectItem value="rejected">Rejetés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Table */}
        <Card>
          <CardHeader>
            <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
            <CardDescription>
              {filteredDocuments.length === 0
                ? "Aucun document trouvé"
                : `${filteredDocuments.length} document${filteredDocuments.length !== 1 ? "s" : ""}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {documentsQuery.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-muted-foreground">Aucun document à afficher</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Fichier</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          {getDocumentTypeLabel(doc.documentType)}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {doc.fileName}
                          </a>
                        </TableCell>
                        <TableCell>{doc.userEmail || "N/A"}</TableCell>
                        <TableCell>{new Date(doc.uploadedAt).toLocaleDateString("fr-FR")}</TableCell>
                        <TableCell>{getStatusBadge(doc.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerifyClick(doc)}
                            disabled={doc.status !== "pending"}
                          >
                            Vérifier
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Verification Dialog */}
      <Dialog open={isVerificationOpen} onOpenChange={setIsVerificationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vérifier le document</DialogTitle>
            <DialogDescription>
              Approuvez ou rejetez ce document avec des notes explicatives
            </DialogDescription>
          </DialogHeader>

          {selectedDocument && (
            <div className="space-y-6">
              {/* Document Preview */}
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-3">Aperçu du document</h3>
                <div className="flex items-center gap-4">
                  <FileText className="w-10 h-10 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">{selectedDocument.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      Type : {getDocumentTypeLabel(selectedDocument.documentType)}
                    </p>
                    <a
                      href={selectedDocument.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline mt-1 block"
                    >
                      Voir le fichier complet →
                    </a>
                  </div>
                </div>
              </div>

              {/* Student Info */}
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-3">Informations de l'étudiant</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Email :</span>{" "}
                    <span className="font-medium">{selectedDocument.userEmail}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">ID Utilisateur :</span>{" "}
                    <span className="font-medium">{selectedDocument.userId}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Date d'upload :</span>{" "}
                    <span className="font-medium">
                      {new Date(selectedDocument.uploadedAt).toLocaleString("fr-FR")}
                    </span>
                  </p>
                </div>
              </div>

              {/* Verification Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Décision</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="verified">✓ Approuver</SelectItem>
                            <SelectItem value="rejected">✗ Rejeter</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Expliquez votre décision (visible par l'étudiant)..."
                            className="resize-none"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsVerificationOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button type="submit" disabled={verifyMutation.isPending}>
                      {verifyMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        "Confirmer"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction === "verified" ? "Approuver le document ?" : "Rejeter le document ?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction === "verified"
                ? "Ce document sera marqué comme vérifié et l'étudiant sera notifié."
                : "Ce document sera rejeté et l'étudiant devra en télécharger un nouveau."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {pendingAction === "verified" ? "Approuver" : "Rejeter"}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
