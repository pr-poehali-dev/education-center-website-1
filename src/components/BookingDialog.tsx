import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface Teacher {
  id: number;
  full_name: string;
  subject: string;
}

interface Subject {
  id: number;
  name: string;
}

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teachers: Teacher[];
  subjects: Subject[];
  initialTeacher?: string;
  initialSubject?: string;
}

const BOOKING_URL =
  "https://functions.poehali.dev/98346566-b607-4709-8500-51e601b9d6e9";

const BookingDialog = ({
  open,
  onOpenChange,
  teachers,
  subjects,
  initialTeacher = "",
  initialSubject = "",
}: BookingDialogProps) => {
  const { toast } = useToast();
  const [selectedTeacher, setSelectedTeacher] = useState(initialTeacher);
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [selectedTime, setSelectedTime] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleClose = (value: boolean) => {
    if (!value) {
      setSelectedTeacher("");
      setSelectedSubject("");
      setSelectedTime("");
      setStudentName("");
      setStudentPhone("");
      setStudentEmail("");
    }
    onOpenChange(value);
  };

  const handleBooking = async () => {
    if (!studentName || !studentPhone) {
      toast({ title: "Заполните обязательные поля", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await fetch(BOOKING_URL, {
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
      handleClose(false);
    } catch {
      toast({ title: "Ошибка отправки", variant: "destructive" });
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
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
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
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
          <Button variant="outline" onClick={() => handleClose(false)}>
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
  );
};

export default BookingDialog;
