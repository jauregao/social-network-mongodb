import { Request, Response, query } from "express"
import User from "../models/User"
import { TUser } from "../types"
import { Types } from "mongoose"

export class UserController {

  async getAll(_: Request, res: Response){
    try {
      const users = await User.find()
      return res.json(users)

    } catch (error) {
      return res.status(500).json({message: 'Internal Server Error'})
    }
  }

  async getOne(req: Request, res: Response) {
    const { id } = req.params
    
    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid user ID.' })

    try {
      const user = await User.findById(id)
      console.log("Usuário encontrado:", user);

      if(user === null) return res.status(404).json({message: 'User not found.'})

      return res.json(user)
    } catch (error) {
      console.error("Erro ao buscar usuário:", error)
      return res.status(500).json({message: 'Internal Server Error'})
      
    }
  }

  async create(req: Request, res: Response): Promise<TUser | Object> {
    const userData = req.body as TUser

    try {
      const existUserMailOrUsername = await User.findOne({
      $or: [{email: userData.email}, {username: userData.username}]
    })

    if(existUserMailOrUsername) return res.status(400).json({messaage: 'User or email already exists.'})

    const newUser = await User.create({
      name: userData.name,
      email: userData.email,
      username: userData.username,
      photo: userData.photo,
      description: userData.description,
      isActive: true,
      isVerified: false,
      createdAt: new Date()
    })
    
    return res.status(201).json(newUser)
    } catch (error) {
      return res.status(500).json({message: 'Internal Server Error'})
    }
  }

}
