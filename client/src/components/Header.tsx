import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return null;
    switch (user.role) {
      case "super_admin":
      case "admin":
        return { href: "/admin-dashboard", label: "Dashboard Admin" };
      case "conseiller":
        return { href: "/conseiller-dashboard", label: "Mes Étudiants" };
      case "etudiant":
        return { href: "/student-dashboard", label: "Mon Tableau de Bord" };
      default:
        return { href: "/dashboard", label: "Mon Espace" };
    }
  };

  const dashboardLink = getDashboardLink();

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/services", label: "Services" },
    { href: "/destinations", label: "Destinations" },
    { href: "/about", label: "À Propos" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2 font-bold text-xl text-accent hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold">
                JET
              </div>
              <span className="hidden sm:inline">JET Services</span>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a className="text-foreground hover:text-accent transition-colors font-medium">
                  {link.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && dashboardLink ? (
              <>
                <Link href={dashboardLink.href}>
                  <a className="text-foreground hover:text-accent transition-colors font-medium">
                    {dashboardLink.label}
                  </a>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logout()}
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.location.href = "/signup";
                  }}
                >
                  S'inscrire
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    window.location.href = getLoginUrl();
                  }}
                >
                  Connexion
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 space-y-2 border-t border-border">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              </Link>
            ))}
            <div className="px-4 py-2 space-y-2 border-t border-border pt-4">
              {isAuthenticated && dashboardLink ? (
                <>
                  <Link href={dashboardLink.href}>
                    <a
                      className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {dashboardLink.label}
                    </a>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      window.location.href = "/signup";
                      setIsOpen(false);
                    }}
                  >
                    S'inscrire
                  </Button>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      window.location.href = getLoginUrl();
                      setIsOpen(false);
                    }}
                  >
                    Connexion
                  </Button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
