import { Router } from "express";
import controllers from "../controllers/transactions";

const router = Router()

router.get('/', controllers.getTransactions)
router.get('/:id', controllers.getTransaction)
router.post('/', controllers.create)
router.put('/:id', controllers.update)
router.delete('/:id', controllers.delete)

export { router }