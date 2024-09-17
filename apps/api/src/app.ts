import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
} from 'express';
import cors from 'cors';
import { PORT } from './config';
import { adminRouter } from './routers/admin.router';
import cartRouter from './routers/cart.router';
import productRouter from './routers/product.routers';
import authRouter from './routers/auth.router';
import orderRouter from './routers/order.router';
import warehouseRouter from './routers/warehouse.router';
import { startOrderCronJobs } from './cron/order.cron';
import userRouter from './routers/user.router';
import { categoryRouter } from './routers/category.router';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
    // this.startCronJobs();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error : ', err.stack);
          res.status(500).send('Error !');
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student API!`);
    });

    this.app.use('/api/carts', cartRouter);
    this.app.use('/api/products', productRouter);
    this.app.use('/api/auth', authRouter);
    this.app.use('/api/orders', orderRouter);
    this.app.use('/api/warehouses', warehouseRouter);
    this.app.use('/api/users', userRouter);
    this.app.use('/api/admins', adminRouter);
    this.app.use('/api/categories', categoryRouter);
  }

  private startCronJobs(): void {
    startOrderCronJobs();
  }

  public start(): void {
    this.startCronJobs();
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
