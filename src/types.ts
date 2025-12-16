import { ObjectId } from "mongodb"


export type User= {
    _id: ObjectId
    email: string,
    password: string,
    mi_lista: string[]
}

export type Peli={
    _id?:ObjectId,
    name: string,
    length: string,
    date: string,
    format: string
}