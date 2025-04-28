import { Request, Response } from "express";
import { Prisma, TransactionType } from "@prisma/client";
import model from '../models/transactions'
import { Error } from "../interfaces/error";
import { handleHTTP } from "../utils/error.handle";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
async functionName(req: Request, res: Response) {
  try {
    //code
  } catch(e: Error | any) {
    handleHTTP(res, e.message)
  }
}
 */

class TransactionController {
  async getTransactions(req: Request, res: Response) {
    try {
      const transactions = await model.getTransactions()
      res.json(transactions)
    } catch (e: Error | any) {
      handleHTTP(res, e.message)
    }
  }

  async getTransaction(req: Request, res: Response) {
    const { id } = req.params
    try {
      const transaction = await model.getTransaction(id)
      if (!transaction) handleHTTP(res, 'Transaction not found', 404)

      res.json(transaction)
    } catch (e: Error | any) {
      handleHTTP(res, e.message)
    }
  }

  async create(req: Request, res: Response) {
    const { amount, desc, categoryId, type } = req.body
    const userId = req.userId as string

    const data: Prisma.TransactionUncheckedCreateInput = {
      userId,
      amount,
      type,
      desc: desc || null,
      categoryId
    }

    try {
      if (userId) {
        if (amount && categoryId) {
          const transaction = await model.create(data)
          res.json(transaction)
        } handleHTTP(res, 'All params are required', 400)
      } handleHTTP(res, 'UserId not found', 404)
    } catch (e: Error | any) {
      handleHTTP(res, e.message)
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params
    const { amount, desc, categoryId } = req.body
    const userId = req.userId as string

    const data: Prisma.TransactionUncheckedUpdateInput = {
      userId,
      amount,
      desc: desc || null,
      categoryId
    }

    try {
      if (userId) {
        if (amount && categoryId) {
          const transaction = await model.update(id, data)
          res.json(transaction)
        } handleHTTP(res, 'All params are required', 400)
      } handleHTTP(res, 'UserId not found', 404)
    } catch (e: Error | any) {
      handleHTTP(res, e.message)
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params
    try {
      await model.delete(id)
      handleHTTP(res, `Transaction whit id: ${id} deleted`, 200)
    } catch (e: Error | any) {
      handleHTTP(res, e.message)
    }
  }
}

export default new TransactionController()