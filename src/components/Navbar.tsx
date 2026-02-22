import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onBooking: () => void;
}

const Navbar = ({ onNavigate, onBooking }: NavbarProps) => {
  return (
    <nav className="fixed top-0 w-full glass z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Icon name="GraduationCap" size={22} className="text-white" />
            </div>
            <span className="text-xl font-heading font-bold">Samur</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Главная", "Предметы", "Преподаватели", "Отзывы", "Контакты"].map(
              (item, i) => (
                <button
                  key={item}
                  onClick={() =>
                    onNavigate(
                      ["home", "subjects", "teachers", "testimonials", "contacts"][i],
                    )
                  }
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </button>
              ),
            )}
          </div>
          <Button
            onClick={onBooking}
            className="gradient-primary border-0 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
          >
            Записаться
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
