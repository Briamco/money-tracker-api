import { Response } from "express";
import { Error } from "../interfaces/error";

const handleHTTP = (res: Response, error: string, status: number = 500) => {
  console.error(error)
  res.status(status)
  res.send({ error })
}

export { handleHTTP }