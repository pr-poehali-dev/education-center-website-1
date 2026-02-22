import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface Teacher {
  id: number;
  full_name: string;
  subject: string;
  experience_years: number;
  rating: number;
  photo_url?: string;
  description?: string;
}

interface Subject {
  id: number;
  name: string;
  exam_type?: string;
}

interface Review {
  id: number;
  author_name: string;
  rating: number;
  review_text: string;
  date?: string;
}

interface Contact {
  id: number;
  type: string;
  value: string;
  icon?: string;
  label?: string;
}

interface ScheduleItem {
  id: number;
  time: string;
  title: string;
  description?: string;
}

interface PageSectionsProps {
  teachers: Teacher[];
  subjects: Subject[];
  reviews: Review[];
  contacts: Contact[];
  schedule: ScheduleItem[];
  onBooking: (teacher?: string, subject?: string) => void;
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

const PageSections = ({
  teachers,
  subjects,
  reviews,
  contacts,
  schedule,
  onBooking,
  onNavigate,
}: PageSectionsProps) => {
  return (
    <>
      <section id="subjects" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <Badge className="mb-4 gradient-secondary border-0 text-white">
              Предметы
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-4">
              Направления подготовки
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Выберите предмет и начните подготовку уже сегодня
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {subjects.map((subj, i) => (
              <Card
                key={subj.id}
                className="group hover:shadow-xl transition-all cursor-pointer border-2 hover:border-orange-200"
                onClick={() => onBooking("", subj.name)}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${subjectColors[i % subjectColors.length]} flex items-center justify-center shadow-lg`}
                  >
                    <Icon
                      name={subjectIcons[i % subjectIcons.length] as any}
                      size={24}
                      className="text-white"
                    />
                  </div>
                  <h3 className="font-semibold text-base">{subj.name}</h3>
                  {subj.exam_type && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {subj.exam_type}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        id="teachers"
        className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white"
      >
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <Badge className="mb-4 gradient-primary border-0 text-white">
              Команда
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-4">
              Наши преподаватели
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Опытные педагоги с подтверждёнными результатами учеников
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((teacher) => (
              <Card
                key={teacher.id}
                className="group hover:shadow-2xl transition-all overflow-hidden border-0 shadow-lg"
              >
                <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden">
                  {teacher.photo_url ? (
                    <img
                      src={teacher.photo_url}
                      alt={teacher.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-white text-3xl font-bold">
                      {teacher.full_name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-foreground shadow-sm">
                      <Icon
                        name="Star"
                        size={14}
                        className="mr-1 text-amber-500"
                      />
                      {teacher.rating}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{teacher.full_name}</CardTitle>
                  <CardDescription className="text-base">
                    {teacher.subject}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon
                        name="Award"
                        size={16}
                        className="text-orange-500"
                      />
                      {teacher.experience_years} лет
                    </div>
                  </div>
                  {teacher.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {teacher.description}
                    </p>
                  )}
                  <Button
                    className="w-full gradient-primary border-0 text-white"
                    onClick={() =>
                      onBooking(teacher.full_name, teacher.subject)
                    }
                  >
                    Записаться
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {schedule.length > 0 && (
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-14">
              <Badge className="mb-4 gradient-accent border-0 text-white">
                Расписание
              </Badge>
              <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-4">
                Расписание занятий
              </h2>
            </div>
            <div className="grid gap-4 max-w-3xl mx-auto">
              {schedule.map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-lg transition-all border-l-4 border-l-orange-500"
                >
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-orange-500 min-w-[60px]">
                        {item.time}
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <section
          id="testimonials"
          className="py-20 px-4 bg-gradient-to-b from-white to-slate-50"
        >
          <div className="container mx-auto">
            <div className="text-center mb-14">
              <Badge className="mb-4 gradient-secondary border-0 text-white">
                Отзывы
              </Badge>
              <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-4">
                Что говорят ученики
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  className="hover:shadow-xl transition-all"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full gradient-secondary flex items-center justify-center text-white font-bold text-lg">
                        {review.author_name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {review.author_name}
                        </CardTitle>
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: review.rating || 5 }).map(
                            (_, i) => (
                              <Icon
                                key={i}
                                name="Star"
                                size={14}
                                className="text-amber-400 fill-amber-400"
                              />
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {review.review_text}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="contacts" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <Badge className="mb-4 gradient-accent border-0 text-white">
              Контакты
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-4">
              Свяжитесь с нами
            </h2>
          </div>
          {contacts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              {contacts.map((contact) => (
                <Card
                  key={contact.id}
                  className="hover:shadow-lg transition-all text-center"
                >
                  <CardContent className="p-6">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-orange-100 flex items-center justify-center">
                      <Icon
                        name={(contact.icon as any) || "Phone"}
                        size={24}
                        className="text-orange-500"
                      />
                    </div>
                    <h3 className="font-semibold mb-1">
                      {contact.label || contact.type}
                    </h3>
                    <p className="text-muted-foreground">{contact.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              {[
                {
                  icon: "Phone",
                  label: "Телефон",
                  value: "+7 (929) 882-80-30",
                },
                {
                  icon: "Mail",
                  label: "Email",
                  value: "centersamur@gmail.com",
                },
                {
                  icon: "MapPin",
                  label: "Адрес",
                  value: "г. Махачкала, ул. Гаджимагомедов, д. 10",
                },
              ].map((c) => (
                <Card
                  key={c.label}
                  className="hover:shadow-lg transition-all text-center"
                >
                  <CardContent className="p-6">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-orange-100 flex items-center justify-center">
                      <Icon
                        name={c.icon as any}
                        size={24}
                        className="text-orange-500"
                      />
                    </div>
                    <h3 className="font-semibold mb-1">{c.label}</h3>
                    <p className="text-muted-foreground">{c.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-orange-500 to-amber-500 border-0 text-white shadow-2xl shadow-orange-500/20">
            <CardContent className="p-10 text-center">
              <h3 className="text-2xl font-bold mb-3">Готовы начать?</h3>
              <p className="opacity-90 mb-6">
                Запишитесь на бесплатное пробное занятие прямо сейчас
              </p>
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-white/90 text-lg px-8 shadow-lg"
                onClick={() => onBooking()}
              >
                Записаться бесплатно
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Icon name="GraduationCap" size={22} className="text-white" />
                </div>
                <span className="text-xl font-heading font-bold">Samur</span>
              </div>
              <p className="text-slate-400 text-sm">
                Качественная подготовка к ОГЭ и ЕГЭ
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Навигация</h4>
              <ul className="space-y-2 text-sm">
                {["Главная", "Преподаватели", "Отзывы", "Контакты"].map(
                  (item, i) => (
                    <li key={item}>
                      <button
                        onClick={() =>
                          onNavigate(
                            ["home", "teachers", "testimonials", "contacts"][i],
                          )
                        }
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {item}
                      </button>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Предметы</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {subjects.slice(0, 5).map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            <p>&copy; 2025 Samur. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default PageSections;
