import express from 'express';
import bodyParser from './middlewares/bodyParser.js';
import corsMiddleware from './middlewares/corsMiddleware.js';
import morgan from 'morgan';
import mongooseConnect from './config/mongodbConfig.js';
import authRoutes from './routes/Auth.Routes.js';
import dotenv from 'dotenv';
import specs from './swagger.js';
import swaggerUI from 'swagger-ui-express';


// Cargar las variables de entorno
dotenv.config();

const app = express();

// Conectar a MongoDB
mongooseConnect();

app.use(express.json());
app.use(bodyParser.jsonParser);
app.use(bodyParser.urlencodedParser);
app.use(morgan('dev'));
app.use(corsMiddleware);

//----rutas----//
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use('/api', authRoutes);

// Verificar la variable de entorno PORT
const PORT = process.env.PORT;

if (!PORT) {
    console.error('Error: La variable de entorno PORT no está definida');
    process.exit(1);
}

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
