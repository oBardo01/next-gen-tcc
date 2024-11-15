import express from 'express';
// import session from 'express-session';
// import pgSession from 'connect-pg-simple';
import bodyParser from 'body-parser';
// import cors from 'cors';
import { DatabasePostgres } from './db/commands-db.js';
import { sql } from './db/conn.js';

import ejs from 'ejs';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pkg from 'express-openid-connect'

const { auth, requiresAuth } = pkg

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const database = new DatabasePostgres;
const porta = 8080;
const server = express();

// const PgSession = pgSession(session);

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    clientSecret: process.env.SESSION_SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    authorizationParams: {
        scope: 'openid profile email', // Adicione os escopos necessários
      }
}

// server.use(
//     session({
//         store: new PgSession({
//             pool: process.env.DATABASE_URL,
//             tableName: 'session'
//         }),
//         secret: process.env.SESSION_SECRET,
//         resave: false,
//         saveUninitialized: false,
//         cookie: {
//             secure: process.env.NODE_ENV === 'production',
//             maxAge: 60 * 60 * 24 * 7, 
//         }
//     }));

server.use(auth(config));

server.engine('html', ejs.renderFile);
server.set('view engine', 'html');
server.use(express.json()); // Adiciona o middleware para ler JSON
server.use(express.urlencoded({ extended: true })); // Para dados de formulários
server.use('/src', express.static(path.join(__dirname, '/src')));
server.use('/db', express.static(path.join(__dirname, '/db')));
server.set('views', path.join(__dirname, '/views'));

// server.get('/login', (req, res) => {
//     res.oidc.login({ returnTo: '/profile' });
//   });

server.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
})

// server.get('/logout', (req, res) => {
//     res.render('index.html');
// })

server.get('/callback', requiresAuth(), (req, res) => {
    try {
        if (!req.oidc.isAuthenticated()) {
            return res.redirect('/index')
        }

        console.log('User Info:', req.oidc.user);
        res.redirect('/profile');
    } catch (err) {
        console.error('Erro no callback:', err);
        res.status(500).send('Erro ao processar login');
      } 
})

server.get('/', async (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
    console.log(config)
})

server.get('/isLogged', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

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
