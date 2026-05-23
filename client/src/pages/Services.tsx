import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function Services() {
  const services = [
    {
      title: "Orientation et Choix de Formation",
      description: "Nous vous aidons à définir votre projet d'études et à choisir les établissements qui correspondent à vos aspirations.",
      benefits: [
        "Conseil personnalisé basé sur votre profil",
        "Exploration des filières et des établissements",
        "Aide à la prise de décision",
        "Gain de temps et réduction du stress",
      ],
    },
    {
      title: "Dossier Campus France",
      description: "Assistance complète pour la constitution et le suivi de votre dossier Campus France et vos candidatures universitaires.",
      benefits: [
        "Vérification de la conformité de votre dossier",
        "Aide à la rédaction des documents",
        "Suivi des délais et des étapes",
        "Optimisation de vos chances d'admission",
      ],
    },
    {
      title: "Obtention de Visa",
      description: "Conseils et accompagnement complets pour les démarches d'obtention de votre visa étudiant.",
      benefits: [
        "Explication des procédures",
        "Préparation des documents requis",
        "Soutien tout au long du processus",
        "Augmentation des chances de succès",
      ],
    },
    {
      title: "Logement et Hébergement",
      description: "Aide à la recherche et à la réservation de logements étudiants sécurisés et adaptés à votre budget.",
      benefits: [
        "Accès à un réseau de partenaires fiables",
        "Conseils sur les types de logement",
        "Assistance dans les négociations",
        "Tranquillité d'esprit garantie",
      ],
    },
    {
      title: "Accueil à l'Aéroport et Installation",
      description: "Prise en charge dès votre arrivée pour faciliter votre intégration et vos premières démarches.",
      benefits: [
        "Accueil personnalisé à l'aéroport",
        "Aide à l'ouverture d'un compte bancaire",
        "Assistance pour l'abonnement téléphonique",
        "Intégration facilitée dans votre nouveau pays",
      ],
    },
    {
      title: "Job Étudiant",
      description: "Conseils et ressources pour trouver un emploi étudiant dans votre pays d'accueil.",
      benefits: [
        "Conseils sur la recherche d'emploi",
        "Ressources et offres d'emploi",
        "Aide à la rédaction du CV",
        "Autonomie financière pendant vos études",
      ],
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-gradient-to-br from-accent/10 via-white to-accent/5 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Nos Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Un accompagnement complet et personnalisé pour chaque étape de votre projet d'études à l'étranger.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Bénéfices :</h4>
                  {service.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-28 bg-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">
              Pourquoi Choisir JET Services ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">Expertise Reconnue</h3>
                  <p className="text-muted-foreground">
                    Des années d'expérience dans l'accompagnement des étudiants internationaux.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">Accompagnement Personnalisé</h3>
                  <p className="text-muted-foreground">
                    Chaque projet est unique, nous adaptons nos services à vos besoins.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">Réseau de Partenaires</h3>
                  <p className="text-muted-foreground">
                    Accès à un réseau fiable d'universités et d'organismes partenaires.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">Taux de Réussite Élevé</h3>
                  <p className="text-muted-foreground">
                    La majorité de nos clients réalisent avec succès leur projet d'études.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
