import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
    try {

        const users = await prisma.user.findMany();
        res.status(200).json(users);
      
    } catch (err) {

        res.status(500).json({message : "failed to get users"});
       
    }
}

export const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });

        res.status(200).json(user);
       
    } catch (err) {

        res.status(500).json({message : "failed to get user"});
        
    }
}


export const updateUser = async (req, res) => {

    const id = req.params.id;

    const tokenUserId = req.userId;
    const body = req.body;
    const { password, avatar, ...inputs } = req.body;

    if (id !== tokenUserId) {
        return res.status(403).json({ message: "You are not authorized to update this user" });
    }

    let updatedpassword = null;

    if(password){
        updatedpassword = await bcrypt.hash(password, 10);
        updatedpassword = updatedpassword;
    }

    try {

        const updateUser = await prisma.user.update({
            where: { id },
            data: {
                ...inputs,
                ...(updatedpassword && {password: updatedpassword}),
                ...(avatar && {avatar}),
            },
        });

        const {password: userPassword, ...rest} = updateUser;

        res.status(200).json(rest);
        
    } catch (err) {

        res.status(500).json({message : "failed to get user"});

    }
}

export const deleteUser = async (req, res) => {

    const id = req.params.id;

   
    if (id !== tokenUserId) {
        return res.status(403).json({ message: "You are not authorized to update this user" });
    }

    try {

        await prisma.user.delete({
            where: {
                id
            }
        });

        res.status(200).json({message:"user deleted!"});
        
    } catch (err) {

        res.status(500).json({message : "failed to delete user"});
       
    }
}

export const savePost = async (req, res) => {
    const postId = req.body.postId;
    const tokenUserId = req.userId;
  
    try {
      const savedPost = await prisma.savedPost.findUnique({
        where: {
          userId_postId: {
            userId: tokenUserId,
            postId,
          },
        },
      });
  
      if (savedPost) {
        await prisma.savedPost.delete({
          where: {
            id: savedPost.id,
          },
        });
        res.status(200).json({ message: "Post removed from saved list" });
      } else {
        await prisma.savedPost.create({
          data: {
            userId: tokenUserId,
            postId,
          },
        });
        res.status(200).json({ message: "Post saved" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to delete users!" });
    }
  };

  export const profilePosts = async (req, res) => {
    const tokenUserId = req.userId;
    try {
      const userPosts = await prisma.post.findMany({
        where: { userId: tokenUserId },
      });
      const saved = await prisma.savedPost.findMany({
        where: { userId: tokenUserId },
        include: {
          post: true,
        },
      });
  
      const savedPosts = saved.map((item) => item.post);
      res.status(200).json({ userPosts, savedPosts });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to get profile posts!" });
    }
  };

