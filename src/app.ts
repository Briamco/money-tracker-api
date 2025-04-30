import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { router, authRouter } from './routes'

const app = express()

app.use(express.json())
app.use(cors({
  origin: 'https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--5173--d4eba4a9.local-credentialless.webcontainer-api.io', // O usa una función si quieres múltiples orígenes
  credentials: true               // Esto es lo que permite enviar cookies
}))
app.use('/api', router)
app.use('/auth', authRouter)

export default app