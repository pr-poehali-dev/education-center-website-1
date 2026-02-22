import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PageSections from "@/components/PageSections";
import BookingDialog from "@/components/BookingDialog";

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
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingTeacher, setBookingTeacher] = useState("");
  const [bookingSubject, setBookingSubject] = useState("");

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
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const openBooking = (teacher?: string, subject?: string) => {
    setBookingTeacher(teacher || "");
    setBookingSubject(subject || "");
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar onNavigate={scrollToSection} onBooking={() => openBooking()} />

      <HeroSection
        subjects={subjects}
        onBooking={() => openBooking()}
        onNavigate={scrollToSection}
      />

      <PageSections
        teachers={teachers}
        subjects={subjects}
        reviews={reviews}
        contacts={contacts}
        schedule={schedule}
        onBooking={openBooking}
        onNavigate={scrollToSection}
      />

      <BookingDialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        teachers={teachers}
        subjects={subjects}
        initialTeacher={bookingTeacher}
        initialSubject={bookingSubject}
      />
    </div>
  );
};

export default Index;
