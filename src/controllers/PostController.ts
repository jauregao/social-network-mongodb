import { Types } from 'mongoose'
import User from '../models/User'
import { TPost } from './../types'
import { Request, Response } from "express"
import Post from '../models/Post'
import { uploadFile } from '../services/upload'

export class PostController {

  async create(req: Request, res: Response): Promise<TPost | Object>{
    const postData = req.body as TPost
    if (!Types.ObjectId.isValid(postData.user_id)) return res.status(400).json({ message: 'Invalid user ID.' })

    try {
      const user = await User.findById(postData.user_id)
      if(!user) return res.status(404).json({ message: 'User not found.' })

      const files = req.files as Express.Multer.File[]
      
      const images = await Promise.all(files.map(async (file) => {
        return await uploadFile(`posts/${file.originalname}`, file.buffer, file.mimetype)
      }))

      const newPost = await Post.create({
        user_id: user._id,
        description: postData.description,
        images,
        likes: [],
        comments: []
      })

      return res.status(201).json(newPost)
    } catch (error) {
      return res.status(500).json({message: 'Internal Server Error'})
    }
  }
  
  async getAll(_: Request, res: Response): Promise<TPost[] | Object>{
    try {
      const posts = await Post.aggregate([
          {
            $unwind: {
              path: '$comments',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'comments.user_id',
              foreignField: '_id',
              as: 'comments.user'
            }
          },
          {
            $unwind: {
              path: '$comments.user',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $group: {
              _id: '$_id',
              comments: { $push: '$comments' }
            }
          },
          {
            $lookup: {
              from: 'posts',
              localField: '_id',
              foreignField: '_id',
              as: 'postDetails'
            }
          },
          {
            $unwind: {
              path: '$postDetails',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $addFields: {
              'postDetails.comments': '$comments'
            }
          },
          { $replaceRoot: { newRoot: '$postDetails' } },
                {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          { $addFields: { 
              user: { 
                $first: '$user' 
              }
            }
          },
          {
            $addFields: {
              likes: {
                $cond: {
                  if: { $isArray: '$likes' },
                  then: { $size: '$likes' },
                  else: 0
                }
              }
            }
        }
      ])
    
      return res.status(200).json(posts)
    } catch (error) {
      return res.status(500).json({message: 'Internal Server Error'})
    }
  }
  
  async getOne(req: Request, res: Response): Promise<TPost | Object>{
    const { id } = req.params
    try {
      const post = await Post.findById(id)

      if(!post) return res.status(404).json({ message: 'Post not found.' })

      return res.json(post)
    } catch (error) {
      return res.status(500).json({message: 'Internal Server Error'})
    }
  }
  
  async update(req: Request, res: Response): Promise<void | Object>{
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
  
  async delete(req: Request, res: Response): Promise<void | Object>{
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
  
  async likePost(req: Request, res: Response){
    const { id } = req.params
    const { user_id } = req.body

    try {
      const post = await Post.findById(id)
      if(!post) return res.status(404).json({ message: 'Post not found.' })

      const user = await User.findById(user_id)
      if(!user) return res.status(404).json({ message: 'User not found.' })

      const likeExists = post.likes.find(like => String(like) === user_id)

      if(likeExists) {
        await Post.updateOne({ _id: id }, { 
          $pull: {
            likes: user._id
          }
      })
      return res.status(204).json()
      }

      await Post.updateOne({ _id: id }, { 
        $push: {
          likes: user._id
        }
      })
      return res.status(204).json()
    } catch (error) {
      console.log(error);
      
      return res.status(500).json({message: 'Internal Server Error'})
    }
  }
  
  async commentPost(req: Request, res: Response){
    const { id } = req.params
    const { user_id, description } = req.body

    try {

      const user = await User.findById(user_id)
      if(!user) return res.status(404).json({ message: 'User not found.' })

      const post = await Post.findById(id)
      if(!post) return res.status(404).json({ message: 'Post not found.' })

      await Post.updateOne({ _id: id }, { 
        $push: { 
          comments: {
            _id: new Types.ObjectId(),
            user_id: user._id,
            description
          }
        } 
      })

      return res.status(204).json()
    } catch (error) {
      return res.status(500).json({message: 'Internal Server Error'})
    }
  }
}