import App from './app';
import dotenv from 'dotenv';
import { PORT } from './config';

dotenv.config();
const app = new App();
app.start();

const main = () => {
  // init db here

  const app = new App();
  app.start();
};

main();
