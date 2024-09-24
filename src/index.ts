import express, { Application, Request, Response } from 'express';
import models from './models/index.js';
import authRouter from './apis/authApi.js'
import userRouter from './apis/userApi.js'
import productRouter from './apis/productApi.js'
import cors from 'cors';
import { authenticateUser } from './middlewares/authenticateUser.js';
import { errorHandler } from './middlewares/errorHandler.js'
const app: Application = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',authenticateUser,userRouter);
app.use('/api/v1/products',authenticateUser, productRouter);
app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  console.log('API call was made');
  res.send('<h1>Hey there......</h1>');
});

const startServer = async() => {
  try {
    await models.sequelize.sync({ force: false, alter: true });
    console.log('Database and tables created!');
    app.listen(port, () => {
      console.log(`Server is up and running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();