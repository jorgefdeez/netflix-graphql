import { ObjectId } from "mongodb"


export type User= {
    _id: ObjectId
    email: string,
    password: string,
    mi_lista: string[],
    lista_amigos: string[]
}

export type OtherUsers={
    _id: ObjectId
    name: string,
    email: string,
}

export type Peli={
    _id?:ObjectId,
    name: string,
    length: string,
    date: string,
    format: string
}