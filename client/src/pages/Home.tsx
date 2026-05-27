import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe, Plane, FileText, Home as HomeIcon, Users, Briefcase, ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
  const services = [
    {
      icon: Globe,
      title: "Orientation",
      description: "Aide à la définition de votre projet d'études et choix des établissements.",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663690468905/FkJrRLekpBwD5c4mPbGGHA/service-orientation-mReGyfF5gmN9SKWu2ZS3B4.webp",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: FileText,
      title: "Dossier Campus France",
      description: "Assistance complète pour la constitution et le suivi de votre dossier.",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663690468905/FkJrRLekpBwD5c4mPbGGHA/service-campus-france-Gw2nRGoNSY69oQUMuQkEqf.webp",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: Plane,
      title: "Visa",
      description: "Conseils et accompagnement pour l'obtention de votre visa étudiant.",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663690468905/FkJrRLekpBwD5c4mPbGGHA/service-visa-S8n3uGQEVrgWgJQNvRQtEx.webp",
      color: "from-teal-500 to-teal-600",
    },
    {
      icon: HomeIcon,
      title: "Logement",
      description: "Aide à la recherche et réservation de logements étudiants.",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663690468905/FkJrRLekpBwD5c4mPbGGHA/service-logement-Bxneej6fkaBawTXmvUuvbg.webp",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: Users,
      title: "Accueil Aéroport",
      description: "Prise en charge dès votre arrivée et aide aux premières démarches.",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663690468905/FkJrRLekpBwD5c4mPbGGHA/service-accueil-9Z25JmCSmY7Ynhuat6Wcge.webp",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: Briefcase,
      title: "Job Étudiant",
      description: "Conseils et ressources pour trouver un emploi étudiant.",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663690468905/FkJrRLekpBwD5c4mPbGGHA/service-job-XyCNBHgZnAkxBBY2yHQTWx.webp",
      color: "from-purple-500 to-purple-600",
    },
  ];

  const destinations = [
    {
      name: "France",
      flag: "🇫🇷",
      description: "Excellence académique et culture",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663690468905/FkJrRLekpBwD5c4mPbGGHA/destination-france-X5d33ynpiP9o3exk6diUMW.webp",
      color: "from-blue-600 to-blue-700",
    },
    {
      name: "Canada",
      flag: "🇨🇦",
      description: "Opportunités et qualité de vie",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663690468905/FkJrRLekpBwD5c4mPbGGHA/destination-canada-Yw5cLrJCkKe67acmMXeFLU.webp",
      color: "from-red-600 to-red-700",
    },
    {
      name: "Maroc",
      flag: "🇲🇦",
      description: "Proximité et accessibilité",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663690468905/FkJrRLekpBwD5c4mPbGGHA/destination-maroc-6TrsofRWcbwdhmoMYL3htZ.webp",
      color: "from-amber-600 to-amber-700",
    },
    {
      name: "Tunisie",
      flag: "🇹🇳",
      description: "Enseignement de qualité",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663690468905/FkJrRLekpBwD5c4mPbGGHA/destination-tunisie-JWJfonDzaKXEmSEyWMk2YT.webp",
      color: "from-cyan-600 to-cyan-700",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center text-white py-24 md:py-40 overflow-hidden" style={{
        backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663690468905/FkJrRLekpBwD5c4mPbGGHA/hero-home-g34iqmaFN88yv3iHWHitKe.webp)',
        backgroundAttachment: 'fixed'
      }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
              Concrétisez votre rêve d'étudier à l'étranger
            </h1>
            <p className="text-lg md:text-2xl text-white/95 mb-10 leading-relaxed drop-shadow-md">
              JET Services est votre partenaire dévoué pour une expérience éducative internationale réussie. Nous vous accompagnons à chaque étape de votre projet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Découvrir nos services
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 font-semibold">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Nos Services Clés
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Un accompagnement complet pour réussir votre projet d'études à l'international
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden bg-slate-100">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-20`}></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      {service.description}
                    </p>
                    <div className={`h-1 bg-gradient-to-r ${service.color} rounded-full mt-4`}></div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-16">
            <Link href="/services">
              <Button variant="outline" size="lg" className="font-semibold">
                Voir tous les services
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Nos Destinations
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Explorez les pays où nous accompagnons les étudiants
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, index) => (
              <Link key={index} href="/destinations">
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group h-full">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${dest.color} opacity-30`}></div>
                  </div>

                  {/* Content */}
                  <div className="p-6 text-center">
                    <div className="text-5xl mb-3">{dest.flag}</div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {dest.name}
                    </h3>
                    <p className="text-slate-600 text-sm">
                      {dest.description}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/destinations">
              <Button variant="outline" size="lg" className="font-semibold">
                En savoir plus sur les destinations
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Pourquoi Choisir JET Services ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              <Card key={idx} className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Prêt à commencer votre aventure ?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Contactez-nous dès aujourd'hui pour une consultation gratuite et découvrez comment nous pouvons vous aider à réaliser votre rêve.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="font-semibold">
              Demander une consultation
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
