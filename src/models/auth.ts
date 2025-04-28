import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

class AuthModel {
  async register(data: Prisma.UserUncheckedCreateInput) {
    return await prisma.user.create({
      data
    })
  }
  async login(email: string) {
    return await prisma.user.findUnique({
      where: { email }
    })
  }
  async getUser(id: string) {
    return await prisma.user.findUnique({
      where: { id }
    })
  }
  async verify(id: string) {
    return await prisma.user.update({
      where: { id },
      data: {
        verified: true
      }
    })
  }
}

export default new AuthModel()