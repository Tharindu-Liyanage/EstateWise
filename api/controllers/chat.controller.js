import { PropertyType } from "@prisma/client";
import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
    
    const tokenUserId = req.userId;
    try {  
        const chats = await prisma.chat.findMany({
            where: {
                userIDs:{
                    hasSome: [tokenUserId]
                }
            }
        });

        for( const chat of chats){

            const reciverId = chat.userIDs.find(id => id !== tokenUserId);

            const reciver = await prisma.user.findUnique({
                where: {
                    id: reciverId
                },
                select: {
                    username: true,
                    avatar: true
                }
            });

            chat.receiver = reciver;

        }

        res.status(200).json(chats);

    } catch (err) {   
        res.status(500).json({message : "failed to get chats" , error: err});
    }
}

export const getChat = async (req, res) => {
   
    const tokenId = req.userId;

    try {  

        const chat = await prisma.chat.findUnique({
            where: {
                id: req.params.id,
                userIDs:{
                    hasSome: [tokenId]
                },
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        });

        await prisma.chat.update({
            where: {
                id: req.params.id
            },
            data: {
                seenBy: {
                    push: tokenId
                }
            }
        });

        res.status(200).json(chat);


    } catch (err) { 
        
        res.status(500).json({message : "failed to get chat" , error: err});
    }
}

export const addChat = async (req, res) => {
   const tokenId = req.userId;

    try {  

        const newChat = await prisma.chat.create({
            data: {
                userIDs: [tokenId, req.body.receiverId]
            }
        });

        res.status(201).json(newChat);


    } catch (err) {   
    }
}

export const readChat = async (req, res) => {
    const tokenId = req.userId;

    try {  

        const chat = await prisma.chat.update({
            where: {
                id: req.params.id,
                userIDs:{
                    hasSome: [tokenId]
                 },
            },
            data: {
                seenBy: {
                    push: tokenId
                }
            }   
        });

        res.status(200).json(chat);


    } catch (err) {  
        res.status(500).json({message : "failed to read chat" , error: err}); 
    }
}



