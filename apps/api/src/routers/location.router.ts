import  express  from "express";
import { getProvince, getCity,createProvince, getCities, createCity, getShipping } from "@/controllers/location.controller";

const router = express.Router();

router.get('/province', getProvince)
router.post('/province/create', createProvince)
router.get('/city/:provinceId', getCity)
router.get('/city', getCities)
router.post('/city/create', createCity)
router.post('/cost', getShipping)


export default router

