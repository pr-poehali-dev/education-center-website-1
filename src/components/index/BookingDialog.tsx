import React from "react";
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

interface Teacher {
  name: string;
  subject: string;
}

interface Subject {
  name: string;
}

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTeacher: string;
  setSelectedTeacher: (teacher: string) => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  studentName: string;
  setStudentName: (name: string) => void;
  studentPhone: string;
  setStudentPhone: (phone: string) => void;
  studentEmail: string;
  setStudentEmail: (email: string) => void;
  teachers: Teacher[];
  subjects: Subject[];
  availableSlots: Array<{ time: string; available: boolean }>;
  onBooking: () => void;
}

const BookingDialog: React.FC<BookingDialogProps> = ({
  open,
  onOpenChange,
  selectedTeacher,
  setSelectedTeacher,
  selectedSubject,
  setSelectedSubject,
  selectedTime,
  setSelectedTime,
  studentName,
  setStudentName,
  studentPhone,
  setStudentPhone,
  studentEmail,
  setStudentEmail,
  teachers,
  subjects,
  availableSlots,
  onBooking,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Записаться на занятие</DialogTitle>
          <DialogDescription>
            Заполните форму, и мы свяжемся с вами в ближайшее время
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="teacher">Преподаватель</Label>
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger id="teacher">
                <SelectValue placeholder="Выберите преподавателя" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.name} value={teacher.name}>
                    {teacher.name} - {teacher.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subject">Предмет</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Выберите предмет" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.name} value={subject.name}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="time">Удобное время</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger id="time">
                <SelectValue placeholder="Выберите время" />
              </SelectTrigger>
              <SelectContent>
                {availableSlots
                  .filter((slot) => slot.available)
                  .map((slot) => (
                    <SelectItem key={slot.time} value={slot.time}>
                      {slot.time}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">
              Имя ученика <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Введите имя"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">
              Телефон <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={studentPhone}
              onChange={(e) => setStudentPhone(e.target.value)}
              placeholder="+7 (999) 123-45-67"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email (опционально)</Label>
            <Input
              id="email"
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={onBooking}>Отправить заявку</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
