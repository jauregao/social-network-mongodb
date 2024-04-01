import { Request, Response } from "express"
import User from "../models/User"
import { TUser } from "../types"

export class UserController {

  async create(req: Request, res: Response) {
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
