import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

const acceptInvitationSchema = z.object({
  name: z.string().min(2, "Le nom doit avoir au moins 2 caractères"),
  password: z.string().min(6, "Le mot de passe doit avoir au moins 6 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type AcceptInvitationFormValues = z.infer<typeof acceptInvitationSchema>;

export default function AcceptInvitation() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invitationData, setInvitationData] = useState<{
    email: string;
    role: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AcceptInvitationFormValues>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Get token from URL
  const token = new URLSearchParams(window.location.search).get("token");

  // Verify invitation query
  const verifyQuery = trpc.invitations.verify.useQuery(token || "", {
    enabled: !!token,
    retry: false,
  });

  // Accept invitation mutation
  const acceptMutation = trpc.invitations.accept.useMutation({
    onSuccess: () => {
      toast.success("Compte créé avec succès !");
      setIsSubmitting(false);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        setLocation("/login");
      }, 2000);
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la création du compte");
      setIsSubmitting(false);
    },
  });

  // Handle verification result
  useEffect(() => {
    if (verifyQuery.isSuccess && verifyQuery.data) {
      setInvitationData(verifyQuery.data);
      setIsLoading(false);
    }
  }, [verifyQuery.isSuccess, verifyQuery.data]);

  // Handle verification error
  useEffect(() => {
    if (verifyQuery.isError && verifyQuery.error) {
      setError((verifyQuery.error as any).message || "Invitation invalide ou expirée");
      setIsLoading(false);
    }
  }, [verifyQuery.isError, verifyQuery.error]);

  // Check if token is missing
  useEffect(() => {
    if (!token) {
      setError("Token d'invitation manquant");
      setIsLoading(false);
    }
  }, [token]);

  // Handle loading state
  useEffect(() => {
    if (verifyQuery.isLoading) {
      setIsLoading(true);
    }
  }, [verifyQuery.isLoading]);

  const onSubmit = async (values: AcceptInvitationFormValues) => {
    if (!token) {
      toast.error("Token d'invitation manquant");
      return;
    }

    setIsSubmitting(true);
    acceptMutation.mutate({
      token,
      name: values.name,
      password: values.password,
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-muted-foreground">Vérification de l'invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200">
          <CardContent className="pt-6">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={() => setLocation("/")} className="w-full">
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state after submission
  if (acceptMutation.isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-green-200">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-center mb-2">Compte Créé !</h2>
              <p className="text-muted-foreground text-center mb-6">
                Votre compte a été créé avec succès. Redirection vers la connexion...
              </p>
              <Button onClick={() => setLocation("/login")} className="w-full">
                Aller à la Connexion
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Form state
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Créer Votre Compte</CardTitle>
          <CardDescription>
            Complétez le formulaire pour activer votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Invitation Info */}
          {invitationData && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Email :</span> {invitationData.email}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="font-medium">Rôle :</span>
                <Badge variant="default">
                  {invitationData.role === "admin"
                    ? "Administrateur"
                    : invitationData.role === "conseiller"
                    ? "Conseiller"
                    : "Partenaire"}
                </Badge>
              </p>
            </div>
          )}

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom Complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Jean Dupont" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de Passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Minimum 6 caractères"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le Mot de Passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirmez votre mot de passe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création du compte...
                  </>
                ) : (
                  "Créer Mon Compte"
                )}
              </Button>
            </form>
          </Form>

          {/* Help Text */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            Cette invitation expire dans 7 jours. Si vous avez des questions, contactez l'administrateur.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
