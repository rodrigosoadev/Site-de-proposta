
import { ContractFormData } from "./ContractWizard";
import { contractTemplates } from "@/config/contractTemplates";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ContractPreviewProps {
  data: ContractFormData;
}

export default function ContractPreview({ data }: ContractPreviewProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  const getContractTitle = () => {
    if (!data.serviceType) return 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS';
    
    if (data.serviceType === 'other' && data.serviceTypeCustomName) {
      return `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE ${data.serviceTypeCustomName.toUpperCase()}`;
    }
    
    return contractTemplates[data.serviceType]?.name.toUpperCase() || 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS';
  };

  return (
    <Card className="p-8 bg-white">
      <div className="prose max-w-none">
        <h1 className="text-center text-xl font-bold mb-6">{getContractTitle()}</h1>
        
        <p className="mb-6">
          Pelo presente instrumento particular, de um lado:
        </p>
        
        <p className="mb-6">
          <strong>CONTRATANTE:</strong> {data.contractor.name}, 
          {data.contractor.isCompany ? ' pessoa jurídica inscrita no CNPJ' : ' pessoa física inscrita no CPF'} 
          sob o nº {data.contractor.document}
          {data.contractor.address && `, com endereço em ${data.contractor.address}`}
          {data.contractor.isCompany && data.contractor.legalRepresentative && 
            `, neste ato representado por ${data.contractor.legalRepresentative}`},
          {data.contractor.email && ` e-mail: ${data.contractor.email}`}
          {data.contractor.phone && `, telefone: ${data.contractor.phone}`};
        </p>
        
        <p className="mb-6">
          <strong>CONTRATADO:</strong> {data.contracted.name}, 
          {data.contracted.isCompany ? ' pessoa jurídica inscrita no CNPJ' : ' pessoa física inscrita no CPF'} 
          sob o nº {data.contracted.document}
          {data.contracted.address && `, com endereço em ${data.contracted.address}`}
          {data.contracted.isCompany && data.contracted.legalRepresentative && 
            `, neste ato representado por ${data.contracted.legalRepresentative}`},
          {data.contracted.email && ` e-mail: ${data.contracted.email}`}
          {data.contracted.phone && `, telefone: ${data.contracted.phone}`};
        </p>
        
        <p className="mb-6">
          As partes acima identificadas resolvem firmar o presente CONTRATO DE PRESTAÇÃO DE SERVIÇOS, 
          que se regerá pelas cláusulas a seguir e, no que couber, pela legislação aplicável.
        </p>
        
        <h2 className="text-lg font-bold mt-6 mb-2">CLÁUSULA PRIMEIRA – DO OBJETO</h2>
        <p className="mb-4">
          {data.serviceScope || "O presente contrato tem como objeto a prestação de serviços conforme detalhado no anexo."}
        </p>
        
        <h2 className="text-lg font-bold mt-6 mb-2">CLÁUSULA SEGUNDA – DO VALOR E FORMA DE PAGAMENTO</h2>
        <p className="mb-4">
          O valor total dos serviços será de R$ {data.payment.amount.toFixed(2)} 
          ({data.payment.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} por extenso), 
          a ser pago através de {(() => {
            switch (data.payment.method) {
              case 'pix': return 'PIX';
              case 'transfer': return 'transferência bancária';
              case 'credit-card': return 'cartão de crédito';
              case 'installments': return `${data.payment.installments} parcelas`;
              default: return data.payment.method;
            }
          })()}.
          
          {data.payment.conditions && ` ${data.payment.conditions}`}
        </p>
        
        {data.payment.lateFees && (
          <p className="mb-4">
            Em caso de atraso nos pagamentos: {data.payment.lateFees}
          </p>
        )}
        
        <h2 className="text-lg font-bold mt-6 mb-2">CLÁUSULA TERCEIRA – DOS PRAZOS</h2>
        <p className="mb-4">
          A prestação dos serviços terá início em {formatDate(data.timeline.startDate)} e 
          término previsto para {formatDate(data.timeline.endDate)}.
        </p>
        
        {data.timeline.milestones && data.timeline.milestones.length > 0 && (
          <div className="mb-4">
            <p>Etapas intermediárias:</p>
            <ul>
              {data.timeline.milestones.map((milestone, index) => (
                <li key={index}>
                  {formatDate(milestone.date)}: {milestone.description}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <h2 className="text-lg font-bold mt-6 mb-2">CLÁUSULA QUARTA – DAS OBRIGAÇÕES DAS PARTES</h2>
        
        <h3 className="font-semibold mt-4 mb-2">4.1 Obrigações do CONTRATANTE</h3>
        <ul className="mb-4">
          {data.serviceType && contractTemplates[data.serviceType]?.clauses.obligations.contractor.map((item, index) => (
            <li key={index}>{item};</li>
          ))}
          <li>Fornecer as informações necessárias para a execução dos serviços;</li>
          <li>Efetuar os pagamentos conforme acordado;</li>
        </ul>
        
        <h3 className="font-semibold mt-4 mb-2">4.2 Obrigações do CONTRATADO</h3>
        <ul className="mb-4">
          {data.serviceType && contractTemplates[data.serviceType]?.clauses.obligations.contracted.map((item, index) => (
            <li key={index}>{item};</li>
          ))}
          <li>Executar os serviços conforme estabelecido neste contrato;</li>
          <li>Corrigir eventuais falhas identificadas pelo CONTRATANTE;</li>
        </ul>
        
        {/* Conditional clauses */}
        {data.clauses.confidentiality && (
          <>
            <h2 className="text-lg font-bold mt-6 mb-2">CLÁUSULA DE CONFIDENCIALIDADE</h2>
            <p className="mb-4">
              As partes se obrigam a manter o mais absoluto sigilo com relação a quaisquer dados, 
              informações, materiais, produtos, sistemas, técnicas, estratégias, métodos de operação, 
              pormenores, inovações, segredos comerciais, marcas, criações, especificações técnicas e 
              comerciais da outra parte, entre outros, a que tenham acesso em razão do objeto deste contrato, 
              não podendo, sob qualquer pretexto, divulgar, revelar, reproduzir, utilizar ou deles dar 
              conhecimento a terceiros, sem a expressa autorização da outra parte.
            </p>
          </>
        )}
        
        {data.clauses.personalData && (
          <>
            <h2 className="text-lg font-bold mt-6 mb-2">CLÁUSULA DE PROTEÇÃO DE DADOS</h2>
            <p className="mb-4">
              As partes se comprometem a cumprir toda a legislação aplicável sobre segurança da informação, 
              privacidade e proteção de dados, incluindo a Constituição Federal, o Código de Defesa do Consumidor, 
              o Código Civil, o Marco Civil da Internet (Lei Federal n. 12.965/2014), seu decreto regulamentador 
              (Decreto 8.771/2016), a Lei Geral de Proteção de Dados Pessoais (Lei Federal n. 13.709/2018), 
              e demais normas setoriais ou gerais sobre o tema.
            </p>
          </>
        )}
        
        {data.clauses.intellectualProperty && (
          <>
            <h2 className="text-lg font-bold mt-6 mb-2">CLÁUSULA DE PROPRIEDADE INTELECTUAL</h2>
            <p className="mb-4">
              Todos os direitos de propriedade intelectual decorrentes dos serviços prestados pelo CONTRATADO, 
              incluindo, mas não se limitando a, patentes, direitos autorais, marcas registradas, segredos comerciais, 
              desenhos industriais, desenvolvimentos, projetos, relatórios ou documentação, serão transferidos 
              ao CONTRATANTE após o pagamento integral dos valores previstos neste contrato.
            </p>
          </>
        )}
        
        {data.clauses.insurance && (
          <>
            <h2 className="text-lg font-bold mt-6 mb-2">CLÁUSULA DE SEGURO E RESPONSABILIDADE CIVIL</h2>
            <p className="mb-4">
              O CONTRATADO se compromete a contratar e manter, durante toda a vigência do contrato, 
              seguro de responsabilidade civil e profissional, com cobertura suficiente para fazer frente 
              a eventuais danos materiais e físicos causados ao CONTRATANTE ou a terceiros durante a 
              execução dos serviços objeto deste contrato.
            </p>
          </>
        )}
        
        <h2 className="text-lg font-bold mt-6 mb-2">CLÁUSULA DE RESCISÃO</h2>
        <p className="mb-4">
          Este contrato poderá ser rescindido mediante notificação prévia de 30 dias por qualquer uma das partes, 
          ou imediatamente em caso de descumprimento grave das obrigações estabelecidas.
        </p>
        
        <h2 className="text-lg font-bold mt-6 mb-2">CLÁUSULA DE FORO</h2>
        <p className="mb-4">
          Fica eleito o foro da Comarca de {data.jurisdiction} para dirimir quaisquer dúvidas 
          ou controvérsias oriundas do presente contrato, com renúncia expressa a qualquer outro, 
          por mais privilegiado que seja.
        </p>
        
        <p className="mt-8 mb-4">
          E, por estarem assim justas e contratadas, as partes assinam o presente instrumento em 2 (duas) 
          vias de igual teor e forma, na presença das testemunhas abaixo.
        </p>
        
        <div className="mt-12 mb-8">
          <p className="text-center">{data.jurisdiction}, ____ de __________________ de {new Date().getFullYear()}</p>
        </div>
        
        <div className="flex flex-wrap justify-between mt-16">
          <div className="w-full md:w-5/12 text-center mb-8">
            <div className="border-t border-black pt-2">
              <strong>CONTRATANTE</strong><br />
              {data.contractor.name}
            </div>
          </div>
          
          <div className="w-full md:w-5/12 text-center mb-8">
            <div className="border-t border-black pt-2">
              <strong>CONTRATADO</strong><br />
              {data.contracted.name}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-between mt-16">
          <div className="w-full md:w-5/12 text-center mb-8">
            <div className="border-t border-black pt-2">
              <strong>TESTEMUNHA 1</strong><br />
              Nome:<br />
              CPF:
            </div>
          </div>
          
          <div className="w-full md:w-5/12 text-center mb-8">
            <div className="border-t border-black pt-2">
              <strong>TESTEMUNHA 2</strong><br />
              Nome:<br />
              CPF:
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
