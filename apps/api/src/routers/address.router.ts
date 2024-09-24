import  express  from "express";
import { createAddress, getUserAddresses, deleteAddress, editAddress, getUserAddressById } from "@/controllers/address.controller";
import { authenticateToken } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate";
import { addressSchema, editAddressSchema } from "@/schemas/address";

const router = express.Router();

router.post('/new',authenticateToken,validate(addressSchema) ,createAddress)
router.get('/:id',authenticateToken ,getUserAddresses)
router.put('/edit/:id',authenticateToken, validate(editAddressSchema) ,editAddress)
router.delete('/:id',authenticateToken ,deleteAddress)
router.get('/single/:id',authenticateToken ,getUserAddressById)


export default router