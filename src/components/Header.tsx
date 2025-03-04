
import { useState } from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <header className="bg-background border-b border-border/30 sticky top-0 z-50">
      <div className="container max-w-6xl flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-tight">ArtifyAI</span>
        </Link>

        {isMobile ? (
          <>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isOpen ? <X /> : <Menu />}
              </Button>
            </div>
            {isOpen && (
              <div className="fixed inset-0 top-16 z-50 bg-background p-6 md:hidden">
                <nav className="flex flex-col space-y-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="text-foreground font-medium py-2 text-lg"
                      onClick={toggleMenu}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-foreground/70 hover:text-foreground font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
