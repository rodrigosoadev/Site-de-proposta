
// Export types first
export type ServiceType = 
  | 'development'
  | 'design'
  | 'marketing'
  | 'consulting'
  | 'writing'
  | 'photo'
  | 'education'
  | 'engineering'
  | 'content'
  | 'other';

export type QuestionType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date';

// Define the type for service type configurations
type ServiceTypeConfig = {
  id: ServiceType;
  label: string;
  icon: string;
  questions: QuestionConfig[];
  clauses: {
    scope: string;
    payment?: string;
    intellectual?: string;
    confidentiality?: string;
    liability?: string;
  };
};

// Define the type for question configurations
type QuestionConfig = {
  id: string;
  type: QuestionType;
  label: string;
  placeholder?: string;
  hint?: string;
  section: 'scope' | 'payment' | 'timeline' | 'deliverables' | 'terms' | 'rights' | 'support';
  options?: { value: string; label: string }[];
  required?: boolean;
  dependsOn?: {
    question: string;
    value: string | boolean;
  };
};

// Define contract templates
const templates = {
  development: {
    name: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE DESENVOLVIMENTO WEB/SOFTWARE',
    clauses: {
      scope: `O objeto do presente contrato é o desenvolvimento de [TIPO_DE_PROJETO] utilizando [TECNOLOGIAS], conforme especificações detalhadas no Anexo I.`,
      obligations: {
        contractor: [
          'Fornecer informações e conteúdos necessários em tempo hábil',
          'Realizar homologações dentro dos prazos estipulados',
          'Fornecer acesso aos sistemas necessários para implementação'
        ],
        contracted: [
          'Desenvolver o projeto conforme as especificações acordadas',
          'Manter o código-fonte organizado e documentado',
          'Realizar testes de qualidade antes da entrega'
        ]
      }
    }
  },
  design: {
    name: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE DESIGN GRÁFICO',
    clauses: {
      scope: `O objeto do presente contrato é a prestação de serviços de design gráfico para criação de [ITENS_DESIGN], conforme especificações detalhadas no briefing anexo a este contrato.`,
      obligations: {
        contractor: [
          'Fornecer briefing detalhado e referências visuais',
          'Realizar aprovações dentro dos prazos estipulados',
          'Fornecer conteúdo textual a ser incluído nos designs'
        ],
        contracted: [
          'Criar designs alinhados ao briefing fornecido',
          'Entregar os arquivos nos formatos especificados',
          'Realizar até o número acordado de revisões'
        ]
      }
    }
  },
  marketing: {
    name: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE MARKETING DIGITAL',
    clauses: {
      scope: `O objeto do presente contrato é a prestação de serviços de marketing digital, incluindo [CANAIS], pelo período de [PERÍODO].`,
      obligations: {
        contractor: [
          'Fornecer acesso às contas de mídia social',
          'Aprovar conteúdos dentro dos prazos estipulados',
          'Fornecer informações sobre o público-alvo'
        ],
        contracted: [
          'Criar e implementar estratégias de marketing digital',
          'Fornecer relatórios de performance periódicos',
          'Otimizar campanhas conforme resultados'
        ]
      }
    }
  },
  consulting: {
    name: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CONSULTORIA',
    clauses: {
      scope: `O objeto do presente contrato é a prestação de serviços de consultoria [NATUREZA_CONSULTORIA], pelo período de [PERÍODO].`,
      obligations: {
        contractor: [
          'Fornecer informações necessárias para a consultoria',
          'Disponibilizar equipe para reuniões e workshops',
          'Implementar as recomendações acordadas'
        ],
        contracted: [
          'Realizar análises aprofundadas conforme escopo',
          'Entregar relatórios e recomendações',
          'Estar disponível para esclarecimentos'
        ]
      }
    }
  },
  writing: {
    name: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE REDAÇÃO E CONTEÚDO',
    clauses: {
      scope: `O objeto do presente contrato é a prestação de serviços de produção de conteúdo, incluindo [TIPO_CONTEÚDO], na quantidade de [QUANTIDADE_PEÇAS].`,
      obligations: {
        contractor: [
          'Fornecer briefing detalhado sobre o conteúdo',
          'Realizar aprovações dentro dos prazos estipulados',
          'Fornecer informações técnicas quando necessário'
        ],
        contracted: [
          'Produzir conteúdo original e livre de plágio',
          'Entregar os textos nos prazos acordados',
          'Realizar revisões conforme feedback'
        ]
      }
    }
  },
  photo: {
    name: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE FOTOGRAFIA/VÍDEO',
    clauses: {
      scope: `O objeto do presente contrato é a prestação de serviços de [TIPO_SERVIÇO], a ser realizado em [LOCAL_PRODUÇÃO].`,
      obligations: {
        contractor: [
          'Disponibilizar locação para as sessões',
          'Fornecer briefing visual e referências',
          'Realizar aprovações dentro dos prazos estipulados'
        ],
        contracted: [
          'Realizar a produção com equipamentos adequados',
          'Entregar material editado conforme acordado',
          'Garantir a qualidade técnica das imagens/vídeos'
        ]
      }
    }
  },
  education: {
    name: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE EDUCAÇÃO/TREINAMENTO',
    clauses: {
      scope: `O objeto do presente contrato é a prestação de serviços de treinamento sobre [TEMA_TREINAMENTO], na modalidade [MODALIDADE].`,
      obligations: {
        contractor: [
          'Garantir a presença dos participantes',
          'Fornecer infraestrutura adequada (caso aplicável)',
          'Fornecer informações sobre o nível de conhecimento dos participantes'
        ],
        contracted: [
          'Preparar material didático adequado',
          'Ministrar o treinamento conforme planejado',
          'Avaliar o aprendizado dos participantes'
        ]
      }
    }
  },
  engineering: {
    name: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE ENGENHARIA/CONSTRUÇÃO',
    clauses: {
      scope: `O objeto do presente contrato é a prestação de serviços de [TIPO_SERVIÇO_ENGENHARIA], conforme projeto anexo a este contrato.`,
      obligations: {
        contractor: [
          'Fornecer acesso ao local dos serviços',
          'Aprovar etapas conforme cronograma',
          'Fornecer documentação necessária'
        ],
        contracted: [
          'Executar os serviços conforme projeto e normas técnicas',
          'Utilizar materiais de qualidade',
          'Cumprir prazos e cronograma estabelecido'
        ]
      }
    }
  },
  content: {
    name: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE PRODUÇÃO DE CONTEÚDO',
    clauses: {
      scope: `O objeto do presente contrato é a prestação de serviços de produção de conteúdo para [FINALIDADE_CONTEÚDO].`,
      obligations: {
        contractor: [
          'Fornecer informações e diretrizes de marca',
          'Aprovar conteúdo dentro dos prazos estipulados',
          'Fornecer acesso a materiais necessários'
        ],
        contracted: [
          'Criar conteúdo original alinhado às diretrizes',
          'Entregar conforme cronograma estabelecido',
          'Realizar ajustes conforme feedback'
        ]
      }
    }
  },
  other: {
    name: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS',
    clauses: {
      scope: `O objeto do presente contrato é a prestação de serviços de [TIPO_SERVIÇO], conforme especificações detalhadas no Anexo I deste contrato.`,
      obligations: {
        contractor: [
          'Fornecer informações necessárias para execução dos serviços',
          'Realizar pagamentos conforme acordado',
          'Aprovar entregas dentro dos prazos estipulados'
        ],
        contracted: [
          'Executar os serviços conforme especificações',
          'Manter comunicação clara durante todo o projeto',
          'Cumprir os prazos estabelecidos'
        ]
      }
    }
  }
};

// Now export the service types configuration
export const serviceTypes: ServiceTypeConfig[] = [
  {
    id: 'development',
    label: 'Desenvolvimento Web/Software',
    icon: 'development',
    questions: [
      {
        id: 'dev_scope',
        type: 'select',
        label: 'Qual o escopo exato do desenvolvimento?',
        placeholder: 'Selecione o tipo de projeto',
        section: 'scope',
        options: [
          { value: 'website', label: 'Site Completo' },
          { value: 'landing', label: 'Landing Page' },
          { value: 'ecommerce', label: 'E-commerce' },
          { value: 'webapp', label: 'Aplicação Web' },
          { value: 'mobile', label: 'Aplicativo Móvel' },
          { value: 'desktop', label: 'Software Desktop' },
          { value: 'api', label: 'API/Backend' },
        ],
        required: true
      },
      {
        id: 'dev_tech',
        type: 'textarea',
        label: 'Quais tecnologias específicas serão utilizadas?',
        placeholder: 'Ex: React, Node.js, MongoDB, Flutter...',
        section: 'scope',
        hint: 'Liste todas as principais tecnologias, frameworks e linguagens que serão utilizadas no projeto.',
        required: true
      },
      {
        id: 'dev_content_resp',
        type: 'radio',
        label: 'Quem será responsável por fornecer o conteúdo do projeto?',
        section: 'scope',
        options: [
          { value: 'client', label: 'Cliente' },
          { value: 'contractor', label: 'Contratado' },
          { value: 'shared', label: 'Responsabilidade compartilhada' }
        ],
        required: true
      },
      {
        id: 'dev_revisions',
        type: 'number',
        label: 'Quantas revisões/alterações estão incluídas no preço base?',
        section: 'scope',
        hint: 'Quantas rodadas de alterações o cliente pode solicitar sem custos adicionais.',
        required: true
      },
      {
        id: 'dev_homolog',
        type: 'textarea',
        label: 'Qual o processo de homologação e testes antes da entrega?',
        section: 'deliverables',
        hint: 'Descreva como serão realizados os testes e aprovações antes da entrega final.',
      },
      {
        id: 'dev_deploy',
        type: 'textarea',
        label: 'Como será o processo de deploy/publicação?',
        section: 'deliverables',
        hint: 'Quem será responsável pela publicação e como será realizada.',
      },
      {
        id: 'dev_integration',
        type: 'checkbox',
        label: 'Existe a necessidade de integração com sistemas de terceiros?',
        section: 'scope',
      },
      {
        id: 'dev_integration_details',
        type: 'textarea',
        label: 'Quais sistemas serão integrados e como?',
        section: 'scope',
        dependsOn: {
          question: 'dev_integration',
          value: true
        }
      },
      {
        id: 'dev_intellectual',
        type: 'radio',
        label: 'Quem deterá os direitos de propriedade intelectual do código?',
        section: 'rights',
        options: [
          { value: 'client', label: 'Cliente' },
          { value: 'contractor', label: 'Contratado' },
          { value: 'shared', label: 'Compartilhado' }
        ],
        required: true
      },
      {
        id: 'dev_documentation',
        type: 'checkbox',
        label: 'Será fornecida documentação técnica?',
        section: 'deliverables',
      },
      {
        id: 'dev_training',
        type: 'checkbox',
        label: 'Está incluído treinamento para uso do sistema?',
        section: 'deliverables',
      },
      {
        id: 'dev_training_details',
        type: 'textarea',
        label: 'Detalhes do treinamento a ser oferecido',
        section: 'deliverables',
        dependsOn: {
          question: 'dev_training',
          value: true
        }
      },
      {
        id: 'dev_support',
        type: 'radio',
        label: 'Haverá período de suporte após a entrega?',
        section: 'support',
        options: [
          { value: 'no', label: 'Não' },
          { value: 'yes_limited', label: 'Sim, por período limitado' },
          { value: 'yes_unlimited', label: 'Sim, por período ilimitado' }
        ],
        required: true
      },
      {
        id: 'dev_support_period',
        type: 'text',
        label: 'Por quanto tempo será o suporte?',
        section: 'support',
        dependsOn: {
          question: 'dev_support',
          value: 'yes_limited'
        }
      },
      {
        id: 'dev_bugs',
        type: 'textarea',
        label: 'Qual a política para correção de bugs após a entrega?',
        section: 'support',
        hint: 'Por quanto tempo bugs serão corrigidos gratuitamente e como serão tratados.'
      },
      {
        id: 'dev_maintenance',
        type: 'radio',
        label: 'Haverá necessidade de manutenção contínua após a entrega?',
        section: 'support',
        options: [
          { value: 'no', label: 'Não' },
          { value: 'yes', label: 'Sim' }
        ]
      },
      {
        id: 'dev_maintenance_details',
        type: 'textarea',
        label: 'Detalhes sobre a manutenção (frequência, escopo)',
        section: 'support',
        dependsOn: {
          question: 'dev_maintenance',
          value: 'yes'
        }
      },
      {
        id: 'dev_security',
        type: 'checkbox',
        label: 'Existem requisitos específicos de segurança ou conformidade legal?',
        section: 'terms',
      },
      {
        id: 'dev_security_details',
        type: 'textarea',
        label: 'Detalhes sobre os requisitos de segurança (LGPD, GDPR, etc.)',
        section: 'terms',
        dependsOn: {
          question: 'dev_security',
          value: true
        }
      }
    ],
    clauses: {
      scope: `O objeto do presente contrato é o desenvolvimento de [TIPO_DE_PROJETO] utilizando [TECNOLOGIAS], conforme especificações detalhadas no Anexo I. 

O desenvolvimento incluirá [NÚMERO_DE_REVISÕES] rodadas de revisão sem custo adicional. Revisões adicionais serão cobradas conforme tabela de valores no Anexo II.

[RESPONSÁVEL_CONTEÚDO] será responsável por fornecer todo o conteúdo necessário para o desenvolvimento do projeto, incluindo textos, imagens e demais materiais.`,
      
      intellectual: `Todos os direitos de propriedade intelectual relacionados ao software desenvolvido, incluindo código-fonte, documentação técnica e design serão [PROPRIEDADE_INTELECTUAL].

Em caso de transferência dos direitos ao CONTRATANTE, esta ocorrerá somente após o pagamento integral dos valores previstos neste contrato.`
    }
  },
  {
    id: 'design',
    label: 'Design Gráfico',
    icon: 'design',
    questions: [
      {
        id: 'design_items',
        type: 'checkbox',
        label: 'Quais itens serão desenvolvidos?',
        section: 'scope',
        options: [
          { value: 'logo', label: 'Logotipo' },
          { value: 'brand_id', label: 'Identidade Visual' },
          { value: 'social_media', label: 'Peças para Redes Sociais' },
          { value: 'print', label: 'Material Impresso' },
          { value: 'web', label: 'Interface Web' },
          { value: 'packaging', label: 'Embalagens' }
        ],
        required: true
      },
      {
        id: 'design_formats',
        type: 'select',
        label: 'Em quais formatos os arquivos deverão ser entregues?',
        section: 'deliverables',
        options: [
          { value: 'ai', label: 'Adobe Illustrator (AI)' },
          { value: 'psd', label: 'Adobe Photoshop (PSD)' },
          { value: 'pdf', label: 'PDF' },
          { value: 'jpg', label: 'JPG' },
          { value: 'png', label: 'PNG' },
          { value: 'svg', label: 'SVG' }
        ],
        required: true
      },
      {
        id: 'design_concepts',
        type: 'number',
        label: 'Quantas propostas iniciais de conceito serão apresentadas?',
        section: 'scope',
        required: true
      },
      {
        id: 'design_revisions',
        type: 'number',
        label: 'Quantas rodadas de revisão estão incluídas?',
        section: 'scope',
        required: true
      },
      {
        id: 'design_images',
        type: 'radio',
        label: 'Quem fornecerá as imagens base?',
        section: 'scope',
        options: [
          { value: 'client', label: 'Cliente' },
          { value: 'designer', label: 'Designer' }
        ],
        required: true
      },
      {
        id: 'design_stock',
        type: 'radio',
        label: 'Haverá necessidade de compra de banco de imagens?',
        section: 'scope',
        options: [
          { value: 'yes', label: 'Sim' },
          { value: 'no', label: 'Não' }
        ]
      },
      {
        id: 'design_rights',
        type: 'radio',
        label: 'Quem detém os direitos autorais dos designs criados?',
        section: 'rights',
        options: [
          { value: 'client', label: 'Cliente' },
          { value: 'designer', label: 'Designer' },
          { value: 'shared', label: 'Compartilhado' }
        ],
        required: true
      },
      {
        id: 'design_editable',
        type: 'radio',
        label: 'Serão fornecidos os arquivos editáveis ao final do projeto?',
        section: 'deliverables',
        options: [
          { value: 'yes', label: 'Sim' },
          { value: 'no', label: 'Não' }
        ],
        required: true
      },
      {
        id: 'design_brand_manual',
        type: 'radio',
        label: 'Existe manual de uso da marca a ser seguido?',
        section: 'scope',
        options: [
          { value: 'yes', label: 'Sim' },
          { value: 'no', label: 'Não' }
        ]
      },
      {
        id: 'design_delivery_manual',
        type: 'radio',
        label: 'Haverá entrega de manual de identidade visual?',
        section: 'deliverables',
        options: [
          { value: 'yes', label: 'Sim' },
          { value: 'no', label: 'Não' }
        ]
      },
      {
        id: 'design_media_adapt',
        type: 'checkbox',
        label: 'Será necessária adaptação para diferentes mídias?',
        section: 'scope'
      },
      {
        id: 'design_media_details',
        type: 'textarea',
        label: 'Quais mídias precisarão de adaptação?',
        section: 'scope',
        dependsOn: {
          question: 'design_media_adapt',
          value: true
        }
      },
      {
        id: 'design_timeline',
        type: 'checkbox',
        label: 'Existe prazo específico para cada etapa do projeto?',
        section: 'timeline'
      },
      {
        id: 'design_timeline_details',
        type: 'textarea',
        label: 'Detalhamento dos prazos por etapa',
        section: 'timeline',
        dependsOn: {
          question: 'design_timeline',
          value: true
        }
      }
    ],
    clauses: {
      scope: `O objeto do presente contrato é a prestação de serviços de design gráfico para criação de [ITENS_DESIGN], conforme especificações detalhadas no briefing anexo a este contrato.

O CONTRATADO apresentará [NÚMERO_CONCEITOS] propostas iniciais de conceito, e o projeto incluirá até [NÚMERO_REVISÕES] rodadas de revisão sem custo adicional.`,
      
      intellectual: `Os direitos autorais sobre os designs criados serão [PROPRIEDADE_INTELECTUAL].

Em caso de transferência dos direitos ao CONTRATANTE, esta ocorrerá somente após o pagamento integral dos valores previstos neste contrato.

O CONTRATADO [PODERÁ/NÃO PODERÁ] utilizar os designs criados em seu portfólio profissional para fins de divulgação de seu trabalho.`
    }
  },
  {
    id: 'marketing',
    label: 'Marketing Digital',
    icon: 'marketing',
    questions: [],
    clauses: {
      scope: `O objeto do presente contrato é a prestação de serviços de marketing digital, incluindo [CANAIS], pelo período de [PERÍODO].

[RESPONSÁVEL_CONTEÚDO] será responsável pela criação do conteúdo das campanhas e materiais.`
    }
  },
  {
    id: 'consulting',
    label: 'Consultoria',
    icon: 'consulting',
    questions: [],
    clauses: {
      scope: `O objeto do presente contrato é a prestação de serviços de consultoria [NATUREZA_CONSULTORIA], pelo período de [PERÍODO].

Os serviços serão prestados na modalidade [MODALIDADE] e incluem [NÚMERO_HORAS] horas de consultoria.`,
      confidentiality: `O CONTRATADO compromete-se a manter absoluto sigilo sobre todas as informações às quais tenha acesso em razão da prestação dos serviços objeto deste contrato, sejam elas de natureza técnica, comercial, estratégica ou de qualquer outra natureza.

Este compromisso de confidencialidade permanecerá em vigor por um período de [PRAZO_CONFIDENCIALIDADE] após o término deste contrato.`
    }
  },
  {
    id: 'writing',
    label: 'Redação e Conteúdo',
    icon: 'writing',
    questions: [],
    clauses: {
      scope: `O objeto do presente contrato é a prestação de serviços de produção de conteúdo, incluindo [TIPO_CONTEÚDO], na quantidade de [QUANTIDADE_PEÇAS].

Cada peça de conteúdo terá extensão aproximada de [EXTENSÃO_MÉDIA] e incluirá até [NÚMERO_REVISÕES] rodadas de revisão.`
    }
  },
  {
    id: 'photo',
    label: 'Foto e Vídeo',
    icon: 'photo',
    questions: [],
    clauses: {
      scope: `O objeto do presente contrato é a prestação de serviços de [TIPO_SERVIÇO], a ser realizado em [LOCAL_PRODUÇÃO].

O serviço inclui [NÚMERO_HORAS] horas de trabalho e a entrega de [QUANTIDADE] fotos/vídeos finalizados nos formatos [FORMATOS_ENTREGA].`
    }
  },
  {
    id: 'education',
    label: 'Educação e Treinamento',
    icon: 'education',
    questions: [],
    clauses: {
      scope: `O objeto do presente contrato é a prestação de serviços de treinamento sobre [TEMA_TREINAMENTO], na modalidade [MODALIDADE].

O treinamento terá duração total de [CARGA_HORÁRIA] horas e será ministrado para até [NÚMERO_PARTICIPANTES] participantes.`
    }
  },
  {
    id: 'engineering',
    label: 'Engenharia/Construção',
    icon: 'engineering',
    questions: [],
    clauses: {
      scope: `O objeto do presente contrato é a prestação de serviços de [TIPO_SERVIÇO_ENGENHARIA], conforme projeto anexo a este contrato.

Os serviços serão executados no endereço [ENDEREÇO_OBRA] e terão prazo estimado de [PRAZO_EXECUÇÃO] para conclusão.`
    }
  },
  {
    id: 'content',
    label: 'Produção de Conteúdo',
    icon: 'content',
    questions: [],
    clauses: {
      scope: `O objeto do presente contrato é a prestação de serviços de produção de conteúdo para [FINALIDADE_CONTEÚDO].

O CONTRATADO será responsável pela criação de [QUANTIDADE_CONTEÚDO] peças de conteúdo [TIPO_CONTEÚDO] por [PERIODICIDADE].`
    }
  },
  {
    id: 'other',
    label: 'Outro tipo de serviço',
    icon: 'other',
    questions: [],
    clauses: {
      scope: `O objeto do presente contrato é a prestação de serviços de [TIPO_SERVIÇO], conforme especificações detalhadas no Anexo I deste contrato.`
    }
  }
];

// Export the contractTemplates as a typed constant
export const contractTemplates: Record<ServiceType, {
  name: string;
  clauses: {
    scope: string;
    obligations: {
      contractor: string[];
      contracted: string[];
    };
  };
}> = templates;
