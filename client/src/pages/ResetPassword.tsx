import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLocation, useRoute } from "wouter";
import { Loader2 } from "lucide-react";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Le mot de passe doit avoir au moins 6 caractères"),
  confirmPassword: z.string().min(6, "La confirmation doit avoir au moins 6 caractères"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/reset-password/:token");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  const token = params?.token || "";

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Verify token on mount
  const verifyTokenQuery = trpc.passwordReset.verifyToken.useQuery(
    { token },
    {
      enabled: !!token,
    }
  );

  // Handle verification result
  useEffect(() => {
    if (verifyTokenQuery.data) {
      setTokenValid(verifyTokenQuery.data.valid);
      setIsVerifying(false);
    }
  }, [verifyTokenQuery.data]);

  // Handle verification error
  useEffect(() => {
    if (verifyTokenQuery.error) {
      console.error("Token verification failed:", verifyTokenQuery.error);
      setTokenValid(false);
      toast.error("Lien de réinitialisation invalide ou expiré");
      setIsVerifying(false);
    }
  }, [verifyTokenQuery.error]);

  // Set initial verifying state
  useEffect(() => {
    if (!token) {
      setIsVerifying(false);
    }
  }, [token]);

  const resetMutation = trpc.passwordReset.resetPassword.useMutation({
    onSuccess: () => {
      toast.success("Mot de passe réinitialisé avec succès !");
      setTimeout(() => {
        setLocation("/login");
      }, 1500);
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la réinitialisation");
      setIsLoading(false);
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);
    resetMutation.mutate({
      token,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    });
  };

  if (isVerifying || verifyTokenQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-gray-600">Vérification du lien...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl">Lien Expiré</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">Ce lien de réinitialisation est invalide ou expiré.</p>
              <p className="text-red-700 text-sm mt-2">
                Les liens de réinitialisation expirent après 24 heures.
              </p>
            </div>
            <Button
              onClick={() => setLocation("/forgot-password")}
              className="w-full"
            >
              Demander un Nouveau Lien
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">Créer un Nouveau Mot de Passe</CardTitle>
          <CardDescription>
            Entrez votre nouveau mot de passe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nouveau Mot de Passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Au moins 6 caractères"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Réinitialisation en cours...
                  </>
                ) : (
                  "Réinitialiser le Mot de Passe"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
