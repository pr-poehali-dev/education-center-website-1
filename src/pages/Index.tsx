import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

const API_PUBLIC =
  "https://functions.poehali.dev/3fe1afdd-d3fa-410a-8629-ad0d3e8996fe";

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

const Index = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("home");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    loadData("teachers", setTeachers);
    loadData("subjects", setSubjects);
    loadData("reviews", setReviews);
    loadData("contacts", setContacts);
    loadData("schedule", setSchedule);
  }, []);

  const loadData = async (entity: string, setter: (data: any[]) => void) => {
    try {
      const res = await fetch(`${API_PUBLIC}?entity=${entity}`);
      const data = await res.json();
      if (Array.isArray(data)) setter(data);
    } catch (e) {
      console.error(`Failed to load ${entity}`, e);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const openBooking = (teacher?: string, subject?: string) => {
    if (teacher) setSelectedTeacher(teacher);
    if (subject) setSelectedSubject(subject);
    setBookingOpen(true);
  };

  const handleBooking = async () => {
    if (!studentName || !studentPhone) {
      toast({ title: "Заполните обязательные поля", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const bookingUrl =
        "https://functions.poehali.dev/98346566-b607-4709-8500-51e601b9d6e9";
      await fetch(bookingUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_name: studentName,
          student_phone: studentPhone,
          student_email: studentEmail,
          selected_teacher: selectedTeacher,
          selected_subject: selectedSubject,
          selected_time: selectedTime,
        }),
      });
      toast({
        title: "Заявка отправлена!",
        description: "Мы свяжемся с вами в ближайшее время",
      });
      setBookingOpen(false);
      setSelectedTeacher("");
      setSelectedSubject("");
      setSelectedTime("");
      setStudentName("");
      setStudentPhone("");
      setStudentEmail("");
    } catch {
      toast({ title: "Ошибка отправки", variant: "destructive" });
    }
    setSubmitting(false);
  };

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

  return (
    <div className="min-h-screen bg-background font-sans">
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
              {[
                "Главная",
                "Предметы",
                "Преподаватели",
                "Отзывы",
                "Контакты",
              ].map((item, i) => (
                <button
                  key={item}
                  onClick={() =>
                    scrollToSection(
                      [
                        "home",
                        "subjects",
                        "teachers",
                        "testimonials",
                        "contacts",
                      ][i],
                    )
                  }
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
            <Button
              onClick={() => openBooking()}
              className="gradient-primary border-0 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
            >
              Записаться
            </Button>
          </div>
        </div>
      </nav>

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
                  onClick={() => openBooking()}
                >
                  <Icon name="Rocket" size={20} className="mr-2" />
                  Записаться бесплатно
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8"
                  onClick={() => scrollToSection("teachers")}
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
                onClick={() => openBooking("", subj.name)}
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
                      openBooking(teacher.full_name, teacher.subject)
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
                onClick={() => openBooking()}
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
                          scrollToSection(
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

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Записаться на занятие</DialogTitle>
            <DialogDescription>
              Заполните форму и мы свяжемся с вами
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>
                Имя ученика <span className="text-red-500">*</span>
              </Label>
              <Input
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Имя"
              />
            </div>
            <div className="grid gap-2">
              <Label>
                Телефон <span className="text-red-500">*</span>
              </Label>
              <Input
                type="tel"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                placeholder="+7 (929) 882-80-30"
              />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="centersamur@gmail.com"
              />
            </div>
            <div className="grid gap-2">
              <Label>Преподаватель</Label>
              <Select
                value={selectedTeacher}
                onValueChange={setSelectedTeacher}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={t.full_name}>
                      {t.full_name} — {t.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Предмет</Label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Удобное время</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "9:00",
                    "10:00",
                    "11:00",
                    "12:00",
                    "13:00",
                    "14:00",
                    "15:00",
                    "16:00",
                    "17:00",
                    "18:00",
                    "19:00",
                  ].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setBookingOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={handleBooking}
              disabled={submitting}
              className="gradient-primary border-0 text-white"
            >
              {submitting ? "Отправка..." : "Отправить заявку"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
