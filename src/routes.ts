import { PostController } from './controllers/PostController';
import { Router } from "express"
import { UserController } from "./controllers/UserController"

const routes = Router()
const userController = new UserController()
const postController = new PostController()


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


routes.post('/feed',
  postController.create)

routes.get('/feed',
  postController.getAll)

routes.get('/feed/:id',
  postController.getOne)

export default routes
