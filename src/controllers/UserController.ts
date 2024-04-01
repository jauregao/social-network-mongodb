import { Request, Response, query } from "express"
import User from "../models/User"
import { TUser } from "../types"
import { Types } from "mongoose"

export class UserController {

  async getAll(_: Request, res: Response): Promise<TUser[] | Object> {
    try {
      const users = await User.find()
      return res.json(users)
    } catch (error) {
      return res.status(500).json({message: 'Internal Server Error'})
    }
  }

  async getOne(req: Request, res: Response): Promise<TUser | Object> {
    const { id } = req.params
    
    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid user ID.' })

    try {
      const user = await User.findById(id)

      if(!user) return res.status(404).json({message: 'User not found.'})

      return res.json(user)
    } catch (error) {
      return res.status(500).json({message: 'Internal Server Error'})
    }
  }

  
  async update(req: Request, res: Response): Promise<void | Object>{
    const { id } = req.params
    const userData = req.body as TUser
    
    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid user ID.' })

    try {
      const user = await User.findById(id)

      if(!user) return res.status(404).json({message: 'User not found.'})

      const existUserMailOrUsername = await User.findOne({
        $or: [{email: userData.email, _id: { $ne: id }}, {username: userData.username, _id: { $ne: id }}]
      })

      if(existUserMailOrUsername) return res.status(400).json({messaage: 'User or email already exists.'})

      await User.updateOne(
      {_id: id}, {
      name: userData.name,
      email: userData.email,
      username: userData.username,
      photo: userData.photo,
      description: userData.description
    })
    
    return res.status(204).json()
    } catch (error) {
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

  async deactivate(req: Request, res: Response): Promise<void | Object>{
    const { id } = req.params
    
    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid user ID.' })

    try {
      const user = await User.findById(id)

      if(!user) return res.status(404).json({message: 'User not found.'})

      await User.updateOne( {_id: id}, {
        isActive: false
      })
      
      return res.status(204).json()
    } catch (error) {
      return res.status(500).json({message: 'Internal Server Error'})
    }
  }
}
