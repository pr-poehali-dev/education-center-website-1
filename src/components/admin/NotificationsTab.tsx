import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

interface NotificationSetting {
  id?: number;
  notification_type: string;
  is_enabled: boolean;
  value: string;
}

interface NotificationsTabProps {
  settings: NotificationSetting[];
  onSave: (data: NotificationSetting, isNew: boolean) => void;
}

const NotificationsTab = ({ settings, onSave }: NotificationsTabProps) => {
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [emailId, setEmailId] = useState<number | undefined>();

  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [telegramValue, setTelegramValue] = useState('');
  const [telegramId, setTelegramId] = useState<number | undefined>();

  useEffect(() => {
    const emailSetting = settings.find(s => s.notification_type === 'email');
    if (emailSetting) {
      setEmailEnabled(emailSetting.is_enabled);
      setEmailValue(emailSetting.value || '');
      setEmailId(emailSetting.id);
    }

    const telegramSetting = settings.find(s => s.notification_type === 'telegram');
    if (telegramSetting) {
      setTelegramEnabled(telegramSetting.is_enabled);
      setTelegramValue(telegramSetting.value || '');
      setTelegramId(telegramSetting.id);
    }
  }, [settings]);

  const handleSaveEmail = () => {
    if (emailId) {
      onSave({
        id: emailId,
        notification_type: 'email',
        is_enabled: emailEnabled,
        value: emailValue
      }, false);
    }
  };

  const handleSaveTelegram = () => {
    if (telegramId) {
      onSave({
        id: telegramId,
        notification_type: 'telegram',
        is_enabled: telegramEnabled,
        value: telegramValue
      }, false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Bell" size={24} className="text-primary" />
            Настройки уведомлений
          </CardTitle>
          <CardDescription>
            Получайте уведомления о новых заявках на Email или в Telegram
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Mail" size={20} />
            Email уведомления
          </CardTitle>
          <CardDescription>
            Получайте уведомления на электронную почту
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-enabled" className="text-base">
              Включить Email уведомления
            </Label>
            <Switch
              id="email-enabled"
              checked={emailEnabled}
              onCheckedChange={setEmailEnabled}
            />
          </div>

          {emailEnabled && (
            <div className="space-y-2">
              <Label htmlFor="email-value">Email адрес</Label>
              <Input
                id="email-value"
                type="email"
                placeholder="your-email@example.com"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Укажите email, на который будут приходить уведомления о новых заявках
              </p>
            </div>
          )}

          <Button onClick={handleSaveEmail} className="w-full">
            <Icon name="Save" size={16} className="mr-2" />
            Сохранить настройки Email
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="MessageCircle" size={20} />
            Telegram уведомления
          </CardTitle>
          <CardDescription>
            Получайте уведомления в Telegram
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="telegram-enabled" className="text-base">
              Включить Telegram уведомления
            </Label>
            <Switch
              id="telegram-enabled"
              checked={telegramEnabled}
              onCheckedChange={setTelegramEnabled}
            />
          </div>

          {telegramEnabled && (
            <div className="space-y-2">
              <Label htmlFor="telegram-value">Telegram Chat ID</Label>
              <Input
                id="telegram-value"
                placeholder="123456789"
                value={telegramValue}
                onChange={(e) => setTelegramValue(e.target.value)}
              />
              <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
                <p className="font-semibold">Как получить Chat ID:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Откройте Telegram и найдите бота <strong>@userinfobot</strong></li>
                  <li>Нажмите <strong>Start</strong> или отправьте любое сообщение</li>
                  <li>Бот пришлёт ваш Chat ID (число, например: 123456789)</li>
                  <li>Скопируйте это число и вставьте в поле выше</li>
                </ol>
                <p className="text-gray-600 mt-2">
                  💡 Не забудьте добавить секрет TELEGRAM_BOT_TOKEN в настройках проекта
                </p>
              </div>
            </div>
          )}

          <Button onClick={handleSaveTelegram} className="w-full">
            <Icon name="Save" size={16} className="mr-2" />
            Сохранить настройки Telegram
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Icon name="AlertCircle" size={20} className="text-yellow-600 mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-yellow-900">Важно для работы уведомлений:</p>
              <ul className="list-disc list-inside space-y-1 text-yellow-800">
                <li>Для Email: добавьте секрет <strong>SENDGRID_API_KEY</strong> в настройках проекта</li>
                <li>Для Telegram: добавьте секрет <strong>TELEGRAM_BOT_TOKEN</strong> в настройках проекта</li>
                <li>Создайте бота через <strong>@BotFather</strong> в Telegram и получите токен</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsTab;
