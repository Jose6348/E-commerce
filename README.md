# 🛍️ ShopHub - E-commerce Completo

E-commerce profissional full-stack desenvolvido com Next.js, PostgreSQL e Prisma.

![Next.js](https://img.shields.io/badge/Next.js-13.5-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5.17-2D3748?logo=prisma)

## ✨ Funcionalidades

### 🏪 Loja (Storefront)
- ✅ **Home** com produtos em destaque e categorias
- ✅ **Listagem de produtos** com busca e filtros
- ✅ **Detalhes do produto** com fotos, descrição e estoque
- ✅ **Carrinho de compras** persistente
- ✅ **Checkout** com formulário de endereço
- ✅ **Autenticação** (login/registro)
- ✅ **Área do Cliente** com histórico de pedidos
- ✅ **Navegação por categorias**

### ⚙️ Painel Admin
- ✅ **Dashboard** com KPIs e estatísticas
- ✅ **Gestão de Produtos** (CRUD completo)
- ✅ **Gestão de Categorias** (CRUD completo)
- ✅ **Gestão de Pedidos** (visualização e atualização de status)
- ✅ **Controle de acesso** (apenas usuários ADMIN)

### 🎨 Design
- ✅ Interface moderna com gradientes e animações
- ✅ Responsivo para mobile, tablet e desktop
- ✅ Glassmorphism e efeitos visuais premium
- ✅ Sistema de design consistente
- ✅ SEO otimizado

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- **Node.js** 18+ instalado
- **PostgreSQL** instalado e rodando
- **Git** (opcional)

### 1️⃣ Configuração do Banco de Dados

Crie um banco de dados PostgreSQL:

```bash
# Entre no PostgreSQL
psql -U postgres

# Crie o banco
CREATE DATABASE ecommerce;

# Saia
\q
```

### 2️⃣ Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (se ainda não existir):

```env
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/ecommerce"
JWT_SECRET="seu-segredo-super-secreto-aqui-troque-isso"
```

**⚠️ IMPORTANTE:** Substitua `sua_senha` pela senha do seu PostgreSQL!

### 3️⃣ Instalar Dependências

```bash
npm install
```

### 4️⃣ Configurar Prisma e Banco de Dados

```bash
# Gerar o Prisma Client
npm run prisma:generate

# Executar as migrations (criar tabelas)
npm run prisma:migrate

# Popular o banco com dados iniciais
npm run prisma:seed
```

### 5️⃣ Iniciar o Servidor

```bash
npm run dev
```

O servidor estará rodando em **http://localhost:3000**

## 👤 Credenciais de Admin

Use estas credenciais para acessar o painel administrativo:

```
Email: admin@example.com
Senha: admin123
```

**⚠️ Troque estas credenciais em produção!**

## 📁 Estrutura do Projeto

```
E-commerce/
├── pages/                    # Páginas Next.js
│   ├── index.tsx            # Home page
│   ├── products/            # Páginas de produtos
│   │   ├── index.tsx        # Listagem
│   │   └── [slug].tsx       # Detalhes do produto
│   ├── category/            # Páginas de categoria
│   ├── cart.tsx             # Carrinho
│   ├── checkout.tsx         # Finalização
│   ├── login.tsx            # Login
│   ├── register.tsx         # Cadastro
│   ├── account/             # Área do cliente
│   │   └── orders/          # Pedidos do cliente
│   ├── admin/               # Painel administrativo
│   │   ├── index.tsx        # Dashboard
│   │   ├── products/        # Gestão de produtos
│   │   ├── categories/      # Gestão de categorias
│   │   └── orders/          # Gestão de pedidos
│   └── api/                 # API Routes
│       ├── auth/            # Autenticação
│       ├── products/        # API de produtos
│       ├── categories/      # API de categorias
│       ├── cart/            # API do carrinho
│       ├── checkout/        # API de checkout
│       ├── orders/          # API de pedidos
│       └── admin/           # API admin (stats)
├── components/              # Componentes React
│   ├── Header.tsx           # Cabeçalho
│   ├── Footer.tsx           # Rodapé
│   └── ProductCard.tsx      # Card de produto
├── lib/                     # Utilitários
│   ├── prisma.ts            # Cliente Prisma
│   ├── auth.ts              # Helpers de autenticação
│   └── validators.ts        # Validadores
├── prisma/                  # Configuração Prisma
│   ├── schema.prisma        # Schema do banco
│   └── seed.ts              # Seed de dados
├── styles/                  # Estilos
│   └── globals.css          # CSS global
├── .env                     # Variáveis de ambiente
├── package.json             # Dependências
└── tsconfig.json            # Config TypeScript
```

## 🗄️ Modelos do Banco de Dados

### User (Usuário)
- `id`, `email`, `password`, `name`, `role` (ADMIN/CUSTOMER)
- Relações: pedidos, endereços, carrinho

### Category (Categoria)
- `id`, `name`, `slug`
- Relações: produtos

### Product (Produto)
- `id`, `name`, `slug`, `description`, `price`, `stock`, `imageUrl`, `active`, `categoryId`
- Relações: categoria, itens do carrinho, itens do pedido

### Cart (Carrinho)
- `id`, `userId`
- Relações: usuário, itens do carrinho

### CartItem (Item do Carrinho)
- `id`, `cartId`, `productId`, `quantity`

### Order (Pedido)
- `id`, `userId`, `addressId`, `total`, `status`
- Status: PENDING, PAID, SHIPPED, COMPLETED, CANCELED

### OrderItem (Item do Pedido)
- `id`, `orderId`, `productId`, `quantity`, `price`

### Address (Endereço)
- `id`, `userId`, `street`, `city`, `state`, `postal`, `country`

## 🎯 Rotas Principais

### Storefront (Loja)
- `/` - Home page
- `/products` - Listagem de produtos
- `/products/[slug]` - Detalhes do produto
- `/category/[slug]` - Produtos por categoria
- `/cart` - Carrinho de compras
- `/checkout` - Finalizar compra
- `/login` - Login
- `/register` - Cadastro
- `/account/orders` - Meus pedidos
- `/account/orders/[id]` - Detalhes do pedido

### Admin
- `/admin` - Dashboard
- `/admin/products` - Gestão de produtos
- `/admin/products/new` - Novo produto
- `/admin/products/[id]/edit` - Editar produto
- `/admin/categories` - Gestão de categorias
- `/admin/orders` - Gestão de pedidos
- `/admin/orders/[id]` - Detalhes do pedido

## 🔐 API Endpoints

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout

### Produtos
- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto (admin)
- `GET /api/products/[id]` - Obter produto
- `PUT /api/products/[id]` - Atualizar produto (admin)
- `DELETE /api/products/[id]` - Deletar produto (admin)

### Categorias
- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria (admin)
- `GET /api/categories/[id]` - Obter categoria
- `PUT /api/categories/[id]` - Atualizar categoria (admin)
- `DELETE /api/categories/[id]` - Deletar categoria (admin)

### Carrinho
- `GET /api/cart` - Obter carrinho
- `POST /api/cart/add` - Adicionar ao carrinho
- `PUT /api/cart/[itemId]` - Atualizar quantidade
- `DELETE /api/cart/[itemId]` - Remover item

### Pedidos
- `GET /api/orders` - Listar pedidos
- `GET /api/orders/[id]` - Obter pedido
- `POST /api/checkout` - Criar pedido
- `PUT /api/orders/[id]/status` - Atualizar status (admin)

### Admin
- `GET /api/admin/stats` - Estatísticas (admin)

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev            # Inicia o servidor de desenvolvimento

# Build
npm run build          # Cria build de produção
npm start              # Inicia servidor de produção

# Prisma
npm run prisma:generate  # Gera Prisma Client
npm run prisma:migrate   # Executa migrations
npm run prisma:seed      # Popula banco de dados
npm run prisma:studio    # Abre Prisma Studio (visualizador de dados)

# Qualidade
npm run lint           # Executa ESLint
```

## 🎨 Tecnologias Utilizadas

- **Frontend:** Next.js 13, React 18, TypeScript
- **Backend:** Next.js API Routes, Node.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT com cookies httpOnly
- **Styling:** CSS Modules, CSS Variables
- **Validation:** Zod
- **Password Hashing:** bcryptjs

## 📦 Funcionalidades Implementadas

✅ Sistema de autenticação completo
✅ Gestão de produtos (CRUD)
✅ Gestão de categorias (CRUD)
✅ Carrinho de compras persistente
✅ Sistema de checkout
✅ Gestão de pedidos
✅ Dashboard administrativo com KPIs
✅ Controle de estoque
✅ Busca e filtros de produtos
✅ Design responsivo
✅ SEO otimizado
✅ Validação de formulários
✅ Tratamento de erros

## 🚧 Próximos Passos (Opcional)

- [ ] Integração com gateway de pagamento real (Stripe/PayPal)
- [ ] Upload de imagens para produtos
- [ ] Sistema de avaliações e comentários
- [ ] Wishlist (lista de desejos)
- [ ] Cupons de desconto
- [ ] Notificações por email
- [ ] Recuperação de senha
- [ ] Múltiplas fotos por produto
- [ ] Filtros avançados
- [ ] Relatórios detalhados no admin

## 📝 Notas Importantes

1. **Pagamento Simulado:** O checkout cria pedidos automaticamente sem integração real de pagamento
2. **Imagens:** As imagens dos produtos usam URLs do Unsplash (podem ser substituídas)
3. **Segurança:** Troque as senhas e secrets antes de ir para produção
4. **CORS:** Configurar CORS se for usar domínio diferente

## 🤝 Contribuindo

Este é um projeto de demonstração. Sinta-se livre para:
- Fazer fork
- Criar issues
- Enviar pull requests
- Sugerir melhorias

## 📄 Licença

MIT License - sinta-se livre para usar em seus projetos!

## 👨‍💻 Desenvolvido por

Projeto desenvolvido como demonstração de e-commerce full-stack profissional.

---

**🎉 Pronto para começar! Execute `npm run dev` e acesse http://localhost:3000**
