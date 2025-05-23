
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { serviceTypes, ServiceType, QuestionType } from "@/config/contractTemplates";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface DynamicQuestionsProps {
  serviceType: ServiceType;
  responses: Record<string, any>;
  onResponseChange: (questionId: string, value: any) => void;
}

export function DynamicQuestions({ 
  serviceType, 
  responses, 
  onResponseChange 
}: DynamicQuestionsProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['scope']);

  // Get service type configuration
  const serviceConfig = serviceTypes.find(s => s.id === serviceType);
  if (!serviceConfig) return null;

  // Group questions by section
  const questionsBySection = serviceConfig.questions.reduce((sections, question) => {
    if (!sections[question.section]) {
      sections[question.section] = [];
    }
    sections[question.section].push(question);
    return sections;
  }, {} as Record<string, any[]>);

  // Get section title
  const getSectionTitle = (section: string): string => {
    switch(section) {
      case 'scope': return 'Escopo do Serviço';
      case 'payment': return 'Pagamento';
      case 'timeline': return 'Prazos e Cronograma';
      case 'deliverables': return 'Entregas e Resultados';
      case 'terms': return 'Termos e Condições';
      case 'rights': return 'Direitos e Propriedade Intelectual';
      case 'support': return 'Suporte e Pós-Entrega';
      default: return section.charAt(0).toUpperCase() + section.slice(1);
    }
  };

  // Check if a question should be shown based on dependencies
  const shouldShowQuestion = (question: any): boolean => {
    if (!question.dependsOn) return true;
    
    const dependsOn = question.dependsOn;
    const dependentValue = responses[dependsOn.question];
    
    return dependentValue === dependsOn.value;
  };

  // Render input based on question type
  const renderQuestionInput = (question: any) => {
    switch (question.type) {
      case 'text':
        return (
          <Input
            id={question.id}
            value={responses[question.id] || ''}
            onChange={(e) => onResponseChange(question.id, e.target.value)}
            placeholder={question.placeholder || ''}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            id={question.id}
            value={responses[question.id] || ''}
            onChange={(e) => onResponseChange(question.id, e.target.value)}
            placeholder={question.placeholder || ''}
            className="min-h-[100px]"
          />
        );
      
      case 'number':
        return (
          <Input
            id={question.id}
            type="number"
            value={responses[question.id] || ''}
            onChange={(e) => onResponseChange(question.id, Number(e.target.value))}
            placeholder={question.placeholder || ''}
          />
        );
      
      case 'select':
        return (
          <Select
            value={responses[question.id] || ''}
            onValueChange={(value) => onResponseChange(question.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={question.placeholder || 'Selecione uma opção'} />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'radio':
        return (
          <RadioGroup
            value={responses[question.id] || ''}
            onValueChange={(value) => onResponseChange(question.id, value)}
          >
            {question.options?.map((option: any) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case 'checkbox':
        if (question.options) {
          // Multi-checkbox (multiple selection)
          return (
            <div className="space-y-2">
              {question.options.map((option: any) => {
                const value = responses[question.id] || [];
                const isChecked = value.includes(option.value);
                
                return (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`${question.id}-${option.value}`} 
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onResponseChange(question.id, [...value, option.value]);
                        } else {
                          onResponseChange(question.id, value.filter((val: string) => val !== option.value));
                        }
                      }}
                    />
                    <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
                  </div>
                );
              })}
            </div>
          );
        } else {
          // Single checkbox (boolean)
          return (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={question.id} 
                checked={responses[question.id] || false}
                onCheckedChange={(checked) => onResponseChange(question.id, checked)}
              />
              <Label htmlFor={question.id}>Sim</Label>
            </div>
          );
        }
      
      case 'date':
        return (
          <Input
            id={question.id}
            type="date"
            value={responses[question.id] || ''}
            onChange={(e) => onResponseChange(question.id, e.target.value)}
          />
        );
        
      default:
        return null;
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    );
  };

  return (
    <div className="space-y-6">
      <Accordion type="multiple" value={expandedSections} className="w-full">
        {Object.keys(questionsBySection).map((section) => (
          <AccordionItem key={section} value={section}>
            <AccordionTrigger 
              onClick={() => toggleSection(section)}
              className="text-lg font-medium"
            >
              {getSectionTitle(section)}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {questionsBySection[section].map((question) => (
                  shouldShowQuestion(question) ? (
                    <div key={question.id} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={question.id} className="text-base font-medium">
                          {question.label}
                          {question.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        {question.hint && (
                          <div className="group relative">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            <div className="absolute z-50 hidden group-hover:block bg-secondary text-secondary-foreground p-2 rounded text-xs w-64 top-0 left-6">
                              {question.hint}
                            </div>
                          </div>
                        )}
                      </div>
                      {renderQuestionInput(question)}
                    </div>
                  ) : null
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
