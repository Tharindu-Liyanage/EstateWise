import { PropertyType } from "@prisma/client";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
    const query = req.query;

    try {

        const posts = await prisma.post.findMany({
            where:{
                city: query.city || undefined,
                type: query.type || undefined,
                property: query.property || undefined,
                price: query.price || undefined,
                bedrooms: query.bedrooms || undefined,
                price:{
                    gte:parseInt(query.minPrice) || 0,
                    lte:parseInt(query.maxPrice) || 10000000
                },
            }}
        );
        res.status(200).json(posts);
      
    } catch (err) {

        res.status(500).json({message : "failed to get posts"});
       
    }
}

export const getPost = async (req, res) => {
    const id = req.params.id;
    try {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          postDetail: true,
          user: {
            select: {
              username: true,
              avatar: true,
            },
          },
        },
      });
  
      const token = req.cookies?.token;
  
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
          if (!err) {
            const saved = await prisma.savedPost.findUnique({
              where: {
                userId_postId: {
                  postId: id,
                  userId: payload.id,
                },
              },
            });
            res.status(200).json({ ...post, isSaved: saved ? true : false });
          }
        });
      }else{

          res.status(200).json({ ...post, isSaved: false });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to get post" });
    }
  };

export const createPost = async (req, res) => {

    const body = req.body;
    const tokenId = req.userId;



    try{

        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                userId: tokenId,
                postDetail:{
                    create: body.postDetail

                }
            }
        });

        res.status(201).json(newPost);

    }catch(err){

        res.status(500).json({message : "failed to create post" , error: err});

    }

}

export const updatePost = async (req, res) => {

    const body = req.body;
    const id = req.params.id;
    const tokenId = req.userId;

    try{

        const post = await prisma.post.findUnique({
            where: {
                id
            }
        });

        if(post.userId !== tokenId){
            return res.status(401).json({message: "You are not allowed to update this post"});
        }

        await prisma.post.update({
            where: {
                id
            },
            data: {
                ...body
            }
        });

        res.status(200).json({message: "Post updated"});

    }catch{

        res.status(500).json({message : "failed to update post"});

    }

}

export const deletePost = async (req, res) => {

    const id = req.params.id;

    const tokenId = req.userId;

    try{

        const post = await prisma.post.findUnique({
            where: {
                id
            }
        });

        if(post.userId !== tokenId){
            return res.status(401).json({message: "You are not allowed to delete this post"});
        }

        await prisma.post.delete({
            where: {
                id
            }
        });

        res.status(200).json({message: "Post deleted"});

    }catch{

        res.status(500).json({message : "failed to delete post"});
            
    }
}

