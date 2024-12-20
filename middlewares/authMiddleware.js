import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET

const authMiddleware = (req, res, next) => {
  console.log("iniciando verificação");

  const autHeader = req.headers.authorization;
  console.log(autHeader);

  if (!autHeader) {
    console.log("Token n fornecido");
    res.redirect('/');
    return res.status(401).json("Acesso não autorizado, token não fornecido");
  }

  const token = autHeader.split(' ')[1];
  if (!token) {
    console.log("Token n encontrado")
    return res.status(401).json("Token não encontrado");
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token inválido");
      return res.status(403).json("Token inválido"); 
    }

    console.log("Token válido")
    req.user = decoded;
    next();
  })
}

export function gerarToken(busca) {
  const payload = { uid: busca.uid, email: busca.email }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export default authMiddleware;

// export function verificarToken(req, res, next) {
//   const token = req.cookies?.authToken;
//   if (!token) {
//     return res.status(401).json({ message: "Acesso não autorizado" });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(403).json({ message: "Token inválido" });
//   }
// }