import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";
import HeroSection from "@/components/index/HeroSection";
import TeachersSection from "@/components/index/TeachersSection";
import ScheduleSection from "@/components/index/ScheduleSection";
import ResultsTestimonialsSection from "@/components/index/ResultsTestimonialsSection";
import ContactsFooter from "@/components/index/ContactsFooter";
import BookingDialog from "@/components/index/BookingDialog";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentEmail, setStudentEmail] = useState("");

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const subjects = [
    { name: "Математика", color: "bg-primary", students: 45 },
    { name: "Русский язык", color: "bg-secondary", students: 38 },
    { name: "Физика", color: "bg-accent", students: 32 },
    { name: "Обществознание", color: "bg-primary", students: 41 },
    { name: "Химия", color: "bg-secondary", students: 28 },
    { name: "Биология", color: "bg-accent", students: 35 },
  ];

  const teachers = [
    {
      name: "Я внатуре отморозок жес",
      subject: "Математика",
      experience: "15 лет",
      rating: 4.9,
      students: 120,
      image: "/img/7a073bd2-7f17-418a-8b5a-6b500641d169.jpg",
    },
    {
      name: "я тоже вацок",
      subject: "Физика",
      experience: "12 лет",
      rating: 4.8,
      students: 95,
      image: "/img/7a073bd2-7f17-418a-8b5a-6b500641d169.jpg",
    },
    {
      name: "рот закрой да по братски",
      subject: "Русский язык",
      experience: "18 лет",
      rating: 4.9,
      students: 110,
      image: "/img/7a073bd2-7f17-418a-8b5a-6b500641d169.jpg",
    },
  ];

  const results = [
    { exam: "ЕГЭ Математика", averageScore: 87, successRate: 94 },
    { exam: "ОГЭ Русский язык", averageScore: 4.6, successRate: 96 },
    { exam: "ЕГЭ Физика", averageScore: 82, successRate: 89 },
    { exam: "ОГЭ Математика", averageScore: 4.4, successRate: 92 },
  ];

  const testimonials = [
    {
      name: "Мария Иванова",
      text: "Благодаря занятиям в центре сдала ЕГЭ по математике на 95 баллов! Преподаватели объясняют сложные темы простым языком.",
      score: 95,
      subject: "Математика",
    },
    {
      name: "Дмитрий Петров",
      text: "Отличная подготовка к ОГЭ. Систематизировал знания и повысил уверенность в себе. Рекомендую!",
      score: 5,
      subject: "Русский язык",
    },
    {
      name: "Анастасия Волкова",
      text: "Поступила в МГУ благодаря качественной подготовке. Спасибо преподавателям за терпение и профессионализм!",
      score: 89,
      subject: "Физика",
    },
  ];

  const schedule = [
    {
      time: "9:00",
      subject: "Математика (ЕГЭ)",
      teacher: "А.П. Смирнова",
      room: "201",
    },
    {
      time: "11:00",
      subject: "Русский язык (ОГЭ)",
      teacher: "Е.В. Зайцева",
      room: "105",
    },
    {
      time: "13:00",
      subject: "Физика (ЕГЭ)",
      teacher: "М.А. Козлов",
      room: "301",
    },
    {
      time: "15:00",
      subject: "Математика (ОГЭ)",
      teacher: "А.П. Смирнова",
      room: "201",
    },
    {
      time: "17:00",
      subject: "Обществознание",
      teacher: "И.С. Новиков",
      room: "102",
    },
  ];

  const availableSlots = [
    { time: "9:00", available: true },
    { time: "11:00", available: true },
    { time: "13:00", available: false },
    { time: "15:00", available: true },
    { time: "17:00", available: true },
    { time: "19:00", available: true },
  ];

  const handleBooking = () => {
    if (
      !selectedTeacher ||
      !selectedSubject ||
      !selectedTime ||
      !studentName ||
      !studentPhone
    ) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }
    alert(`Заявка отправлена!
Преподаватель: ${selectedTeacher}
Предмет: ${selectedSubject}
Время: ${selectedTime}
Ученик: ${studentName}

Мы свяжемся с вами в ближайшее время!`);
    setBookingOpen(false);
    setSelectedTeacher("");
    setSelectedSubject("");
    setSelectedTime("");
    setStudentName("");
    setStudentPhone("");
    setStudentEmail("");
  };

  const openBookingModal = (teacher?: string, subject?: string) => {
    if (teacher) setSelectedTeacher(teacher);
    if (subject) setSelectedSubject(subject);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="GraduationCap" size={32} className="text-primary" />
              <span className="text-xl font-heading font-bold">Samur</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              {[
                "Главная",
                "Преподаватели",
                "Результаты",
                "Отзывы",
                "Контакты",
              ].map((item, index) => (
                <button
                  key={item}
                  onClick={() =>
                    scrollToSection(
                      [
                        "home",
                        "teachers",
                        "results",
                        "testimonials",
                        "contacts",
                      ][index],
                    )
                  }
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    activeSection ===
                    ["home", "teachers", "results", "testimonials", "contacts"][
                      index
                    ]
                      ? "text-primary"
                      : "text-gray-600"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
              <DialogTrigger asChild>
                <Button className="hidden md:block">Записаться</Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection
        onBookingClick={() => openBookingModal()}
        onScrollToSection={scrollToSection}
        subjects={subjects}
      />

      {/* Teachers Section */}
      <TeachersSection
        teachers={teachers}
        onBookingClick={openBookingModal}
      />

      {/* Schedule Section */}
      <ScheduleSection schedule={schedule} availableSlots={availableSlots} />

      {/* Results and Testimonials Section */}
      <ResultsTestimonialsSection
        results={results}
        testimonials={testimonials}
      />

      {/* Contacts and Footer */}
      <ContactsFooter onBookingClick={() => openBookingModal()} />

      {/* Booking Dialog */}
      <BookingDialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        selectedTeacher={selectedTeacher}
        setSelectedTeacher={setSelectedTeacher}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        studentName={studentName}
        setStudentName={setStudentName}
        studentPhone={studentPhone}
        setStudentPhone={setStudentPhone}
        studentEmail={studentEmail}
        setStudentEmail={setStudentEmail}
        teachers={teachers}
        subjects={subjects}
        availableSlots={availableSlots}
        onBooking={handleBooking}
      />
    </div>
  );
};

export default Index;
