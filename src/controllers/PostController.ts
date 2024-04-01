import { Types } from 'mongoose'
import User from '../models/User'
import { TPost } from './../types'
import { Request, Response } from "express"
import Post from '../models/Post'

export class PostController {

  async create(req: Request, res: Response){
    const postData = req.body as TPost
    if (!Types.ObjectId.isValid(postData.user_id)) return res.status(400).json({ message: 'Invalid user ID.' })

    try {

      const user = await User.findById(postData.user_id)
      if(!user) return res.status(404).json({ message: 'User not found.' })
      
      const newPost = await Post.create({
        user_id: user._id,
        description: postData.description,
        images: postData.images,
        likes: 0,
        comments: []
      })

      return res.status(201).json(newPost)
    } catch (error) {
      return res.status(500).json({message: 'Internal Server Error'})
    }
  }
  
  async getAll(_: Request, res: Response){
    try {
      const posts = await Post.find() 
      return res.status(200).json(posts)
    } catch (error) {
      return res.status(500).json({message: 'Internal Server Error'})
    }
  }
  
  async getOne(req: Request, res: Response){
    const { id } = req.params
    try {
      const post = await Post.findById(id)

      if(!post) return res.status(404).json({ message: 'Post not found.' })

      return res.json(post)
    } catch (error) {
      return res.status(500).json({message: 'Internal Server Error'})
    }
  }
  
  async update(req: Request, res: Response){
    const { id } = req.params
    const { description } = req.body

    try {
      const post = await Post.findById(id)

      if(!post) return res.status(404).json({ message: 'Post not found.' })

      await Post.updateOne({ _id: id }, { description })

      return res.status(204).json()
    } catch (error) {
      return res.status(500).json({message: 'Internal Server Error'})
    }
  }
  
  async delete(req: Request, res: Response){
    const { id } = req.params

    try {
      const post = await Post.findById(id)

      if(!post) return res.status(404).json({ message: 'Post not found.' })

      await Post.deleteOne({ _id: id })

      return res.status(204).json()
    } catch (error) {
      return res.status(500).json({message: 'Internal Server Error'})
    }
  }
  
  async like(req: Request, res: Response){
     try {
      
    } catch (error) {
      return res.status(500).json({message: 'Internal Server Error'})
    }
  }
  
  async comment(req: Request, res: Response){
     try {
      
    } catch (error) {
      return res.status(500).json({message: 'Internal Server Error'})
    }
  }
}