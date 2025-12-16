import bcrypt from "bcryptjs"
import { getDb } from "../db/mongo"
import { userCOLLECTION } from "../utils"


export const createUser=async(email:string,password:string)=>{

    const db=getDb()
    const passwordEncryptao= await bcrypt.hash(password,10)

    const result= await db.collection(userCOLLECTION).insertOne({
        email,
        password:passwordEncryptao,
        mi_lista:[]
    })

    return result.insertedId.toString()

}

export const validateUser=async(email:string,password:string)=>{
    const db=getDb()
    const user=await db.collection(userCOLLECTION).findOne({email})
    if(!user){
       return null
    }
    const passComparada= await bcrypt.compare(password,user.password)
    if(!passComparada){
        throw new Error("Contraseña mal")
    }
    return user

}