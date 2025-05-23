
# PropostaPro

PropostaPro é uma plataforma completa para criação, envio e assinatura digital de propostas comerciais.

## Características

- Criação de propostas personalizáveis
- Assinatura digital de documentos
- Dashboard com métricas
- Controle de acesso baseado em planos
- Interface responsiva e intuitiva

## Tecnologias

- React 18 com TypeScript
- Vite
- TailwindCSS com Shadcn/UI
- Supabase (Autenticação, Banco de Dados, Storage e Edge Functions)
- React Query
- React Router

## Configuração do Ambiente de Desenvolvimento

### Pré-requisitos

- Node.js 18 ou superior
- Supabase CLI (para desenvolvimento local)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/propostapro.git
cd propostapro
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

4. Para iniciar o Supabase localmente (opcional):
```bash
supabase start
```

## Estrutura do Projeto

- `/src` - Código fonte da aplicação
  - `/components` - Componentes React reutilizáveis
  - `/contexts` - Contextos React para gerenciamento de estado
  - `/hooks` - Custom hooks React
  - `/pages` - Componentes de página
  - `/utils` - Funções utilitárias
  - `/integrations` - Integrações com serviços externos (Supabase, etc)

## Implantação

### Requisitos para Produção

1. Projeto Supabase configurado com:
   - Autenticação ativada
   - Tabelas de banco de dados criadas
   - Edge Functions implantadas

2. Para implantar:
```bash
npm run build
```

Os arquivos de build estarão disponíveis no diretório `dist`.

## Configuração do Supabase

As seguintes tabelas são necessárias:
- profiles
- proposals
- contracts
- signature_requests
- signatories
- audit_events

## Documentação

Para mais detalhes sobre componentes e funcionalidades, consulte a [documentação interna](./docs).

## Licença

Este projeto é proprietário e confidencial. Todos os direitos reservados.
