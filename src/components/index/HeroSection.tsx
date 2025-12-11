import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface HeroSectionProps {
  onBookingClick: () => void;
  onScrollToSection: (section: string) => void;
  subjects: Array<{ name: string; color: string; students: number }>;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onBookingClick,
  onScrollToSection,
  subjects,
}) => {
  return (
    <section id="home" className="pt-20 pb-16 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-heading font-bold text-foreground mb-6">
              Подготовка к <span className="text-primary">ОГЭ</span> и{" "}
              <span className="text-secondary">ЕГЭ</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Индивидуальный подход, опытные преподаватели и проверенные
              методики. Помогаем достичь высоких результатов и поступить в
              желаемый вуз.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="text-lg px-8"
                onClick={onBookingClick}
              >
                Записаться на занятие
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8"
                onClick={() => onScrollToSection("teachers")}
              >
                Наши преподаватели
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-primary/5 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-1">15+</div>
                <div className="text-sm text-muted-foreground">
                  Лет опыта
                </div>
              </div>
              <div className="p-4 bg-secondary/5 rounded-lg">
                <div className="text-3xl font-bold text-secondary mb-1">
                  500+
                </div>
                <div className="text-sm text-muted-foreground">
                  Учеников
                </div>
              </div>
              <div className="p-4 bg-accent/5 rounded-lg">
                <div className="text-3xl font-bold text-accent mb-1">94%</div>
                <div className="text-sm text-muted-foreground">
                  Поступление
                </div>
              </div>
            </div>
          </div>
          <div className="relative animate-slide-up">
            <div className="grid grid-cols-2 gap-4">
              {subjects.map((subject, index) => (
                <div
                  key={subject.name}
                  className={`p-6 ${subject.color} text-white rounded-2xl shadow-lg hover:scale-105 transition-transform cursor-pointer`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon name="BookOpen" size={32} className="mb-3" />
                  <h3 className="font-bold text-lg mb-2">{subject.name}</h3>
                  <p className="text-sm opacity-90">
                    {subject.students} учеников
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
