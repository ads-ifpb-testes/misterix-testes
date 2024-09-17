import express, { json } from 'express';
import legendRouter from './controller/legendController.js';
import userRouter from './controller/userController.js';
import { authenticateToken } from './middlewares.js';
import cors from 'cors';

var whitelist = ['http://frontend:8080', 'http://localhost:5076']
var corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) 
      callback(null, true)
    else
      callback(new Error('Not allowed by CORS'))
  }
}
const app = express();
const port = process.env.PORT;

app.use(json());
app.use(cors(corsOptions));
app.use('/legends', legendRouter);
app.use('/users', userRouter)

app.get('/auth', authenticateToken, (req, res) => res.sendStatus(200));

app.listen(port, () => console.log('listen on http://localhost:' + port));