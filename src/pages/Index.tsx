import React, { useState, useEffect } from "react";
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

  const [teachers, setTeachers] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  const API_URL = 'https://functions.poehali.dev/3fe1afdd-d3fa-410a-8629-ad0d3e8996fe';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [teachersRes, scheduleRes, contactsRes, reviewsRes] = await Promise.all([
        fetch(`${API_URL}?entity=teachers`),
        fetch(`${API_URL}?entity=schedule`),
        fetch(`${API_URL}?entity=contacts`),
        fetch(`${API_URL}?entity=reviews`)
      ]);
      
      if (teachersRes.ok) {
        const data = await teachersRes.json();
        setTeachers(data);
      }
      if (scheduleRes.ok) {
        const data = await scheduleRes.json();
        setSchedule(data);
      }
      if (contactsRes.ok) {
        const data = await contactsRes.json();
        setContacts(data);
      }
      if (reviewsRes.ok) {
        const data = await reviewsRes.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const results = [
    { exam: "ЕГЭ Математика", averageScore: 87, successRate: 94 },
    { exam: "ОГЭ Русский язык", averageScore: 4.6, successRate: 96 },
    { exam: "ЕГЭ Физика", averageScore: 82, successRate: 89 },
    { exam: "ОГЭ Математика", averageScore: 4.4, successRate: 92 },
  ];

  const testimonials = reviews.map(review => ({
    name: review.author_name || '',
    text: review.review_text || '',
    score: review.rating || 5,
    subject: '',
  }));

  const availableSlots = [
    { time: "9:00", available: true },
    { time: "11:00", available: true },
    { time: "13:00", available: false },
    { time: "15:00", available: true },
    { time: "17:00", available: true },
    { time: "19:00", available: true },
  ];

  const handleBooking = async () => {
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

    try {
      const response = await fetch(
        "https://functions.poehali.dev/98346566-b607-4709-8500-51e601b9d6e9",
        {
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
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
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
      } else {
        alert("Ошибка при отправке заявки. Попробуйте позже.");
      }
    } catch (error) {
      alert("Ошибка при отправке заявки. Попробуйте позже.");
      console.error("Booking error:", error);
    }
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