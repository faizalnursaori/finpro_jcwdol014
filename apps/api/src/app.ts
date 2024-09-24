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
import warehouseRouter from './routers/warehouse.router';
import userRouter from './routers/user.router'
import locationRouter from './routers/location.router'
import addressRouter from './routers/address.router'
import { categoryRouter } from './routers/category.router';
import { stockRouter } from './routers/productStock.router';
import { stockTransferRouter } from './routers/stockTransfer.router';
import { stockTransferLogRouter } from './routers/stockTransferLog.router';
import { voucherRouter } from './routers/voucher.router';
import { reportRouter } from './routers/report.router';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
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
    this.app.use('/api/warehouses', warehouseRouter);
    this.app.use('/api/users', userRouter);
    this.app.use('/api/admins', adminRouter);
    this.app.use('/api/locations', locationRouter);
    this.app.use('/api/addresses', addressRouter);
    this.app.use('/api/categories', categoryRouter);
    this.app.use('/api/stocks', stockRouter);
    this.app.use('/api/stock-transfers', stockTransferRouter);
    this.app.use('/api/logs', stockTransferLogRouter);
    this.app.use('/api/vouchers', voucherRouter);
    this.app.use('/api/reports', reportRouter);
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
