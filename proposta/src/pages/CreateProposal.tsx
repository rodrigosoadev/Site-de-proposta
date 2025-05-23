import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ProposalProvider, useProposals, ProposalItem } from "@/contexts/ProposalContext";
import { FileUploader } from "@/components/FileUploader";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle, Trash2, FileText, CheckCircle, ChevronLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

function generateId() {
  return `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function CreateProposalForm() {
  const { createProposal } = useProposals();
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<ProposalItem[]>([
    { id: generateId(), name: "", value: 0 }
  ]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [companyLogo, setCompanyLogo] = useState<string>(user?.companyLogo || "");
  const [includeContract, setIncludeContract] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalValue = items.reduce((acc, item) => acc + item.value, 0);

  const handleAddItem = () => {
    setItems([...items, { id: generateId(), name: "", value: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id: string, field: keyof ProposalItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleLogoUpload = (logoData: string) => {
    setCompanyLogo(logoData);
    if (user) {
      updateUserProfile({ companyLogo: logoData });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!clientName.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O nome do cliente é obrigatório.",
        variant: "destructive",
      });
      return;
    }
    
    if (items.some(item => !item.name.trim())) {
      toast({
        title: "Campos incompletos",
        description: "Todos os itens devem ter um nome.",
        variant: "destructive",
      });
      return;
    }
    
    if (!deliveryDate || !validUntil) {
      toast({
        title: "Campos obrigatórios",
        description: "Prazo de entrega e validade da proposta são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Creating proposal with contract:", includeContract);
      
      const proposal = await createProposal({
        clientName,
        description,
        items,
        total: totalValue,
        deliveryDate,
        validUntil,
        additionalNotes,
        includeContract
      });
      
      if (proposal) {
        toast({
          title: "Proposta criada",
          description: "Sua proposta foi criada com sucesso!",
        });
        
        console.log("Navigating to proposal view:", `/propostas/${proposal.id}`);
        navigate(`/propostas/${proposal.id}`);
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error creating proposal:", error);
      toast({
        title: "Erro ao criar proposta",
        description: "Ocorreu um erro ao criar a proposta. Tente novamente.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        className="flex items-center text-gray-600" 
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Voltar
      </Button>
      
      <form onSubmit={handleSubmit}>
        <div className="grid gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Informações básicas</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="clientName">Nome do cliente</Label>
                <Input
                  id="clientName"
                  placeholder="Ex: Empresa ABC"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descrição dos serviços</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva os serviços a serem prestados..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Logo da empresa</h2>
            <div className="space-y-2">
              <Label>Sua logo (opcional)</Label>
              <p className="text-sm text-gray-500 mb-4">
                A logo será exibida no topo da proposta. Recomendamos imagens no formato PNG ou JPG.
              </p>
              <FileUploader 
                onFileSelect={handleLogoUpload} 
                currentImage={companyLogo} 
                label="Logo da empresa"
              />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Itens da proposta</h2>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddItem}
                className="flex items-center"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar item
              </Button>
            </div>
            
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4">
                  <div className="col-span-7">
                    <Label htmlFor={`item-name-${index}`}>Item {index + 1}</Label>
                    <Input
                      id={`item-name-${index}`}
                      placeholder="Nome do item"
                      value={item.name}
                      onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="col-span-4">
                    <Label htmlFor={`item-value-${index}`}>Valor (R$)</Label>
                    <Input
                      id={`item-value-${index}`}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      value={item.value}
                      onChange={(e) => handleItemChange(item.id, 'value', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  
                  <div className="col-span-1 flex items-end">
                    <Button 
                      type="button"
                      variant="ghost" 
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-500 p-2 h-10"
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end border-t border-gray-200 pt-4 mt-4">
                <div className="text-right">
                  <span className="text-sm text-gray-500">Valor total:</span>
                  <p className="text-xl font-bold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(totalValue)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Prazos e observações</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deliveryDate">Prazo de entrega</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="validUntil">Validade da proposta</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="additionalNotes">Observações adicionais</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Informações complementares, termos e condições..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeContract" 
                  checked={includeContract}
                  onCheckedChange={(checked) => setIncludeContract(checked === true)}
                />
                <Label 
                  htmlFor="includeContract" 
                  className="cursor-pointer"
                >
                  Incluir contrato de prestação de serviços
                </Label>
              </div>
            </div>
          </Card>
          
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex items-center">
              {isSubmitting ? (
                "Gerando proposta..."
              ) : (
                <>
                  <FileText className="h-5 w-5 mr-2" />
                  Gerar proposta
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CreateProposal() {
  return (
    <Layout title="Nova Proposta">
      <CreateProposalForm />
    </Layout>
  );
}
