# Mini Rede Social

Projeto desenvolvido para aplicar os meus conhecimentos em MongoDB e em orientação a objetos usando TypeScript.
## Sobre o sistema
Trata-se de uma API RESTful utilizando express.js que permite cadastrar, alterar, listar, detalhar e desativar usuários, criar, alterar, listar, detalhar, deletar, comentar e curtir publicações.
## Tecnologias Utilizadas
-  typescript, nodemon e ts-node: usadas no ambiente de desenvolvimento;
-  mongoose: integração, modelagem de dados e acesso ao banco com o MongoDB;
-  dotenv: carregar variáveis de ambiente;
-  express: roteamento da aplicação;
-  multer e asw-sdk: upload de arquivos usando S3;
-  docker: containerização da aplicação para facilitar a criação, distribuição e execução da aplicação de forma isolada e portátil.

## Setup Inicial

Rodando o comando para subir o banco de dados no docker
`docker run -d -p porta:porta --name mongodb -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=root -v absolute_path/Volumes/Mongo:/data/db mongo`

Rodando o comando na pasta do projeto para subir a aplicação
`docker compose up -d`

Aplicação ficará disponível na url
`http://localhost:3000`
## Rotas
### Usuários
`POST /user`  
Cria um novo usuário no sistema. Recebe um objeto com os seguintes dados obrigatórios no body:

_{  
	"name": "Amanda",  
	"email": "amanda@email.com",  
	"username": "amanda_username" ,
	"photo": 1 arquivo de imagem,
	"description": "Esse é um exemplo de biografia."
}_

Todos os campos devem ser strings, exceto o campo "photo" que recebe um arquivo no formato .png/.jpg/.jpeg. O e-mail e o nome de usuário não podem constar no cadastro de outro usuário.
Retorna os dados do usuário cadastrado.

![criar usuario](https://f005.backblazeb2.com/file/social-network-ca/readme-pics/POST+user.jpg)

Se já houver um usuário cadastrado com o mesmo email ou nome de usuário, retorna a mensagem "User or email already exists.".

`GET /users`  
Lista todos os usuários do sistema. Não recebe nenhum parâmetro.
Retorna um array com os dados do usuário.

![listar usuarios](https://f005.backblazeb2.com/file/social-network-ca/readme-pics/get+users.jpg)

Se não houver nenhum usuário, retorna um array vazio.

`GET /user/:id`  
Detalha um usuário específico. Recebe como parâmetro de rota o id do usuário a ser detalhado.
Retorna os dados do usuário selecionado.

![detalhar usuario](https://f005.backblazeb2.com/file/social-network-ca/readme-pics/get+user+id.jpg)

Se enviado algo diferente de um ObjectId, retorna um 400 com a mensagem "Invalid user ID." .
Se o usuário não for encontrado, retorna um 404 com a mensagem "User not found.".

`PUT /user/:id`  
Atualiza os dados de um usuário específico. Recebe como parâmetro de rota o id do usuário a ser detalhado e os dados a serem atualizados no body.

_{  
	"name": "Amanda Atualizado",  
	"email": "amanda@email.com",  
	"username": "amanda_username" ,
	"photo": 1 arquivo de imagem,
	"description": "Esse é um exemplo de biografia atualizada."
}_

Retorna um 204 sem conteúdo.

![atualizar usuario](https://f005.backblazeb2.com/file/social-network-ca/readme-pics/update+user+id.jpg)

Se enviado algo diferente de um ObjectId, retorna um 400 com a mensagem "Invalid user ID." .
Se o usuário não for encontrado, retorna um 404 com a mensagem "User not found.".
Se já houver um usuário cadastrado com o mesmo email ou nome de usuário, retorna a mensagem "User or email already exists.". A requisição prossegue se for passado o mesmo email e nome de usuário.

`PATCH /user/:id/deactivate`  
Desativa o cadastro de um usuário específico. Recebe como parâmetro de rota o id do usuário a ser desativado.
Retorna um 204 sem conteúdo.

![desativar usuario](https://f005.backblazeb2.com/file/social-network-ca/readme-pics/patch+user+id+deactivate.jpg)

Se enviado algo diferente de um ObjectId, retorna um 400 com a mensagem "Invalid user ID." .
Se o usuário não for encontrado, retorna um 404 com a mensagem "User not found.".

### Posts e Feed

`POST /feed`  
Cria um novo post para o usuário informado. Recebe um objeto com os seguintes dados no body:

_{  
	"user_id": "ObjectId",  
	"description": "Esse é um exemplo de biografia.",
	"images": 1 ou mais arquivos de imagem,
}_

Todos os campos devem ser strings, exceto o campo "images" que recebe um arquivo no formato .png/.jpg/.jpeg. 

![criar post](https://f005.backblazeb2.com/file/social-network-ca/readme-pics/post+feed.jpg)

`GET /feed` 
Lista todos os posts armazenados no banco de dados, incluindo os comentários e dados do usuário. Não recebe nenhum parâmetro.

![listar posts](https://f005.backblazeb2.com/file/social-network-ca/readme-pics/get+feed.jpg)

`GET /feed/:id` 
Detalha um post específico. Recebe como parâmetro de rota o id do post desejado.

![detalhar um post](https://f005.backblazeb2.com/file/social-network-ca/readme-pics/get+feed+id.jpg)

Se o post não for encontrado, retorna um 404 com a mensagem "Post not found.".

`PATCH /feed/:id` 
Altera a descrição de um post. Recebe como parâmetro de rota o id do post e a descrição no body.
Retorna um 204 sem conteúdo.

![atualizar um post](https://f005.backblazeb2.com/file/social-network-ca/readme-pics/patch+feed+id.jpg)

Se o post não for encontrado, retorna um 404 com a mensagem "Post not found.".

`DELETE /feed/:id` 
Altera a descrição de um post. Recebe como parâmetro de rota o id do post.
Retorna um 204 sem conteúdo.

![excluir um post](https://f005.backblazeb2.com/file/social-network-ca/readme-pics/delete+feed+id.jpg)

Se o post não for encontrado, retorna um 404 com a mensagem "Post not found.".

`PATCH /feed/:id/like` 
Curte um post. Recebe como parâmetro de rota o id do post e o id do usuário no body.
A curtida é única por usuário, enviando a requisição novamente a curtida é desfeita.
Retorna um 204 sem conteúdo.

![curtir um post](https://f005.backblazeb2.com/file/social-network-ca/readme-pics/patch+like.jpg)

Se o post não for encontrado, retorna um 404 com a mensagem "Post not found.".
Se o usuário não for encontrado, retorna um 404 com a mensagem "User not found.".
Se enviado algo diferente de um ObjectId, retorna um 400 com a mensagem "Invalid user ID." .

`PATCH /feed/:id/comments` 
Comenta em um post. Recebe como parâmetro de rota o id do post, a descrição do comentário e o id do usuário no body.
Retorna um 204 sem conteúdo.

![comentar um post](https://f005.backblazeb2.com/file/social-network-ca/readme-pics/patch+comments.jpg)

Se o post não for encontrado, retorna um 404 com a mensagem "Post not found.".
Se o usuário não for encontrado, retorna um 404 com a mensagem "User not found.".
Se enviado algo diferente de um ObjectId, retorna um 400 com a mensagem "Invalid user ID." .

## Em breve
-  Autenticação do usuário.
-  Validação de senha para excluir posts e desativar conta.