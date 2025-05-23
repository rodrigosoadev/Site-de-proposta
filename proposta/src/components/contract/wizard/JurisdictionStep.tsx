
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JurisdictionStepProps {
  value: string;
  onChange: (value: string) => void;
}

const popularCities = [
  "São Paulo - SP",
  "Rio de Janeiro - RJ",
  "Brasília - DF",
  "Belo Horizonte - MG",
  "Curitiba - PR",
  "Porto Alegre - RS",
  "Salvador - BA",
  "Recife - PE",
  "Fortaleza - CE",
  "Belém - PA"
];

export function JurisdictionStep({ value, onChange }: JurisdictionStepProps) {
  const [customCity, setCustomCity] = useState(false);

  const handleSelectCity = (city: string) => {
    if (city === "custom") {
      setCustomCity(true);
    } else {
      setCustomCity(false);
      onChange(city);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="jurisdiction">Local de jurisdição (Foro) *</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Em caso de disputa, qual será o foro competente para resolver o conflito?
        </p>

        <Select 
          value={customCity ? "custom" : value} 
          onValueChange={handleSelectCity}
        >
          <SelectTrigger id="jurisdiction">
            <SelectValue placeholder="Selecione uma cidade" />
          </SelectTrigger>
          <SelectContent>
            {popularCities.map(city => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
            <SelectItem value="custom">Outra cidade...</SelectItem>
          </SelectContent>
        </Select>

        {customCity && (
          <Input 
            placeholder="Digite a cidade e estado (Ex: Campinas - SP)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2"
          />
        )}
      </div>

      <div>
        <h3 className="font-medium mb-2">Condições para rescisão do contrato</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Por padrão, o contrato pode ser rescindido mediante notificação prévia de 30 dias por qualquer uma das partes, 
          ou imediatamente em caso de descumprimento grave das obrigações estabelecidas.
        </p>
      </div>
    </div>
  );
}
