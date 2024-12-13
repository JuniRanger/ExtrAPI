import jwt from 'jsonwebtoken';
import userService from '../services/userService.js';

export async function verifyToken(req, res, next) {
    const bearerHeader = req.header('Authorization');
    if (!bearerHeader) {
        console.log('Authorization header missing');
        return res.status(403).json({ error: 'Token no proporcionado' });
    }

    const token = bearerHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded || !decoded.username) {
            throw new Error("Username missing in token");
        }

        const user = await userService.getUserByUsername(decoded.username);

        if (!user) {
            console.log(`Usuario no encontrado para el username: ${decoded.username}`);
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const decodedUser = req.user = { id: user._id, ...decoded };

        console.log(decodedUser);
        next(); 
    } catch (err) {
        console.error('Token Verification Error:', err.message);
        res.status(401).json({ error: 'Token inválido' });
    }
}

export default verifyToken;
