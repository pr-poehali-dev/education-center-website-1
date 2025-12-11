import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const API_AUTH = 'https://functions.poehali.dev/ac68c96a-4b48-4841-afdd-c45fec1a7ad5';
const API_DATA = 'https://functions.poehali.dev/a30f8752-d13c-41eb-99b2-d8709193a333';

interface Teacher {
  id?: number;
  name: string;
  photo_url?: string;
  description?: string;
  specialization?: string;
  experience?: string;
  sort_order?: number;
}

interface Schedule {
  id?: number;
  time: string;
  title: string;
  description?: string;
  teacher_id?: number;
  sort_order?: number;
}

interface Contact {
  id?: number;
  type: string;
  value: string;
  icon?: string;
  label?: string;
  sort_order?: number;
}

interface Review {
  id?: number;
  author_name: string;
  author_photo?: string;
  rating?: number;
  review_text: string;
  date?: string;
  is_published?: boolean;
  sort_order?: number;
}

interface Booking {
  id?: number;
  student_name: string;
  student_phone: string;
  student_email?: string;
  selected_teacher?: string;
  selected_subject?: string;
  selected_time?: string;
  status?: string;
  created_at?: string;
}

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

const TeachersTab = ({ teachers, onSave }: { teachers: Teacher[], onSave: (data: Teacher, isNew: boolean) => void }) => {
  const [editItem, setEditItem] = useState<Teacher | null>(null);
  
  const handleEdit = (teacher: Teacher) => {
    setEditItem({ ...teacher });
  };
  
  const handleNew = () => {
    setEditItem({ name: '', specialization: '', experience: '', description: '' });
  };
  
  const handleSave = () => {
    if (editItem) {
      onSave(editItem, !editItem.id);
      setEditItem(null);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleNew}>
        <Icon name="Plus" className="mr-2" size={20} />
        Добавить преподавателя
      </Button>
      
      {editItem && (
        <Card>
          <CardHeader>
            <CardTitle>{editItem.id ? 'Редактировать' : 'Новый преподаватель'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Имя"
              value={editItem.name}
              onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
            />
            <Input
              placeholder="URL фото"
              value={editItem.photo_url || ''}
              onChange={(e) => setEditItem({ ...editItem, photo_url: e.target.value })}
            />
            <Input
              placeholder="Специализация"
              value={editItem.specialization || ''}
              onChange={(e) => setEditItem({ ...editItem, specialization: e.target.value })}
            />
            <Input
              placeholder="Опыт работы"
              value={editItem.experience || ''}
              onChange={(e) => setEditItem({ ...editItem, experience: e.target.value })}
            />
            <Input
              placeholder="Описание"
              value={editItem.description || ''}
              onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={handleSave}>Сохранить</Button>
              <Button variant="outline" onClick={() => setEditItem(null)}>Отмена</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {teachers.map((teacher) => (
          <Card key={teacher.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{teacher.name}</h3>
                  <p className="text-sm text-gray-600">{teacher.specialization}</p>
                  <p className="text-sm text-gray-500">{teacher.experience}</p>
                </div>
                <Button size="sm" onClick={() => handleEdit(teacher)}>
                  <Icon name="Edit" size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ScheduleTab = ({ schedule, onSave }: { schedule: Schedule[], onSave: (data: Schedule, isNew: boolean) => void }) => {
  const [editItem, setEditItem] = useState<Schedule | null>(null);

  const handleNew = () => {
    setEditItem({ time: '', title: '', description: '' });
  };

  const handleSave = () => {
    if (editItem) {
      onSave(editItem, !editItem.id);
      setEditItem(null);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleNew}>
        <Icon name="Plus" className="mr-2" size={20} />
        Добавить занятие
      </Button>

      {editItem && (
        <Card>
          <CardHeader>
            <CardTitle>{editItem.id ? 'Редактировать' : 'Новое занятие'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Время (например: 09:00 - 10:30)"
              value={editItem.time}
              onChange={(e) => setEditItem({ ...editItem, time: e.target.value })}
            />
            <Input
              placeholder="Название"
              value={editItem.title}
              onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
            />
            <Input
              placeholder="Описание"
              value={editItem.description || ''}
              onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={handleSave}>Сохранить</Button>
              <Button variant="outline" onClick={() => setEditItem(null)}>Отмена</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {schedule.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{item.time}</h3>
                  <p className="text-lg">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <Button size="sm" onClick={() => setEditItem({ ...item })}>
                  <Icon name="Edit" size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ContactsTab = ({ contacts, onSave }: { contacts: Contact[], onSave: (data: Contact, isNew: boolean) => void }) => {
  const [editItem, setEditItem] = useState<Contact | null>(null);

  const handleNew = () => {
    setEditItem({ type: 'phone', value: '', label: '' });
  };

  const handleSave = () => {
    if (editItem) {
      onSave(editItem, !editItem.id);
      setEditItem(null);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleNew}>
        <Icon name="Plus" className="mr-2" size={20} />
        Добавить контакт
      </Button>

      {editItem && (
        <Card>
          <CardHeader>
            <CardTitle>{editItem.id ? 'Редактировать' : 'Новый контакт'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Тип (phone, email, address)"
              value={editItem.type}
              onChange={(e) => setEditItem({ ...editItem, type: e.target.value })}
            />
            <Input
              placeholder="Значение"
              value={editItem.value}
              onChange={(e) => setEditItem({ ...editItem, value: e.target.value })}
            />
            <Input
              placeholder="Подпись"
              value={editItem.label || ''}
              onChange={(e) => setEditItem({ ...editItem, label: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={handleSave}>Сохранить</Button>
              <Button variant="outline" onClick={() => setEditItem(null)}>Отмена</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {contacts.map((contact) => (
          <Card key={contact.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{contact.type}</h3>
                  <p>{contact.value}</p>
                  <p className="text-sm text-gray-600">{contact.label}</p>
                </div>
                <Button size="sm" onClick={() => setEditItem({ ...contact })}>
                  <Icon name="Edit" size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ReviewsTab = ({ reviews, onSave }: { reviews: Review[], onSave: (data: Review, isNew: boolean) => void }) => {
  const [editItem, setEditItem] = useState<Review | null>(null);

  const handleNew = () => {
    setEditItem({ author_name: '', review_text: '', rating: 5, is_published: true });
  };

  const handleSave = () => {
    if (editItem) {
      onSave(editItem, !editItem.id);
      setEditItem(null);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleNew}>
        <Icon name="Plus" className="mr-2" size={20} />
        Добавить отзыв
      </Button>

      {editItem && (
        <Card>
          <CardHeader>
            <CardTitle>{editItem.id ? 'Редактировать' : 'Новый отзыв'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Имя автора"
              value={editItem.author_name}
              onChange={(e) => setEditItem({ ...editItem, author_name: e.target.value })}
            />
            <Input
              placeholder="Текст отзыва"
              value={editItem.review_text}
              onChange={(e) => setEditItem({ ...editItem, review_text: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Рейтинг (1-5)"
              value={editItem.rating || 5}
              onChange={(e) => setEditItem({ ...editItem, rating: parseInt(e.target.value) })}
              min={1}
              max={5}
            />
            <div className="flex gap-2">
              <Button onClick={handleSave}>Сохранить</Button>
              <Button variant="outline" onClick={() => setEditItem(null)}>Отмена</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{review.author_name}</h3>
                  <p className="text-sm">{review.review_text}</p>
                  <p className="text-sm text-gray-600">Рейтинг: {review.rating}/5</p>
                </div>
                <Button size="sm" onClick={() => setEditItem({ ...review })}>
                  <Icon name="Edit" size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const BookingsTab = ({ bookings, onSave }: { bookings: Booking[], onSave: (data: Booking, isNew: boolean) => void }) => {
  const [editItem, setEditItem] = useState<Booking | null>(null);

  const getStatusBadge = (status?: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-500',
      in_progress: 'bg-yellow-500',
      completed: 'bg-green-500',
      cancelled: 'bg-red-500'
    };
    return colors[status || 'new'] || 'bg-gray-500';
  };

  const getStatusText = (status?: string) => {
    const texts: Record<string, string> = {
      new: 'Новая',
      in_progress: 'В работе',
      completed: 'Завершена',
      cancelled: 'Отменена'
    };
    return texts[status || 'new'] || 'Новая';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = (booking: Booking, newStatus: string) => {
    onSave({ ...booking, status: newStatus }, false);
  };

  return (
    <div className="space-y-4">
      {editItem && (
        <Card>
          <CardHeader>
            <CardTitle>Информация о заявке</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Имя:</strong> {editItem.student_name}
            </div>
            <div>
              <strong>Телефон:</strong> {editItem.student_phone}
            </div>
            {editItem.student_email && (
              <div>
                <strong>Email:</strong> {editItem.student_email}
              </div>
            )}
            {editItem.selected_teacher && (
              <div>
                <strong>Преподаватель:</strong> {editItem.selected_teacher}
              </div>
            )}
            {editItem.selected_subject && (
              <div>
                <strong>Предмет:</strong> {editItem.selected_subject}
              </div>
            )}
            {editItem.selected_time && (
              <div>
                <strong>Время:</strong> {editItem.selected_time}
              </div>
            )}
            <div>
              <strong>Дата создания:</strong> {formatDate(editItem.created_at)}
            </div>
            <Button variant="outline" onClick={() => setEditItem(null)}>
              Закрыть
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              Заявок пока нет
            </CardContent>
          </Card>
        ) : (
          bookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{booking.student_name}</h3>
                      <span className={`px-3 py-1 rounded-full text-white text-xs ${getStatusBadge(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p><Icon name="Phone" size={14} className="inline mr-2" />{booking.student_phone}</p>
                      {booking.student_email && (
                        <p><Icon name="Mail" size={14} className="inline mr-2" />{booking.student_email}</p>
                      )}
                      {booking.selected_subject && (
                        <p><Icon name="BookOpen" size={14} className="inline mr-2" />{booking.selected_subject}</p>
                      )}
                      {booking.selected_teacher && (
                        <p><Icon name="User" size={14} className="inline mr-2" />{booking.selected_teacher}</p>
                      )}
                      {booking.selected_time && (
                        <p><Icon name="Clock" size={14} className="inline mr-2" />{booking.selected_time}</p>
                      )}
                      <p className="text-gray-500">
                        <Icon name="Calendar" size={14} className="inline mr-2" />
                        {formatDate(booking.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditItem(booking)}>
                      <Icon name="Eye" size={16} className="mr-1" />
                      Просмотр
                    </Button>
                    {booking.status === 'new' && (
                      <Button size="sm" onClick={() => handleStatusChange(booking, 'in_progress')}>
                        В работу
                      </Button>
                    )}
                    {booking.status === 'in_progress' && (
                      <Button size="sm" className="bg-green-500" onClick={() => handleStatusChange(booking, 'completed')}>
                        Завершить
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Admin;