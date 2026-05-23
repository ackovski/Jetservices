import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe, Plane, FileText, Home as HomeIcon, Users, Briefcase, ArrowRight } from "lucide-react";

export default function Home() {
  const services = [
    {
      icon: Globe,
      title: "Orientation",
      description: "Aide à la définition de votre projet d'études et choix des établissements.",
    },
    {
      icon: FileText,
      title: "Dossier Campus France",
      description: "Assistance complète pour la constitution et le suivi de votre dossier.",
    },
    {
      icon: Plane,
      title: "Visa",
      description: "Conseils et accompagnement pour l'obtention de votre visa étudiant.",
    },
    {
      icon: HomeIcon,
      title: "Logement",
      description: "Aide à la recherche et réservation de logements étudiants.",
    },
    {
      icon: Users,
      title: "Accueil Aéroport",
      description: "Prise en charge dès votre arrivée et aide aux premières démarches.",
    },
    {
      icon: Briefcase,
      title: "Job Étudiant",
      description: "Conseils et ressources pour trouver un emploi étudiant.",
    },
  ];

  const destinations = [
    { name: "France", flag: "🇫🇷", description: "Excellence académique et culture" },
    { name: "Canada", flag: "🇨🇦", description: "Opportunités et qualité de vie" },
    { name: "Maroc", flag: "🇲🇦", description: "Proximité et accessibilité" },
    { name: "Tunisie", flag: "🇹🇳", description: "Enseignement de qualité" },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-accent/10 via-white to-accent/5 py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Concrétisez votre rêve d'étudier à l'étranger
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              JET Services est votre partenaire dévoué pour une expérience éducative internationale réussie. Nous vous accompagnons à chaque étape de votre projet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services">
                <a>
                  <Button size="lg" className="w-full sm:w-auto">
                    Découvrir nos services
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </a>
              </Link>
              <Link href="/contact">
                <a>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Nous contacter
                  </Button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nos Services Clés
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Un accompagnement complet pour réussir votre projet d'études à l'international
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon size={24} className="text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <a>
                <Button variant="outline" size="lg">
                  Voir tous les services
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-20 md:py-28 bg-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nos Destinations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explorez les pays où nous accompagnons les étudiants
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{dest.flag}</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {dest.name}
                </h3>
                <p className="text-muted-foreground">
                  {dest.description}
                </p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/destinations">
              <a>
                <Button variant="outline" size="lg">
                  En savoir plus sur les destinations
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-accent to-accent/80 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à commencer votre aventure ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Contactez-nous dès aujourd'hui pour une consultation gratuite et découvrez comment nous pouvons vous aider.
          </p>
          <Link href="/contact">
            <a>
              <Button size="lg" variant="secondary">
                Demander une consultation
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
}
