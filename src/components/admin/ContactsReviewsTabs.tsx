import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Contact, Review } from './types';

interface ContactsTabProps {
  contacts: Contact[];
  onSave: (data: Contact, isNew: boolean) => void;
}

export const ContactsTab = ({ contacts, onSave }: ContactsTabProps) => {
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

interface ReviewsTabProps {
  reviews: Review[];
  onSave: (data: Review, isNew: boolean) => void;
}

export const ReviewsTab = ({ reviews, onSave }: ReviewsTabProps) => {
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
