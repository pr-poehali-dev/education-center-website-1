import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface ContactsFooterProps {
  onBookingClick: () => void;
}

const ContactsFooter: React.FC<ContactsFooterProps> = ({ onBookingClick }) => {
  return (
    <>
      {/* Contacts Section */}
      <section id="contacts" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-4">
              Контакты
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Свяжитесь с нами удобным способом
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Phone" size={24} className="text-primary" />
                </div>
                <CardTitle>Телефон</CardTitle>
                <CardDescription>Позвоните нам</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">+7 (999) 123-45-67</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Пн-Вс: 9:00 - 21:00
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Mail" size={24} className="text-secondary" />
                </div>
                <CardTitle>Email</CardTitle>
                <CardDescription>Напишите нам</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">info@educentr.ru</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Ответим в течение 24 часов
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="MapPin" size={24} className="text-accent" />
                </div>
                <CardTitle>Адрес</CardTitle>
                <CardDescription>Приходите к нам</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  ул. Ленина, 15, оф. 301
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Центр города
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Готовы начать обучение?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Запишитесь на бесплатное пробное занятие и оцените качество
                  нашего обучения
                </p>
                <Button size="lg" className="text-lg px-8" onClick={onBookingClick}>
                  Записаться сейчас
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="GraduationCap" size={32} />
                <span className="text-xl font-heading font-bold">
                  Образовательный центр
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Качественная подготовка к ОГЭ и ЕГЭ с 2008 года
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Навигация</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#home"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Главная
                  </a>
                </li>
                <li>
                  <a
                    href="#teachers"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Преподаватели
                  </a>
                </li>
                <li>
                  <a
                    href="#results"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Результаты
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Предметы</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Математика</li>
                <li>Русский язык</li>
                <li>Физика</li>
                <li>Обществознание</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>+7 (999) 123-45-67</li>
                <li>info@educentr.ru</li>
                <li>ул. Ленина, 15, оф. 301</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 Образовательный центр. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ContactsFooter;
