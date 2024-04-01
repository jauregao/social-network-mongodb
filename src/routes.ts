import { PostController } from './controllers/PostController';
import { Router } from "express"
import { UserController } from "./controllers/UserController"

const routes = Router()
const userController = new UserController()
const postController = new PostController()

  /* users routes */
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

  /* post routes */
routes.post('/feed',
  postController.create)

routes.get('/feed',
  postController.getAll)

routes.get('/feed/:id',
  postController.getOne)

routes.patch('/feed/:id',
  postController.update)

routes.delete('/feed/:id',
  postController.delete)

routes.patch('/feed/:id/like',
  postController.likePost)

routes.patch('/feed/:id/comments',
  postController.commentPost)

export default routes
