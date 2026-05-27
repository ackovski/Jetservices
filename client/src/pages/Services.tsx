import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function Services() {
  const services = [
    {
      title: "Orientation et Choix de Formation",
      description: "Nous vous aidons à définir votre projet d'études et à choisir les établissements qui correspondent à vos aspirations.",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663690468905/FkJrRLekpBwD5c4mPbGGHA/service-orientation-mReGyfF5gmN9SKWu2ZS3B4.webp",
      color: "from-blue-500 to-blue-600",
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
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663690468905/FkJrRLekpBwD5c4mPbGGHA/service-campus-france-Gw2nRGoNSY69oQUMuQkEqf.webp",
      color: "from-amber-500 to-amber-600",
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
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663690468905/FkJrRLekpBwD5c4mPbGGHA/service-visa-S8n3uGQEVrgWgJQNvRQtEx.webp",
      color: "from-teal-500 to-teal-600",
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
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663690468905/FkJrRLekpBwD5c4mPbGGHA/service-logement-Bxneej6fkaBawTXmvUuvbg.webp",
      color: "from-orange-500 to-orange-600",
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
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663690468905/FkJrRLekpBwD5c4mPbGGHA/service-accueil-9Z25JmCSmY7Ynhuat6Wcge.webp",
      color: "from-indigo-500 to-indigo-600",
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
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663690468905/FkJrRLekpBwD5c4mPbGGHA/service-job-XyCNBHgZnAkxBBY2yHQTWx.webp",
      color: "from-purple-500 to-purple-600",
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Nos Services Complets
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Un accompagnement personnalisé à chaque étape de votre projet d'études à l'international
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-20`}></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                    {service.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-slate-900 text-sm">Bénéfices :</h4>
                    {service.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Color Accent */}
                  <div className={`h-1 bg-gradient-to-r ${service.color} rounded-full`}></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Pourquoi Nous Choisir ?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              JET Services offre une expertise reconnue et un accompagnement personnalisé
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Expertise Reconnue",
                description: "Des années d'expérience dans l'accompagnement des étudiants internationaux.",
                icon: "🎓",
              },
              {
                title: "Accompagnement Personnalisé",
                description: "Chaque projet est unique, nous adaptons nos services à vos besoins.",
                icon: "👥",
              },
              {
                title: "Réseau de Partenaires",
                description: "Accès à un réseau fiable d'universités et d'organismes partenaires.",
                icon: "🌐",
              },
              {
                title: "Taux de Réussite Élevé",
                description: "La majorité de nos clients réalisent avec succès leur projet d'études.",
                icon: "✅",
              },
            ].map((item, idx) => (
              <Card key={idx} className="p-8 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à Commencer ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Contactez-nous pour une consultation gratuite et découvrez comment nous pouvons vous aider à réaliser votre rêve.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="font-semibold">
              Demander une Consultation
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
