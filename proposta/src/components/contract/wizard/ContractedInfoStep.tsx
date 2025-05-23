
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface ContractedData {
  name: string;
  document: string;
  address: string;
  email: string;
  phone: string;
  isCompany: boolean;
  legalRepresentative?: string;
}

interface ContractedInfoStepProps {
  value: ContractedData;
  onChange: (data: ContractedData) => void;
}

export function ContractedInfoStep({ value, onChange }: ContractedInfoStepProps) {
  const handleChange = (field: keyof ContractedData, fieldValue: string | boolean) => {
    onChange({
      ...value,
      [field]: fieldValue
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Preencha os dados do contratado (quem irá prestar o serviço).
      </p>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="is-company-contracted"
          checked={value.isCompany}
          onCheckedChange={(checked) => handleChange('isCompany', checked === true)}
        />
        <Label htmlFor="is-company-contracted" className="text-sm">
          É uma pessoa jurídica (empresa ou organização)
        </Label>
      </div>

      <div>
        <Label htmlFor="contracted-name">
          {value.isCompany ? 'Razão Social' : 'Nome Completo'} *
        </Label>
        <Input
          id="contracted-name"
          value={value.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder={value.isCompany ? "Empresa S.A." : "Nome completo do prestador de serviço"}
          required
        />
      </div>

      <div>
        <Label htmlFor="contracted-document">
          {value.isCompany ? 'CNPJ' : 'CPF'} *
        </Label>
        <Input
          id="contracted-document"
          value={value.document}
          onChange={(e) => handleChange('document', e.target.value)}
          placeholder={value.isCompany ? "00.000.000/0000-00" : "000.000.000-00"}
          required
        />
      </div>

      {value.isCompany && (
        <div>
          <Label htmlFor="contracted-representative">
            Nome do Representante Legal
          </Label>
          <Input
            id="contracted-representative"
            value={value.legalRepresentative || ''}
            onChange={(e) => handleChange('legalRepresentative', e.target.value)}
            placeholder="Nome do responsável legal pela empresa"
          />
        </div>
      )}

      <div>
        <Label htmlFor="contracted-address">Endereço</Label>
        <Input
          id="contracted-address"
          value={value.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="Endereço completo"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contracted-email">E-mail</Label>
          <Input
            id="contracted-email"
            type="email"
            value={value.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="email@exemplo.com"
          />
        </div>

        <div>
          <Label htmlFor="contracted-phone">Telefone</Label>
          <Input
            id="contracted-phone"
            value={value.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="(00) 00000-0000"
          />
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-4">
        (*) Campos obrigatórios
      </p>
    </div>
  );
}
