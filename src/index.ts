import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'

const dbUri = process.env.DB_URI as string

mongoose.connect(dbUri).then(() => {
  
  const app = express()
  
  app.use(express.json())
  
  app.get('/', (req, res) => { return res.json('tudo ok')})
  
  app.listen(process.env.APP_PORT)
}).catch((error) => {
  console.log(error)
})
