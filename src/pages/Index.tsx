import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeSection, setActiveSection] = useState('home');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const subjects = [
    { name: 'Математика', color: 'bg-primary', students: 45 },
    { name: 'Русский язык', color: 'bg-secondary', students: 38 },
    { name: 'Физика', color: 'bg-accent', students: 32 },
    { name: 'Обществознание', color: 'bg-primary', students: 41 },
    { name: 'Химия', color: 'bg-secondary', students: 28 },
    { name: 'Биология', color: 'bg-accent', students: 35 }
  ];

  const teachers = [
    {
      name: 'Анна Петровна Смирнова',
      subject: 'Математика',
      experience: '15 лет',
      rating: 4.9,
      students: 120,
      image: '/img/7a073bd2-7f17-418a-8b5a-6b500641d169.jpg'
    },
    {
      name: 'Михаил Алексеевич Козлов',
      subject: 'Физика',
      experience: '12 лет',
      rating: 4.8,
      students: 95,
      image: '/img/7a073bd2-7f17-418a-8b5a-6b500641d169.jpg'
    },
    {
      name: 'Елена Викторовна Зайцева',
      subject: 'Русский язык',
      experience: '18 лет',
      rating: 4.9,
      students: 110,
      image: '/img/7a073bd2-7f17-418a-8b5a-6b500641d169.jpg'
    }
  ];

  const results = [
    { exam: 'ЕГЭ Математика', averageScore: 87, successRate: 94 },
    { exam: 'ОГЭ Русский язык', averageScore: 4.6, successRate: 96 },
    { exam: 'ЕГЭ Физика', averageScore: 82, successRate: 89 },
    { exam: 'ОГЭ Математика', averageScore: 4.4, successRate: 92 }
  ];

  const testimonials = [
    {
      name: 'Мария Иванова',
      text: 'Благодаря занятиям в центре сдала ЕГЭ по математике на 95 баллов! Преподаватели объясняют сложные темы простым языком.',
      score: 95,
      subject: 'Математика'
    },
    {
      name: 'Дмитрий Петров',
      text: 'Отличная подготовка к ОГЭ. Систематизировал знания и повысил уверенность в себе. Рекомендую!',
      score: 5,
      subject: 'Русский язык'
    },
    {
      name: 'Анастасия Волкова',
      text: 'Поступила в МГУ благодаря качественной подготовке. Спасибо преподавателям за терпение и профессионализм!',
      score: 89,
      subject: 'Физика'
    }
  ];

  const schedule = [
    { time: '9:00', subject: 'Математика (ЕГЭ)', teacher: 'А.П. Смирнова', room: '201' },
    { time: '11:00', subject: 'Русский язык (ОГЭ)', teacher: 'Е.В. Зайцева', room: '105' },
    { time: '13:00', subject: 'Физика (ЕГЭ)', teacher: 'М.А. Козлов', room: '301' },
    { time: '15:00', subject: 'Математика (ОГЭ)', teacher: 'А.П. Смирнова', room: '201' },
    { time: '17:00', subject: 'Обществознание', teacher: 'И.С. Новиков', room: '102' }
  ];

  const availableSlots = [
    { time: '9:00', available: true },
    { time: '11:00', available: true },
    { time: '13:00', available: false },
    { time: '15:00', available: true },
    { time: '17:00', available: true },
    { time: '19:00', available: true }
  ];

  const handleBooking = () => {
    if (!selectedTeacher || !selectedSubject || !selectedTime || !studentName || !studentPhone) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    alert(`Заявка отправлена!
Преподаватель: ${selectedTeacher}
Предмет: ${selectedSubject}
Время: ${selectedTime}
Ученик: ${studentName}

Мы свяжемся с вами в ближайшее время!`);
    setBookingOpen(false);
    setSelectedTeacher('');
    setSelectedSubject('');
    setSelectedTime('');
    setStudentName('');
    setStudentPhone('');
    setStudentEmail('');
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
              <span className="text-xl font-heading font-bold">EduCenter</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              {['Главная', 'Преподаватели', 'Результаты', 'Отзывы', 'Контакты'].map((item, index) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(['home', 'teachers', 'results', 'testimonials', 'contacts'][index])}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    activeSection === ['home', 'teachers', 'results', 'testimonials', 'contacts'][index] 
                      ? 'text-primary' : 'text-gray-600'
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
      <section id="home" className="pt-20 pb-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl lg:text-6xl font-heading font-bold text-foreground mb-6">
                Подготовка к <span className="text-primary">ОГЭ</span> и <span className="text-secondary">ЕГЭ</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Индивидуальный подход, опытные преподаватели и проверенные методики. 
                Помогаем достичь высоких результатов и поступить в желаемый вуз.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="text-lg px-8" onClick={() => openBookingModal()}>
                  <Icon name="BookOpen" size={20} className="mr-2" />
                  Начать обучение
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8" onClick={() => openBookingModal()}>
                  <Icon name="Phone" size={20} className="mr-2" />
                  Консультация
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Выпускников</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">95%</div>
                  <div className="text-sm text-muted-foreground">Поступления</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">8</div>
                  <div className="text-sm text-muted-foreground">Лет опыта</div>
                </div>
              </div>
            </div>
            <div className="animate-scale-in">
              <img
                src="/img/b49f028c-befa-4b36-a789-fe5a5adc65be.jpg"
                alt="Современное образование"
                className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Предметы подготовки</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <div className={`w-3 h-3 rounded-full ${subject.color}`}></div>
                  </div>
                  <CardDescription>{subject.students} учеников</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">ОГЭ • ЕГЭ</span>
                    <Badge variant="secondary">Доступно</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Расписание и календарь</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6">Расписание на сегодня</h3>
              <div className="space-y-4">
                {schedule.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-lg font-semibold text-primary">{item.time}</div>
                        <div>
                          <div className="font-medium">{item.subject}</div>
                          <div className="text-sm text-muted-foreground">{item.teacher} • Аудитория {item.room}</div>
                        </div>
                      </div>
                      <Icon name="Clock" size={20} className="text-muted-foreground" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Календарь подготовки</h3>
              <div className="bg-card rounded-lg p-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md"
                />
                <div className="mt-4 space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span>Пробные экзамены</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <span>Контрольные работы</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                    <span>Дополнительные занятия</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section id="teachers" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Наши преподаватели</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((teacher, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{teacher.name}</CardTitle>
                  <CardDescription>{teacher.subject} • {teacher.experience}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={16} className="text-yellow-500 fill-current" />
                      <span className="font-semibold">{teacher.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{teacher.students} учеников</span>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => openBookingModal(teacher.name, teacher.subject)}>Записаться</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Результаты учеников</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((result, index) => (
              <Card key={index} className="text-center p-6">
                <CardHeader>
                  <CardTitle className="text-lg">{result.exam}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold text-primary">{result.averageScore}</div>
                      <div className="text-sm text-muted-foreground">Средний балл</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-accent">{result.successRate}%</div>
                      <div className="text-sm text-muted-foreground">Успешность</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Отзывы учеников</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <Badge className="bg-primary">{testimonial.score} {typeof testimonial.score === 'number' && testimonial.score > 10 ? 'баллов' : ''}</Badge>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                  <div className="text-sm text-primary font-medium">{testimonial.subject}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts Section */}
      <section id="contacts" className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Контакты</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <Icon name="MapPin" size={24} className="text-primary" />
                  <div>
                    <h4 className="font-semibold">Адрес</h4>
                    <p className="text-muted-foreground">г. Москва, ул. Образовательная, д. 15</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <Icon name="Phone" size={24} className="text-primary" />
                  <div>
                    <h4 className="font-semibold">Телефон</h4>
                    <p className="text-muted-foreground">+7 (495) 123-45-67</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <Icon name="Mail" size={24} className="text-primary" />
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-muted-foreground">info@educenter.ru</p>
                  </div>
                </div>
              </Card>
            </div>
            <div>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6">Записаться на консультацию</h3>
                <form className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Имя</label>
                    <input className="w-full p-3 border rounded-lg mt-1" placeholder="Ваше имя" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Телефон</label>
                    <input className="w-full p-3 border rounded-lg mt-1" placeholder="+7 (___) ___-__-__" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Предмет</label>
                    <select className="w-full p-3 border rounded-lg mt-1">
                      <option>Выберите предмет</option>
                      <option>Математика</option>
                      <option>Русский язык</option>
                      <option>Физика</option>
                      <option>Химия</option>
                    </select>
                  </div>
                  <Button className="w-full">Отправить заявку</Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="GraduationCap" size={28} className="text-primary" />
                <span className="text-xl font-heading font-bold">EduCenter</span>
              </div>
              <p className="text-muted-foreground">
                Ведущий образовательный центр по подготовке к ОГЭ и ЕГЭ. 
                Помогаем достичь высоких результатов уже 8 лет.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Предметы</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Математика</li>
                <li>Русский язык</li>
                <li>Физика</li>
                <li>Химия</li>
                <li>Обществознание</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-muted-foreground">
                <p>+7 (495) 123-45-67</p>
                <p>info@educenter.ru</p>
                <p>г. Москва, ул. Образовательная, д. 15</p>
              </div>
            </div>
          </div>
          <div className="border-t border-muted mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 EduCenter. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading">Записаться на занятие</DialogTitle>
            <DialogDescription>
              Выберите преподавателя, предмет и удобное время для занятий
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Информация о занятии</TabsTrigger>
              <TabsTrigger value="student">Данные ученика</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="teacher">Преподаватель *</Label>
                  <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите преподавателя" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher, index) => (
                        <SelectItem key={index} value={teacher.name}>
                          {teacher.name} - {teacher.subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Предмет *</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите предмет" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject, index) => (
                        <SelectItem key={index} value={subject.name}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="time">Время занятия *</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {availableSlots.map((slot, index) => (
                      <Button
                        key={index}
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className="h-12"
                      >
                        {slot.time}
                        {!slot.available && <span className="ml-1 text-xs">(занято)</span>}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="student" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Имя ученика *</Label>
                  <Input
                    id="name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Введите имя ученика"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email (необязательно)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="example@mail.ru"
                  />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Выбранные параметры:</h4>
                  <div className="space-y-1 text-sm">
                    <p>Преподаватель: {selectedTeacher || 'Не выбран'}</p>
                    <p>Предмет: {selectedSubject || 'Не выбран'}</p>
                    <p>Время: {selectedTime || 'Не выбрано'}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => setBookingOpen(false)} className="flex-1">
              Отмена
            </Button>
            <Button onClick={handleBooking} className="flex-1">
              <Icon name="Calendar" size={16} className="mr-2" />
              Записаться
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;