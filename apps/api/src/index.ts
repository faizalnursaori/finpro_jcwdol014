import app from './app';
import dotenv from 'dotenv';
import { PORT } from './config';

dotenv.config();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



