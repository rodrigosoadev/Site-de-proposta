
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaymentData {
  amount: number;
  method: string;
  installments: number;
  conditions: string;
  lateFees?: string;
}

interface PaymentInfoStepProps {
  value: PaymentData;
  onChange: (data: PaymentData) => void;
}

export function PaymentInfoStep({ value, onChange }: PaymentInfoStepProps) {
  const handleChange = (field: keyof PaymentData, fieldValue: any) => {
    onChange({
      ...value,
      [field]: fieldValue
    });
  };

  // Helper for number inputs
  const handleNumberChange = (field: keyof PaymentData, value: string) => {
    const numValue = parseFloat(value) || 0;
    handleChange(field, numValue);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="amount">Valor Total (R$) *</Label>
        <Input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          value={value.amount || ''}
          onChange={(e) => handleNumberChange('amount', e.target.value)}
          placeholder="0,00"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="payment-method">Forma de Pagamento</Label>
          <Select 
            value={value.method} 
            onValueChange={(val) => handleChange('method', val)}
          >
            <SelectTrigger id="payment-method">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pix">Pix</SelectItem>
              <SelectItem value="transfer">Transferência Bancária</SelectItem>
              <SelectItem value="credit-card">Cartão de Crédito</SelectItem>
              <SelectItem value="installments">Parcelado</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {value.method === 'installments' && (
          <div>
            <Label htmlFor="installments">Número de Parcelas</Label>
            <Input
              id="installments"
              type="number"
              min="1"
              step="1"
              value={value.installments || 1}
              onChange={(e) => handleNumberChange('installments', e.target.value)}
            />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="payment-conditions">Condições de Pagamento</Label>
        <Textarea
          id="payment-conditions"
          value={value.conditions}
          onChange={(e) => handleChange('conditions', e.target.value)}
          placeholder="Exemplo: 50% no início dos trabalhos e 50% na entrega final"
        />
      </div>

      <div>
        <Label htmlFor="late-fees">Penalidades por Atraso (opcional)</Label>
        <Textarea
          id="late-fees"
          value={value.lateFees || ''}
          onChange={(e) => handleChange('lateFees', e.target.value)}
          placeholder="Exemplo: Multa de 2% e juros de 1% ao mês"
        />
      </div>
    </div>
  );
}
