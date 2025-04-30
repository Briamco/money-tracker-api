import { Prisma, PrismaClient } from "../../prisma/generated/client";

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
  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email }
    })
  }
  async update(id: string, data: Prisma.UserUncheckedUpdateInput) {
    return await prisma.user.update({
      where: { id },
      data
    })
  }
}

export default new AuthModel()