
import { getDb } from "../db/mongo"
import { friendsCOLLECTION, userCOLLECTION } from "../utils"
import {ObjectId} from "mongodb"

export const getFriendID = async(idUser:string) =>{
    const db = getDb()
    return db.collection(friendsCOLLECTION).findOne({ _id: new ObjectId(idUser) })
}


export const aniadirAmigo=async(idAmigo: string, userId: string) =>{
    const db = getDb()
    const añadirAmigo = await getFriendID(idAmigo)
    console.log(añadirAmigo)
    if(!añadirAmigo){
        throw new Error("usuario no encontrado")
    }

    await db.collection(userCOLLECTION).updateOne({
        _id: new ObjectId(userId)
    },
        {$addToSet:{lista_amigos: idAmigo}}
    )

    const updateUser = await db.collection(userCOLLECTION).findOne({
        _id: new ObjectId(userId)
    })
    return updateUser
}

export const crearAmigo = async (name: string, email: string) => {
    const db = getDb()
    const report = await db.collection(friendsCOLLECTION).findOne({name})
    if(report){
        return new Error("Ya existe el user")
    }
    const result = await db.collection(friendsCOLLECTION).insertOne({
        name,
        email
    })
    const newFriend = await getFriendID(result.insertedId.toString())
    console.log(newFriend)
    return newFriend
}

