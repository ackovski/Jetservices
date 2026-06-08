import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2, ArrowLeft, Upload } from "lucide-react";
import { useLocation } from "wouter";
import { DocumentStatusCard } from "@/components/DocumentStatusCard";

const profileSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit avoir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit avoir au moins 2 caractères"),
  phone: z.string().min(10, "Le téléphone doit avoir au moins 10 chiffres"),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  targetCountry: z.string().optional(),
  targetField: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function DocumentsSection() {
  const documentsQuery = trpc.identityDocuments.getMyIdentityDocuments.useQuery();
  const [isUploading, setIsUploading] = useState(false);

  const uploadMutation = trpc.identityDocuments.uploadIdentity.useMutation({
    onSuccess: () => {
      toast.success("Document téléchargé avec succès !");
      setIsUploading(false);
      documentsQuery.refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors du téléchargement");
      setIsUploading(false);
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Le fichier dépasse 10MB");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadMutation.mutate({
        documentType: "passport",
        fileName: file.name,
        fileData: base64,
        mimeType: file.type,
      });
    };

    reader.readAsDataURL(file);
  };

  const documents = documentsQuery.data || [];

  return (
    <div className="space-y-6">
      <DocumentStatusCard documents={documents} isLoading={documentsQuery.isLoading} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Télécharger un Nouveau Document
          </CardTitle>
          <CardDescription>
            Téléchargez vos documents d'identité pour compléter votre profil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition cursor-pointer">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground font-medium">
                  {isUploading ? "Téléchargement en cours..." : "Cliquez pour sélectionner un fichier"}
                </p>
                <p className="text-xs text-muted-foreground">JPG, PNG ou PDF (max 10MB)</p>
              </div>
            </label>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all animate-pulse" style={{ width: "100%" }} />
              </div>
              <p className="text-sm text-muted-foreground text-center">Téléchargement en cours...</p>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Documents acceptés :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Passeport</li>
              <li>Carte d'identité nationale</li>
              <li>Permis de conduire</li>
              <li>Acte de naissance</li>
              <li>Titre de séjour</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function StudentProfile() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      dateOfBirth: "",
      nationality: "",
      targetCountry: "",
      targetField: "",
    },
  });

  // Fetch current profile
  const profileQuery = trpc.clientProfile.getProfile.useQuery();

  // Update profile mutation
  const updateMutation = trpc.clientProfile.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profil mis à jour avec succès !");
      setIsLoading(false);
      profileQuery.refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la mise à jour");
      setIsLoading(false);
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true);
    updateMutation.mutate(values);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Veuillez vous connecter</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => setLocation("/student-dashboard")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Mon Profil</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>

        <Tabs defaultValue="personal" className="max-w-4xl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Infos Personnelles</TabsTrigger>
            <TabsTrigger value="studies">Études</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Informations Personnelles</CardTitle>
                <CardDescription>Mettez à jour vos informations de base</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                              <Input placeholder="Jean" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Dupont" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="+33 7 12 34 56 78" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date de Naissance</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nationality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nationalité</FormLabel>
                            <FormControl>
                              <Input placeholder="Française" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Mise à jour en cours...
                        </>
                      ) : (
                        "Enregistrer les Modifications"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Studies Tab */}
          <TabsContent value="studies">
            <Card>
              <CardHeader>
                <CardTitle>Informations d'Études</CardTitle>
                <CardDescription>Mettez à jour vos préférences d'études</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="targetCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pays de Destination</FormLabel>
                            <FormControl>
                              <Input placeholder="France" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="targetField"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Domaine d'Études</FormLabel>
                            <FormControl>
                              <Input placeholder="Informatique" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Mise à jour en cours...
                        </>
                      ) : (
                        "Enregistrer les Modifications"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <DocumentsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
