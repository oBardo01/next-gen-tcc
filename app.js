import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
// import cors from 'cors';
import { DatabasePostgres } from './db/commands-db.js';
import { sql } from './db/conn.js';

import ejs from 'ejs';

import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { auth } from 'express-openid-connect';

const config = {
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    secret: process.env.SESSION_SECRET,
    authRequired: false,
    auth0Logout: true,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const database = new DatabasePostgres;
const porta = 8080;
const server = express();

server.engine('html', ejs.renderFile);
server.set('view engine', 'html');
// server.use(cors({
//     origin: 'http://localhost:8080/cadastro.html'
// }));
server.use(express.json()); // Adiciona o middleware para ler JSON
server.use(express.urlencoded({ extended: true })); // Para dados de formulários
server.use('/src', express.static(path.join(__dirname, '/src')));
server.use('/db', express.static(path.join(__dirname, '/db')));
server.use(auth(config));
server.set('views', path.join(__dirname, '/views'));
// server.use(
//     auth({
//       issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
//       baseURL: process.env.BASE_URL,
//       clientID: process.env.AUTH0_CLIENT_ID,
//       secret: process.env.SESSION_SECRET,
//       authRequired: false,
//       auth0Logout: true,
//     }),
//   );

// vmmt socorro deus.

server.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
  next();
});

server.get('/', async (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})

server.get('/api/version', async (req, res) => {
    try {
      const result = await sql`SELECT version()`;
      const { version } = result[0];
      res.send(`PostgreSQL Version: ${version}`);
    } catch (err) {
      res.status(500).send('Erro ao consultar a versão do banco de dados.');
    }
});

server.get('/callback', (req, res) => {
    res.redirect('/')
});
  
server.get('/testeAuth0', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged In' : 'Logged Out');
})

server.get('/login', (req, res) => {
    res.oidc.login({
        returnTo: '/',
    });
});

server.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
})
server.get('/:pagina', (request, reply) => {
    let pagina = request.params.pagina;
    reply.render(`${pagina}`);
    console.log(pagina)
})

server.get('/test', async (req, res) => {
    res.render('test.html');
})

server.post('/registrar', async (req, res) => {
    const dadosRegistro = req.body; // Dados do corpo da requisição
    try {
        await database.registrar(dadosRegistro); // Registra o usuário no banco de dados
        res.status(200).json({ message: "Usuário registrado com sucesso!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro ao registrar o usuário." });
    }
})

server.post('/validarUsuario', async (req, res) => {
    const dadosLogin = req.body;

    try {
        const busca = await database.validar(dadosLogin);
        console.log(busca);
        console.log("return do app.js")

        if (busca.length > 0) {
            // res.status(200).json({ message: "Logado com sucesso." });
            console.log("Logado com sucesso.")
            return res.redirect('/test');
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro ao logar" })
    }

})

server.listen(porta, () => {
    console.log(`server subiu em ${porta}`)
})
