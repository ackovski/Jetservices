import { Link } from "wouter";
import { Mail, Phone, MapPin, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold">
                JET
              </div>
              <span className="font-bold text-lg">JET Services</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Votre partenaire dévoué pour concrétiser votre rêve d'étudier à l'étranger.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <a className="text-muted-foreground hover:text-accent transition-colors">
                    Accueil
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <a className="text-muted-foreground hover:text-accent transition-colors">
                    Services
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/destinations">
                  <a className="text-muted-foreground hover:text-accent transition-colors">
                    Destinations
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-muted-foreground hover:text-accent transition-colors">
                    À Propos
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">Orientation</li>
              <li className="text-muted-foreground">Campus France</li>
              <li className="text-muted-foreground">Visa</li>
              <li className="text-muted-foreground">Logement</li>
              <li className="text-muted-foreground">Accueil Aéroport</li>
              <li className="text-muted-foreground">Job Étudiant</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone size={16} className="text-accent" />
                <a href="tel:+33745300413" className="hover:text-accent transition-colors">
                  +33 7 45 30 04 13
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail size={16} className="text-accent" />
                <a href="mailto:jetservices236@gmail.com" className="hover:text-accent transition-colors">
                  jetservices236@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={16} className="text-accent" />
                <span>Paris, France</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; 2026 JET Services. Tous droits réservés.
          </div>

          <div className="flex items-center gap-4">
            {/* Social Links */}
            <a
              href="https://www.facebook.com/share/1ZgWepTKHD/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
              title="Facebook"
            >
              <Facebook size={20} />
            </a>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-sm">
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                Mentions légales
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                CGV
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
