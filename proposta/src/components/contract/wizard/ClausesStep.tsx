
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ClausesData {
  confidentiality: boolean;
  personalData: boolean;
  intellectualProperty: boolean;
  insurance: boolean;
}

interface ClausesStepProps {
  value: ClausesData;
  onChange: (data: ClausesData) => void;
}

export function ClausesStep({ value, onChange }: ClausesStepProps) {
  const handleChange = (field: keyof ClausesData, checked: boolean) => {
    onChange({
      ...value,
      [field]: checked
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Selecione as cláusulas adicionais que você deseja incluir no contrato.
      </p>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox 
            id="confidentiality"
            checked={value.confidentiality}
            onCheckedChange={(checked) => handleChange('confidentiality', checked === true)}
          />
          <div>
            <Label htmlFor="confidentiality" className="font-medium">
              Cláusula de Confidencialidade
            </Label>
            <p className="text-sm text-muted-foreground">
              As partes se comprometem a manter sigilo sobre informações confidenciais compartilhadas durante a prestação dos serviços.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox 
            id="personalData"
            checked={value.personalData}
            onCheckedChange={(checked) => handleChange('personalData', checked === true)}
          />
          <div>
            <Label htmlFor="personalData" className="font-medium">
              Proteção de Dados Pessoais (LGPD)
            </Label>
            <p className="text-sm text-muted-foreground">
              Inclui termos sobre o tratamento de dados pessoais em conformidade com a Lei Geral de Proteção de Dados.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox 
            id="intellectualProperty"
            checked={value.intellectualProperty}
            onCheckedChange={(checked) => handleChange('intellectualProperty', checked === true)}
          />
          <div>
            <Label htmlFor="intellectualProperty" className="font-medium">
              Cessão de Propriedade Intelectual
            </Label>
            <p className="text-sm text-muted-foreground">
              Define que os direitos de propriedade intelectual dos trabalhos desenvolvidos serão cedidos ao contratante após o pagamento.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox 
            id="insurance"
            checked={value.insurance}
            onCheckedChange={(checked) => handleChange('insurance', checked === true)}
          />
          <div>
            <Label htmlFor="insurance" className="font-medium">
              Seguro e Responsabilidade Civil
            </Label>
            <p className="text-sm text-muted-foreground">
              Estabelece responsabilidades e obrigações relacionadas a seguros, acidentes e danos durante a prestação dos serviços.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
