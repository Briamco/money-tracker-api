import { Request, Response } from "express";
import { Error } from "../interfaces/error";
import { handleHTTP } from "../utils/error.handle";
import model from '../models/category'
import { Prisma } from "@prisma/client";

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

class CategoryController {
  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await model.getAllCategories()
      res.json(categories)
    } catch (e: Error | any) {
      handleHTTP(res, e.message)
    }
  }

  async getCategory(req: Request, res: Response) {
    const { id } = req.params
    try {
      const categories = await model.getCategory(id)
      res.json(categories)
    } catch (e: Error | any) {
      handleHTTP(res, e.message)
    }
  }

  async create(req: Request, res: Response) {
    const { name, icon } = req.body
    const userId = req.userId as string

    const data: Prisma.CategoryUncheckedCreateInput = {
      userId,
      name,
      icon
    }

    try {
      if (userId) {
        if (name && icon) {
          const category = await model.createCategoty(data)
          res.json(category)
        } handleHTTP(res, 'all params are required')
      } else handleHTTP(res, 'user not found', 404)
    } catch (e: Error | any) {
      handleHTTP(res, e.message)
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params
    const { name, icon } = req.body
    const userId = req.userId as string

    const data: Prisma.CategoryUncheckedCreateInput = {
      userId,
      name,
      icon
    }

    try {
      const category = await model.getCategory(id)

      if (category?.editable) {
        if (userId) {
          if (name && icon) {
            const updatedCategory = await model.update(id, data)
            res.json(updatedCategory)
          } handleHTTP(res, 'all params are required')
        } else handleHTTP(res, 'user not found', 404)
      } else handleHTTP(res, "this category isn't editable", 400)
    } catch (e: Error | any) {
      handleHTTP(res, e.message)
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params
    try {
      const category = await model.getCategory(id)

      if (category?.editable) {
        await model.delete(id)
        handleHTTP(res, `Category with id: ${id} deleted`, 200)
      } else handleHTTP(res, "this category can't be deleted", 400)
    } catch (e: Error | any) {
      handleHTTP(res, e.message)
    }
  }
}

export default new CategoryController()