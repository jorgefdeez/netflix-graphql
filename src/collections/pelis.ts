import { ObjectId } from "mongodb"
import { getDb } from "../db/mongo"
import { pelisCOLLECTION, userCOLLECTION } from "../utils"
import { User } from "../types"

export const createPeli = async (name: string, length: number, date: string, format: string) => {
    const db = getDb()
    const report = await db.collection(pelisCOLLECTION).findOne({name})
    if(report){
        return new Error("Ya existe la peli")
    }
    const result = await db.collection(pelisCOLLECTION).insertOne({
        name,
        length,
        date,
        format
    })
    const newPeli = await getPeliID(result.insertedId.toString())
    console.log(newPeli)
    return newPeli
}


export const getPelis = async (page?: number, size?: number) => {
    const db = getDb()
    page = page || 1
    size = size || 10

    return await db.collection(pelisCOLLECTION).find().skip((page - 1) * size).limit(size).toArray()
}

export const getPeliID = async (id: string) => {
    const db = getDb()
    return await db.collection(pelisCOLLECTION).findOne({ _id: new ObjectId(id) })
}

export const eliminarPelicula = async (id: string) =>{
    const db = getDb()
    const eliminado = await db.collection(pelisCOLLECTION).deleteOne({_id: new ObjectId(id)})
    if(!eliminado) throw new Error("No se ha encontrado la peli")   

    const pelis = getPelis()
    return pelis
}

export const añadirPeliLista = async(idPeli: string, userId: string) =>{
    const db = getDb()
    const añadiPeli = await getPeliID(idPeli)
    if (!añadiPeli) {
        throw new Error("Peli no encontrada")
    }
    await db.collection(userCOLLECTION).updateOne({
        _id: new ObjectId(userId)
    },
        {$addToSet: { mi_lista: idPeli } }
    )

    const updateUser = await db.collection(userCOLLECTION).findOne({
        _id: new ObjectId(userId)
    })

    return updateUser
}

export const eliminarPeliLista = async(idPeli: string, userId: string) =>{
    const db=getDb()

    const iduser=new ObjectId(userId)
    const eliminarPeli=await getPeliID(idPeli)
    if(!eliminarPeli){
        throw new Error("No se ha encontrado la peli")
    }

    await db.collection<User>(userCOLLECTION).updateOne(
        {_id:iduser},
        {$pull:{mi_lista:idPeli}}
    )

    const updateUser = await db.collection(userCOLLECTION).findOne({
        _id: new ObjectId(userId)
    })

    return updateUser
}

export const actualizarPeli = async (id: string, name?: string, length?: number, date?: string, format?: string) => {
    const db = getDb()

    const updateData: any = {}

    if (name) updateData.name = name
    if (length) updateData.length = length
    if (date) updateData.date = date
    if (format) updateData.format = format

    if (!updateData) {
        throw new Error("No hay datos para actualizar")
    }

    const result = await db.collection(pelisCOLLECTION).updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
    )

    if (result.matchedCount === 0) {
        throw new Error("No se ha encontrado la peli")
    }

    return await getPeliID(id)
}
