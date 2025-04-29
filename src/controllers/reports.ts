import { Request, Response } from "express"
import { handleHTTP } from "../utils/error.handle"
import transactionsModel from "../models/transactions"
import { TransactionType } from "@prisma/client";

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

class reportController {
  async getAmounts(req: Request, res: Response) {
    const userId = req.userId as string

    const transactions = await transactionsModel.getTransactions()
    const userTransactions = transactions.filter(tran => tran.userId === userId)

    const totalIncomes = userTransactions
      .filter(tran => tran.type === TransactionType.income)
      .reduce((sum, tran) => sum + tran.amount, 0);
    const totalExpense = userTransactions
      .filter(tran => tran.type === TransactionType.expense)
      .reduce((sum, tran) => sum + tran.amount, 0)
    const total = totalIncomes - totalExpense

    const amounts = {
      total,
      totalExpense,
      totalIncomes
    }

    try {
      res.json(amounts)
    } catch (e: Error | any) {
      handleHTTP(res, e.message)
    }
  }
}

export default new reportController()