import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface Result {
  exam: string;
  averageScore: number;
  successRate: number;
}

interface Testimonial {
  name: string;
  text: string;
  score: number;
  subject: string;
}

interface ResultsTestimonialsSectionProps {
  results: Result[];
  testimonials: Testimonial[];
}

const ResultsTestimonialsSection: React.FC<
  ResultsTestimonialsSectionProps
> = ({ results, testimonials }) => {
  return (
    <>
      {/* Results Section */}
      <section id="results" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-4">
              Результаты наших учеников
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Высокие баллы на экзаменах — результат качественной подготовки
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {results.map((result, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{result.exam}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                      <span className="text-sm font-medium">
                        Средний балл:
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        {result.averageScore}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-secondary/5 rounded-lg">
                      <span className="text-sm font-medium">
                        Успешная сдача:
                      </span>
                      <span className="text-2xl font-bold text-secondary">
                        {result.successRate}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-4">
              Отзывы учеников
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Что говорят о нас наши выпускники
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-shadow relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full" />
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {testimonial.name}
                      </CardTitle>
                      <CardDescription>{testimonial.subject}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {testimonial.text}
                  </p>
                  <Badge className="text-lg px-4 py-1">
                    <Icon name="Trophy" size={16} className="mr-1 inline" />
                    {testimonial.score} баллов
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ResultsTestimonialsSection;
