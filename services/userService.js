import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

// Registro de usuario
async function register(user) {
    try {
        // Hashear la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Crear el objeto de datos del usuario
        const userData = {
            username: user.username,
            email: user.email,
            password: hashedPassword
        };

        const newUser = new User(userData);

        // Guardar el nuevo usuario en la base de datos
        await newUser.save();
        return newUser;
    } catch (error) {
        throw new Error("Error al guardar el usuario en la DB: " + error.message);
    }
}

async function login(username, password) {
    try {
        const foundUser = await User.findOne({ username: username });
        
        if (!foundUser) {
            throw new Error("Usuario no encontrado");
        }

        // Comparar el password ingresado con la contraseña encriptada almacenada
        const isMatch = await bcrypt.compare(password, foundUser.password);
        
        if (!isMatch) {
            throw new Error("Credenciales inválidas");
        }

        // Generar un token JWT
        const token = jwt.sign(
            { id: foundUser._id, username: foundUser.username },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        );

        // Eliminar la contraseña del objeto de usuario antes de devolverlo
        const { password: pass, ...userWithoutPassword } = foundUser.toObject();
        return { token, user: userWithoutPassword };
    } catch (error) {
        throw new Error("Error al iniciar sesión: " + error.message);
    }
}

// Obtener usuario por su nombre de usuario
async function getUserByUsername(username) {
    try {
        // Buscar el usuario por el nombre de usuario
        const user = await User.findOne({ username });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        return user;
    } catch (error) {
        throw new Error('Error al conseguir el usuario: ' + error.message);
    }
}

export default {
    register,
    login,
    getUserByUsername
};
