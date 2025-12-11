import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import BookingsTab from '@/components/admin/BookingsTab';
import { TeachersTab, ScheduleTab } from '@/components/admin/TeachersScheduleTabs';
import { ContactsTab, ReviewsTab } from '@/components/admin/ContactsReviewsTabs';
import type { Teacher, Schedule, Contact, Review, Booking } from '@/components/admin/types';

const API_AUTH = 'https://functions.poehali.dev/ac68c96a-4b48-4841-afdd-c45fec1a7ad5';
const API_DATA = 'https://functions.poehali.dev/a30f8752-d13c-41eb-99b2-d8709193a333';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
      loadAllData(token);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(API_AUTH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        setAuthToken(data.token);
        setIsAuthenticated(true);
        loadAllData(data.token);
        toast({ title: 'Успешно', description: 'Вы вошли в систему' });
      } else {
        toast({ title: 'Ошибка', description: 'Неверные данные для входа', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Ошибка при входе', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setAuthToken('');
    navigate('/');
  };

  const loadAllData = async (token: string) => {
    await loadData('teachers', token, setTeachers);
    await loadData('schedule', token, setSchedule);
    await loadData('contacts', token, setContacts);
    await loadData('reviews', token, setReviews);
    await loadData('bookings', token, setBookings);
  };

  const loadData = async (entity: string, token: string, setter: any) => {
    try {
      const response = await fetch(`${API_DATA}?entity=${entity}`, {
        headers: { 'X-Auth-Token': token }
      });
      const data = await response.json();
      if (response.ok) {
        setter(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error(`Error loading ${entity}:`, error);
    }
  };

  const saveEntity = async (entity: string, data: any, isNew: boolean) => {
    try {
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? `${API_DATA}?entity=${entity}` : `${API_DATA}?entity=${entity}&id=${data.id}`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        toast({ title: 'Успешно', description: 'Данные сохранены' });
        loadAllData(authToken);
      } else {
        toast({ title: 'Ошибка', description: 'Не удалось сохранить данные', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Ошибка при сохранении', variant: 'destructive' });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Вход в админ-панель</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleLogin} className="w-full">
              Войти
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Админ-панель</h1>
          <Button onClick={handleLogout} variant="outline">
            <Icon name="LogOut" className="mr-2" size={20} />
            Выйти
          </Button>
        </div>

        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="bookings">Заявки</TabsTrigger>
            <TabsTrigger value="teachers">Преподаватели</TabsTrigger>
            <TabsTrigger value="schedule">Расписание</TabsTrigger>
            <TabsTrigger value="contacts">Контакты</TabsTrigger>
            <TabsTrigger value="reviews">Отзывы</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <BookingsTab bookings={bookings} onSave={(data, isNew) => saveEntity('bookings', data, isNew)} />
          </TabsContent>

          <TabsContent value="teachers">
            <TeachersTab teachers={teachers} onSave={(data, isNew) => saveEntity('teachers', data, isNew)} />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleTab schedule={schedule} onSave={(data, isNew) => saveEntity('schedule', data, isNew)} />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactsTab contacts={contacts} onSave={(data, isNew) => saveEntity('contacts', data, isNew)} />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsTab reviews={reviews} onSave={(data, isNew) => saveEntity('reviews', data, isNew)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
