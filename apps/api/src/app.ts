import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import cors from 'cors';
import { PORT } from './config';
import warehouseRoutes from './routers/warehouse.router';
import productsRoutes from './routers/product.router'
import path from 'path'

const app = express()
app.use(cors())



app.use('/api', warehouseRoutes)
app.use('/api', productsRoutes)

export default app