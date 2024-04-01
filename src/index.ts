import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import routes from './routes'

const dbUri = process.env.DB_URI as string

mongoose.connect(dbUri).then(() => {

  const app = express()
  
  app.use(express.json())
  app.use(routes)
  
  app.listen(process.env.APP_PORT)

}).catch((error) => {
  console.log(error)
})
