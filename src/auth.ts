import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { getDb } from "./db/mongo"
import { userCOLLECTION } from "./utils"
import { ObjectId } from "mongodb"

dotenv.config()


export const signToken=async(userId:string)=>{
    const LLAVE=process.env.SECRET
    if(!LLAVE) throw new Error("No esta el secret")
    return jwt.sign({userId},LLAVE as string,{expiresIn:"1h"})
}

const verifyToken=async(token:string)=>{
    try {
    const LLAVE=process.env.SECRET
    if(!LLAVE) throw new Error("No secret to decode")
    return jwt.verify(token,LLAVE) as {userId:string}
        
    } catch (error) {
        console.log("validate", error)
    }
}
export const getUserFromToken=async(token:string)=>{
    const payload=await verifyToken(token)
    if(!payload){
        return null
    }
    const db=getDb()
    return await db.collection(userCOLLECTION).findOne({
        _id:new ObjectId(payload.userId)
    })

}