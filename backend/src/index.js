import express, { json } from 'express';
import legendRouter from './router/legendRouter.js';
import userRouter from './router/userRouter.js';
import cors from 'cors';
import 'dotenv/config';
import { authenticate } from './middlewares.js';

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
app.use(cors());
app.use('/legends', legendRouter);
app.use('/users', userRouter)

app.get('/auth', authenticate, (req, res) => res.sendStatus(200));

export default app;

app.listen(port, () => console.log('listen on http://localhost:' + port));
