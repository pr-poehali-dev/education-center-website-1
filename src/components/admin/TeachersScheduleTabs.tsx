import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Teacher, Schedule } from './types';

interface TeachersTabProps {
  teachers: Teacher[];
  onSave: (data: Teacher, isNew: boolean) => void;
}

export const TeachersTab = ({ teachers, onSave }: TeachersTabProps) => {
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

interface ScheduleTabProps {
  schedule: Schedule[];
  onSave: (data: Schedule, isNew: boolean) => void;
}

export const ScheduleTab = ({ schedule, onSave }: ScheduleTabProps) => {
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
