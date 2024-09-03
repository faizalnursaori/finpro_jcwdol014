import App from './app';
import dotenv from 'dotenv';
import { PORT } from './config';

dotenv.config();
const app = new App
app.start()



