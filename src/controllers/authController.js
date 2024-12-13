import userService from "../services/userService.js";


async function register(req, res){
    try {
        const newUser = await userService.register({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        res.status(201).json({ message: 'Usuario registrado exitosamente: ', user: newUser})
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

async function login(req, res){
    try {
        
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export default {
    register
}

