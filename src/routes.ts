import { Router } from "express"
import { UserController } from "./controllers/UserController"

const routes = Router()
const userController = new UserController();


routes.post('/user',
  userController.create)

routes.get('/user/:id',
  userController.getOne)

routes.put('/user/:id',
  userController.update)

routes.patch('/user/:id/deactivate',
  userController.deactivate)
  
routes.get('/users',
    userController.getAll)

export default routes
