import  express  from "express";
import { getProvince, getCity,createProvince, getCities, createCity } from "@/controllers/location.controller";

const router = express.Router();

router.get('/province', getProvince)
router.post('/province/create', createProvince)
router.get('/city/:provinceId', getCity)
router.get('/city', getCities)
router.post('/city/create', createCity)


export default router

