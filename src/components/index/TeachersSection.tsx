import React from "react";
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
  name: string;
  subject: string;
  experience: string;
  rating: number;
  students: number;
  image: string;
}

interface TeachersSectionProps {
  teachers: Teacher[];
  onBookingClick: (teacher: string, subject: string) => void;
}

const TeachersSection: React.FC<TeachersSectionProps> = ({
  teachers,
  onBookingClick,
}) => {
  return (
    <section id="teachers" className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-4">
            Наши преподаватели
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Опытные педагоги с высшим образованием и подтвержденными
            результатами
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers.map((teacher) => (
            <Card
              key={teacher.name}
              className="hover:shadow-xl transition-shadow"
            >
              <CardHeader>
                <div className="w-full h-64 mb-4 overflow-hidden rounded-lg">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-xl">{teacher.name}</CardTitle>
                <CardDescription>{teacher.subject}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon name="Award" size={18} className="text-primary" />
                    <span className="text-sm">Опыт: {teacher.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Star" size={18} className="text-yellow-500" />
                    <span className="text-sm">
                      Рейтинг: {teacher.rating}/5.0
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Users" size={18} className="text-secondary" />
                    <span className="text-sm">
                      Учеников: {teacher.students}
                    </span>
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() =>
                      onBookingClick(teacher.name, teacher.subject)
                    }
                  >
                    Записаться
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeachersSection;
