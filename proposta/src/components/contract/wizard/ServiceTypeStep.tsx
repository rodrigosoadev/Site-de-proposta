
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { serviceTypes, ServiceType } from "@/config/contractTemplates";
import { useToast } from "@/hooks/use-toast";
import { 
  Code, 
  Palette, 
  Globe, 
  FileText, 
  Pencil, 
  Camera,
  GraduationCap,
  Users,
  Building,
  FileEdit
} from "lucide-react";

interface ServiceTypeStepProps {
  value: ServiceType | null;
  customName?: string;
  onChange: (type: ServiceType, customName?: string) => void;
}

export function ServiceTypeStep({ value, customName, onChange }: ServiceTypeStepProps) {
  const { toast } = useToast();

  const getIconForType = (iconName: string) => {
    switch (iconName) {
      case 'development':
        return <Code className="w-8 h-8" />;
      case 'design':
        return <Palette className="w-8 h-8" />;
      case 'marketing':
        return <Globe className="w-8 h-8" />;
      case 'consulting':
        return <Users className="w-8 h-8" />;
      case 'content':
        return <FileText className="w-8 h-8" />;
      case 'writing':
        return <Pencil className="w-8 h-8" />;
      case 'photo':
        return <Camera className="w-8 h-8" />;
      case 'education':
        return <GraduationCap className="w-8 h-8" />;
      case 'engineering':
        return <Building className="w-8 h-8" />;
      case 'other':
        return <FileEdit className="w-8 h-8" />;
      default:
        return null;
    }
  };

  const handleSelectType = (type: ServiceType) => {
    onChange(type);
    toast({ 
      title: "Tipo de serviço selecionado", 
      description: `Perguntas específicas para ${getServiceTypeLabel(type)} serão exibidas.` 
    });
  };

  const getServiceTypeLabel = (type: ServiceType): string => {
    const serviceType = serviceTypes.find(s => s.id === type);
    return serviceType ? serviceType.label : 'Outro';
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="block text-base mb-3">Qual é o tipo de serviço que será prestado neste contrato?</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Escolha o tipo de serviço para que possamos personalizar o contrato com perguntas específicas e cláusulas relevantes.
        </p>
        
        <ToggleGroup 
          type="single" 
          value={value || ''}
          onValueChange={(val) => val && handleSelectType(val as ServiceType)}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {serviceTypes.map((type) => (
            <ToggleGroupItem 
              key={type.id} 
              value={type.id}
              className="flex flex-col items-center p-4 h-auto aspect-square"
              aria-label={type.label}
              data-state={value === type.id ? "on" : "off"}
            >
              <div className="text-3xl mb-3 text-primary">
                {getIconForType(type.icon)}
              </div>
              <span className="text-sm text-center font-medium">{type.label}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {value === 'other' && (
        <div>
          <Label htmlFor="custom-type">Especifique o tipo de serviço:</Label>
          <Input 
            id="custom-type"
            value={customName || ''}
            onChange={(e) => onChange('other', e.target.value)}
            placeholder="Ex: Consultoria Financeira"
          />
        </div>
      )}
    </div>
  );
}
