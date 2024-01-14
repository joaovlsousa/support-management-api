# Support Management

![supportify](https://github.com/joaovlsousa/support-management-api/assets/140824506/63eeeb92-be61-4a72-8b6c-9c8989404d0c)

## Sobre o projeto
<p>Este projeto trata-se de uma API que segue os princípios REST. Ela tem a finalidade de ser a camada Back-end do website <a href="https://github.com/joaovlsousa/supportify" target="_blank">Supportify</a>, intermediando a comunicação do Front-end com o Banco de Dados.</p>

## Tecnologias utilizadas
- NodeJs
- Fastify
- TypeScript
- Prisma (ORM)
- Zod (Validação de dados)
- Bcrypt (Hashing)
- Json Web Token (JWT)
- Fastify Cors

## Funcionalidades
- Autenticação (Credenciais)
- Cadastrar clientes e atendimentos
- Listagem de todos clientes e atendimentos
- Ver dados de um cliente e de um atendimento
- Editar Perfil

## Endpoints
- /sign-up `POST`
- /sign-in `POST`
- /clients `POST` `GET`
- /clients/:id  `GET` `DELETE`
- /supports `POST`
- /supports/:id `GET` `DELETE` `PATCH`
- /supports/u `GET`
- /supports/c/:id `GET`
- /u/:id `GET`
- /u `DELETE`

## Como executar

### Clone o projeto
- `git clone https://github.com/joaovlsousa/support-management-api.git`
- `cd support-management-api`

### Instale as dependências
- `npm i` ou `yarn` ou `pnpm i`

### Inicie a aplicação
- `npm run dev` ou `yarn dev` ou `pnpm dev`
- Agora você pode acessar as rotas em `http://localhost:3333`