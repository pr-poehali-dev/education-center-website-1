import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface Subject {
  id: number;
  name: string;
  exam_type?: string;
}

interface HeroSectionProps {
  subjects: Subject[];
  onBooking: () => void;
  onNavigate: (sectionId: string) => void;
}

const subjectColors = [
  "from-orange-500 to-amber-500",
  "from-indigo-500 to-purple-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-pink-500",
  "from-cyan-500 to-blue-500",
  "from-violet-500 to-fuchsia-500",
];

const subjectIcons = [
  "Calculator",
  "BookOpen",
  "Atom",
  "FlaskConical",
  "Leaf",
  "Globe",
];

const HeroSection = ({ subjects, onBooking, onNavigate }: HeroSectionProps) => {
  return (
    <section id="home" className="pt-28 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-indigo-50" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl" />
      <div className="container mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Icon name="Sparkles" size={16} />
              Образовательный центр Samur
            </div>
            <h1 className="text-4xl lg:text-6xl font-heading font-extrabold text-foreground mb-6 leading-tight">
              Подготовка к{" "}
              <span className="bg-clip-text text-transparent gradient-primary">
                ОГЭ
              </span>{" "}
              и{" "}
              <span className="bg-clip-text text-transparent gradient-secondary">
                ЕГЭ
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
              Индивидуальный подход, опытные преподаватели и проверенные
              методики. Помогаем достичь высоких результатов и поступить в
              лучшие вузы страны.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button
                size="lg"
                className="text-lg px-8 gradient-primary border-0 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
                onClick={onBooking}
              >
                <Icon name="Rocket" size={20} className="mr-2" />
                Записаться бесплатно
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8"
                onClick={() => onNavigate("teachers")}
              >
                Наши преподаватели
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  value: "15+",
                  label: "Лет опыта",
                  gradient: "from-orange-500 to-amber-500",
                },
                {
                  value: "500+",
                  label: "Учеников",
                  gradient: "from-indigo-500 to-purple-500",
                },
                {
                  value: "94%",
                  label: "Поступление",
                  gradient: "from-emerald-500 to-teal-500",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-2xl bg-white shadow-sm border"
                >
                  <div
                    className={`text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${stat.gradient} mb-1`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {(subjects.length > 0
                ? subjects.slice(0, 6)
                : [
                    { id: 1, name: "Математика" },
                    { id: 2, name: "Русский язык" },
                    { id: 3, name: "Физика" },
                    { id: 4, name: "Химия" },
                    { id: 5, name: "Биология" },
                    { id: 6, name: "Обществознание" },
                  ]
              ).map((subj, i) => (
                <div
                  key={subj.id}
                  className={`p-6 bg-gradient-to-br ${subjectColors[i % subjectColors.length]} text-white rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-all cursor-pointer`}
                >
                  <Icon
                    name={subjectIcons[i % subjectIcons.length] as any}
                    size={32}
                    className="mb-3 opacity-90"
                  />
                  <h3 className="font-bold text-lg">{subj.name}</h3>
                  {(subj as Subject).exam_type && (
                    <p className="text-sm opacity-80 mt-1">
                      {(subj as Subject).exam_type}
                    </p>
                  )}
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
