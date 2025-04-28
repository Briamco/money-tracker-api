import { Request, Response } from 'express'
import model from '../models/auth'
import { handleHTTP } from '../utils/error.handle'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Error } from '../interfaces/error'
import { sendCode } from '../utils/email'

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

class AuthController {
  async register(req: Request, res: Response) {
    const { name, email, password, currencyId } = req.body
    const verifyCode = code()

    const hashed = await bcrypt.hash(password, 10)

    const data: Prisma.UserUncheckedCreateInput = {
      name,
      email,
      verifyCode,
      password: hashed,
      currencyId
    }

    try {
      const user = await model.register(data)
      if (user) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string)
        sendCode(email, verifyCode)
        res.status(201).json({ token, user })
      } else handleHTTP(res, 'Email in use', 400)
    } catch (e: Error | any) {
      handleHTTP(res, e.message)
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body
    try {
      const user = await model.login(email)
      if (user) {
        const verify = user.verified
        const match = await bcrypt.compare(password, user.password)
        if (match && verify) {
          const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string)
          res.json({ token, user })
        } else if (!verify) handleHTTP(res, 'user not verify', 400)
        else handleHTTP(res, 'password incorrect', 400)
      } else handleHTTP(res, 'user not found', 404)
    } catch (e: Error | any) {
      handleHTTP(res, e.message)
    }
  }

  async verify(req: Request, res: Response) {
    const { code } = req.params
    const userId = req.userId as string
    try {
      const user = await model.getUser(userId)

      if (user) {
        const verified = parseInt(code, 10) === user.verifyCode
        const expired = (Date.now() - new Date(user.updatedAt).getTime()) > 1000 * 60 * 10;
        if (verified && !expired) {
          await model.verify(userId)
          handleHTTP(res, 'verified', 200)
        } else handleHTTP(res, 'Code expired', 400)
      } else handleHTTP(res, 'user not found', 404)
    } catch (e: Error | any) {
      handleHTTP(res, e.message)
    }
  }

  async resendCode(req: Request, res: Response) {
    const userId = req.userId as string
    const verifyCode = code()
    const date = new Date

    const data: Prisma.UserUncheckedUpdateInput = {
      verifyCode,
      updatedAt: date
    }

    try {
      const user = await model.getUser(userId)

      if (user) {
        const expired = (Date.now() - new Date(user.updatedAt).getTime()) > 1000 * 60 * 10;
        if (expired) {
          await model.resendCode(userId, data)
          sendCode(user.email, verifyCode)
          handleHTTP(res, 'new code sended', 200)
        } else {
          sendCode(userId, user.verifyCode)
          handleHTTP(res, 'code sended', 200)
        }
      } else handleHTTP(res, 'user not found', 404)
    } catch (e: Error | any) {
      handleHTTP(res, e.message)
    }
  }
}

const code = () => Math.floor(100000 + Math.random() * 900000)

export default new AuthController()