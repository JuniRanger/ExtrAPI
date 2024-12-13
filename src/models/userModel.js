import mongoose from 'mongoose';

// Esquema de Mongoose con timestamps habilitados
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true, // Elimina espacios en blanco iniciales y finales
        },
        email: {
            type: String,
            required: true,
            unique: true, // Evita duplicados
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validación básica de formato de correo
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // Agrega automáticamente createdAt y updatedAt
    }
);

// Verificación para evitar múltiples registros del modelo
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
