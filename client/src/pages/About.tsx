import { Card } from "@/components/ui/card";
import { Heart, Target, Users, Zap } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Passion",
      description: "Nous sommes passionnés par l'éducation et le développement personnel de nos clients.",
    },
    {
      icon: Target,
      title: "Excellence",
      description: "Nous visons l'excellence dans chaque aspect de notre accompagnement.",
    },
    {
      icon: Users,
      title: "Confiance",
      description: "Nous construisons des relations de confiance durables avec nos clients.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Nous innovons constamment pour offrir les meilleurs services.",
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-gradient-to-br from-accent/10 via-white to-accent/5 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            À Propos de JET Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Découvrez notre mission, nos valeurs et notre engagement envers vos rêves d'études.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-6 text-center">
              Notre Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed text-center mb-8">
              JET Services est votre partenaire dévoué pour concrétiser votre rêve d'étudier à l'étranger. Nous nous engageons à fournir un accompagnement complet, personnalisé et de qualité à chaque étape de votre projet d'études internationales.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed text-center">
              Notre objectif est de simplifier vos démarches, de réduire votre stress et de maximiser vos chances de succès, tout en vous offrant une expérience enrichissante et mémorable.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-28 bg-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">
            Nos Valeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon size={32} className="text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">1200+</div>
              <p className="text-lg text-muted-foreground">Étudiants accompagnés</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">95%</div>
              <p className="text-lg text-muted-foreground">Taux de satisfaction</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">4</div>
              <p className="text-lg text-muted-foreground">Pays couverts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-28 bg-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">
            Notre Équipe
          </h2>
          <div className="max-w-3xl mx-auto">
            <Card className="p-12 text-center">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Notre équipe est composée de professionnels expérimentés et passionnés par l'éducation internationale. Nous travaillons ensemble pour offrir le meilleur accompagnement à nos clients et nous nous engageons à rester à l'écoute de vos besoins.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
