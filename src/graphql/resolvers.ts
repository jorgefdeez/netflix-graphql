    import { IResolvers } from "@graphql-tools/utils";
    import{createUser, validateUser} from "../collections/users"
    import{aniadirAmigo, crearAmigo} from "../collections/friends"
    import{signToken} from "../auth"
    import { createPeli, getPeliID, getPelis, eliminarPelicula, añadirPeliLista, eliminarPeliLista, actualizarPeli, eliminarPeliculaYQuitarlaLista} from "../collections/pelis";
    import { getDb } from "../db/mongo";
    import { ObjectId } from "mongodb";
    import { pelisCOLLECTION, friendsCOLLECTION } from "../utils";
    import { Peli, User ,OtherUsers} from "../types";

    export const resolvers: IResolvers = {
        User:{
                mi_lista:async(parent:User)=>{
                    const db=getDb()
                    const ids=parent.mi_lista as Array<string>||[]  //si tipas con user, no hace falta el as array

                    const idMongo= ids.map(x=>new ObjectId(x))

                    return await db.collection<Peli>(pelisCOLLECTION).find({
                        _id:{$in:idMongo}

                    }).toArray()

                },

                lista_amigos:async(parent:User)=>{
                    const db = getDb()
                    const ids = parent.lista_amigos 

                    const idMongo= ids.map(x=>new ObjectId(x))
 
                    return await db.collection<OtherUsers>(friendsCOLLECTION).find({
                        _id:{$in:idMongo}

                    }).toArray()
                }
        },
        Query: {
                me: async (_, __, { user }) => {
                    console.log(user)
                    if (!user) {
                        throw new Error("logeate perro")
                    }
                    return {
                        _id: user._id,
                        ...user
                    }
                },
                
                Pelis: async (_, { page, size }) => {
                    return await getPelis(page, size)
                },
                PeliID: async (_, { id }) => {
                    return await getPeliID(id)
                }
        }, 
        Mutation:{
                register: async (_, { email, password }: { email: string, password: string }) => {
                const idUserCreado = await createUser(email, password)
                return signToken(idUserCreado)
                },
                login: async (_, { email, password }: { email: string, password: string }) => {
                    const user = await validateUser(email, password)
                    if (!user) { throw new Error("Credencialias no validos") }
                    return signToken(user._id.toString())
                },


                addPeli: async (_, { name, length, date, format }, { user }) => {
                    if (!user) {
                        throw new Error("logeate")
                    }
                    const result = await createPeli(name, length, date, format)
                    return result

                },
                deletePeli: async (_, {id}, { user }) => {
                    if (!user) {
                        throw new Error("logeate")
                    }
                    const result = await eliminarPelicula(id)
                    return result
                },
                updatePeli: async(_, {id, name, length, date, format}, {user}) =>{
                    if(!user){
                        throw new Error("logeate bien")
                    }
                    const update = await actualizarPeli(id, name, length, date, format)
                    return update
                },


                addPeliToUser: async(_, {idPeli}, { user }) => {
                    if (!user) {
                    throw new Error("logeate bien")
                    }
                    return await añadirPeliLista(idPeli,user._id.toString())
                },
                removePeliFromUser: async(_,{idPeli}, {user}) =>{
                    if(!user){
                        throw new Error("logeate bien") 
                    }
                    return await eliminarPeliLista(idPeli,user._id.toString())
                },
                delete_Peli_From_Db_and_List:async (_, {idPeli}, { user }) => {
                    if(!user){
                        throw new Error("logeate bien") 
                    }
                    return await eliminarPeliculaYQuitarlaLista(idPeli)

                },


                addFriend: async(_,{idAmigo}, {user}) =>{
                    if(!user){
                        throw new Error("logeate anda")
                    }
                    return await aniadirAmigo(idAmigo, user._id.toString())
                },
                crearFriend: async(_,{name, email}, {user}) => {
                    console.log(user)
                    if(!user){
                        throw new Error("logeate anda")

                    }
                    const result = await crearAmigo(name, email)
                    return result
                }



        }
    }