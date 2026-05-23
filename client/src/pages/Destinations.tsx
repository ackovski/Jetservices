import { Card } from "@/components/ui/card";
import { Globe, Users, BookOpen, DollarSign } from "lucide-react";

export default function Destinations() {
  const destinations = [
    {
      name: "France",
      flag: "🇫🇷",
      description: "Excellence académique et rayonnement culturel mondialement reconnus.",
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
      {/* Header */}
      <section className="bg-gradient-to-br from-accent/10 via-white to-accent/5 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Nos Destinations
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Explorez les pays où JET Services vous accompagne pour réussir votre projet d'études.
          </p>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {destinations.map((dest, index) => (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Content */}
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="text-6xl mb-4">{dest.flag}</div>
                  <h2 className="text-4xl font-bold text-foreground mb-4">
                    {dest.name}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {dest.description}
                  </p>
                  <div className="mb-8">
                    <h3 className="font-semibold text-foreground mb-4">Pourquoi choisir {dest.name} ?</h3>
                    <ul className="space-y-2">
                      {dest.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-muted-foreground">
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Info Cards */}
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="grid grid-cols-2 gap-4">
                    {dest.info.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <Card key={idx} className="p-6 text-center">
                          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Icon size={24} className="text-accent" />
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{item.label}</p>
                          <p className="font-semibold text-foreground">{item.value}</p>
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
    </div>
  );
}
