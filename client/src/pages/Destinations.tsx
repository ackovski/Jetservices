import { Card } from "@/components/ui/card";
import { Globe, Users, BookOpen, DollarSign } from "lucide-react";

export default function Destinations() {
  const destinations = [
    {
      name: "France",
      flag: "🇫🇷",
      description: "Excellence académique et rayonnement culturel mondialement reconnus.",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663690468905/FkJrRLekpBwD5c4mPbGGHA/destination-france-X5d33ynpiP9o3exk6diUMW.webp",
      color: "from-blue-600 to-blue-700",
      highlights: [
        "Universités de renommée mondiale",
        "Système d'enseignement supérieur de qualité",
        "Vie culturelle riche et dynamique",
        "Réseau d'alumni influents",
      ],
      info: [
        { icon: BookOpen, label: "Domaines d'études", value: "Tous les domaines" },
        { icon: Users, label: "Étudiants internationaux", value: "Très accueillante" },
        { icon: Globe, label: "Langue", value: "Français" },
        { icon: DollarSign, label: "Coût de la vie", value: "Modéré" },
      ],
    },
    {
      name: "Canada",
      flag: "🇨🇦",
      description: "Opportunités d'études et de carrière exceptionnelles avec qualité de vie supérieure.",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663690468905/FkJrRLekpBwD5c4mPbGGHA/destination-canada-Yw5cLrJCkKe67acmMXeFLU.webp",
      color: "from-red-600 to-red-700",
      highlights: [
        "Universités classées mondialement",
        "Environnement multiculturel",
        "Opportunités de travail pendant et après les études",
        "Qualité de vie exceptionnelle",
      ],
      info: [
        { icon: BookOpen, label: "Domaines d'études", value: "Tous les domaines" },
        { icon: Users, label: "Étudiants internationaux", value: "Très accueillante" },
        { icon: Globe, label: "Langue", value: "Anglais/Français" },
        { icon: DollarSign, label: "Coût de la vie", value: "Élevé" },
      ],
    },
    {
      name: "Maroc",
      flag: "🇲🇦",
      description: "Proximité géographique et culturelle avec enseignement de qualité.",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663690468905/FkJrRLekpBwD5c4mPbGGHA/destination-maroc-6TrsofRWcbwdhmoMYL3htZ.webp",
      color: "from-amber-600 to-amber-700",
      highlights: [
        "Proximité avec la France et l'Europe",
        "Universités en développement",
        "Coût de la vie accessible",
        "Environnement culturel riche",
      ],
      info: [
        { icon: BookOpen, label: "Domaines d'études", value: "Principaux domaines" },
        { icon: Users, label: "Étudiants internationaux", value: "Accueillante" },
        { icon: Globe, label: "Langue", value: "Arabe/Français" },
        { icon: DollarSign, label: "Coût de la vie", value: "Très accessible" },
      ],
    },
    {
      name: "Tunisie",
      flag: "🇹🇳",
      description: "Enseignement de qualité dans un environnement méditerranéen accueillant.",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663690468905/FkJrRLekpBwD5c4mPbGGHA/destination-tunisie-JWJfonDzaKXEmSEyWMk2YT.webp",
      color: "from-cyan-600 to-cyan-700",
      highlights: [
        "Universités reconnues",
        "Accessibilité financière",
        "Patrimoine historique et culturel",
        "Communauté étudiante dynamique",
      ],
      info: [
        { icon: BookOpen, label: "Domaines d'études", value: "Principaux domaines" },
        { icon: Users, label: "Étudiants internationaux", value: "Accueillante" },
        { icon: Globe, label: "Langue", value: "Arabe/Français" },
        { icon: DollarSign, label: "Coût de la vie", value: "Très accessible" },
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
              Nos Destinations
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Explorez les pays où JET Services vous accompagne pour réussir votre projet d'études.
            </p>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {destinations.map((dest, index) => (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Image */}
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${dest.color} opacity-20`}></div>
                  </div>
                </div>

                {/* Content */}
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="text-6xl mb-4">{dest.flag}</div>
                  <h2 className="text-4xl font-bold text-slate-900 mb-4">
                    {dest.name}
                  </h2>
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    {dest.description}
                  </p>

                  {/* Highlights */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-slate-900 mb-4 text-lg">
                      Pourquoi choisir {dest.name} ?
                    </h3>
                    <ul className="space-y-3">
                      {dest.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-slate-700">
                          <div className={`w-2 h-2 bg-gradient-to-r ${dest.color} rounded-full`}></div>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Info Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    {dest.info.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <Card key={idx} className="p-4 text-center hover:shadow-lg transition-shadow">
                          <div className={`w-10 h-10 bg-gradient-to-br ${dest.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                            <Icon size={20} className="text-white" />
                          </div>
                          <p className="text-xs text-slate-600 mb-1">{item.label}</p>
                          <p className="font-semibold text-slate-900 text-sm">{item.value}</p>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-slate-100 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Quelle destination vous attire ?
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Contactez-nous pour discuter de votre destination idéale et commencer votre aventure.
          </p>
        </div>
      </section>
    </div>
  );
}
