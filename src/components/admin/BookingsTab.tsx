import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Booking } from './types';

interface BookingsTabProps {
  bookings: Booking[];
  onSave: (data: Booking, isNew: boolean) => void;
}

const BookingsTab = ({ bookings, onSave }: BookingsTabProps) => {
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

export default BookingsTab;
