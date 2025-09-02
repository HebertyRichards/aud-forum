# 🗨️ Auditore Fórum - Next.js + Node.js + Supabase

Um fórum moderno e interativo desenvolvido com **Next.js**, **TypeScript**, **Tailwind CSS** e **shadcn/ui** no frontend, e **Node.js** + **Express** no backend e integração no **Supabase**.

## 🚀 Funcionalidades Atuais

- **Autenticação de usuários com JWT**
- **Visualização de perfis acesso ao perfil próprio e de outros membros do fórum**
- **Atualização de perfil com proteção por middleware**
- **Exibição de usuários online em tempo real**
- **Seguir e parar de seguir outros usuários**
- **Alteração de senha em caso "esqueci minha senha"**
- **Alteração de senha em caso de usuário autenticado**
- **Alteração de E-mail em caso do usuário autenticado**
- **Middleware de autenticação para rotas sensíveis**
- **Algumas rotas somente podem ser acessadas com ranks específicos**
- **Algumas rotas é necessário autenticação para acessa-la**
- **Criação de tópicos**
- **Comentar em tópicos**
- **Adicionar imagens em tópicos**
- **Adicionar imagens em comentários**
- **Restrições nas categorias (cargos específicos podem postar tópicos em categorias especificas)**
- **Restrições nos tópicos (cargos específicos podem postas comentários em categorias específicas)**
- **Conteúdo dinâmico com tópicos recentes, quantidade de posts, quantidade de membros ativos e último membro registrado**

## 🛠️ Tecnologias Utilizadas

**Frontend**
- [Next.js](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

**Backend**
- [Node.js](https://nodejs.org)
- [Express](https://expressjs.com)
- [Supabase](https://supabase.com)

## 📌 Estrutura do Projeto

- **Frontend**: Consome a API do backend, gerencia autenticação e interface do usuário.
- **Backend**: Responsável pela lógica de negócios e segurança.
- **Middlewares**: Autenticação e CORS configurados via variáveis de ambiente.

## 📅 Próximos Passos

- Melhoria para **criar tópicos e comentar**
- Implementar **mensagens privadas** entre usuários
- Melhorar recursos de interação da comunidade


📢 *Este projeto está em desenvolvimento ativo e novas funcionalidades serão adicionadas em breve.*
