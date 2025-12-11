import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";

interface ScheduleItem {
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

interface ScheduleSectionProps {
  schedule: ScheduleItem[];
  availableSlots: Array<{ time: string; available: boolean }>;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  schedule,
  availableSlots,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-4">
            Расписание занятий
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Удобное расписание с учетом ваших потребностей
          </p>
        </div>

        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="today">Сегодня</TabsTrigger>
            <TabsTrigger value="calendar">Календарь</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            <div className="grid gap-4 max-w-4xl mx-auto">
              {schedule.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-primary">
                          {item.time}
                        </div>
                        <div className="border-l-2 border-primary pl-4">
                          <h3 className="font-semibold text-lg">
                            {item.subject}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.teacher}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-sm">
                        <Icon
                          name="MapPin"
                          size={14}
                          className="mr-1 inline"
                        />
                        Каб. {item.room}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Выберите дату</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Доступные слоты</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {availableSlots.map((slot, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          slot.available
                            ? "border-primary/20 hover:border-primary cursor-pointer hover:bg-primary/5"
                            : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{slot.time}</span>
                          {slot.available ? (
                            <Badge className="bg-green-500">Свободно</Badge>
                          ) : (
                            <Badge variant="secondary">Занято</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ScheduleSection;
