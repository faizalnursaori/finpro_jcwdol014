import  express  from "express";
import { createAddress, getUserAddresses, deleteAddress, editAddress } from "@/controllers/address.controller";
import { authenticateToken } from "@/middleware/auth.middleware";

const router = express.Router();

router.post('/new',authenticateToken ,createAddress)
router.get('/:id',authenticateToken ,getUserAddresses)
router.put('/edit/:id',authenticateToken ,editAddress)
router.delete('/:id',authenticateToken ,deleteAddress)


export default router