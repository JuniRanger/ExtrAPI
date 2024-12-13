import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';

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

        // Crear un nuevo usuario
        const newUser = new User(userData);

        // Guardar el nuevo usuario en la base de datos
        await newUser.save();
        return newUser;
    } catch (error) {
        throw new Error("Error al guardar el usuario en la DB: " + error.message);
    }
}

// Iniciar sesión (Login)
async function login(user) {
    try {
        // Buscar el usuario por el nombre de usuario
        const foundUser = await User.findOne({ username: user.username });
        
        if (!foundUser) {
            throw new Error("Usuario no encontrado");
        }

        // Comparar la contraseña proporcionada con la almacenada
        const isMatch = await bcrypt.compare(user.password, foundUser.password);
        
        if (!isMatch) {
            throw new Error("Contraseña incorrecta");
        }

        // Si la contraseña es correcta, devolver los datos del usuario (excluyendo la contraseña)
        const { password, ...userWithoutPassword } = foundUser.toObject();
        return userWithoutPassword;
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
