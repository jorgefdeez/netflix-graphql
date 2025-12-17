import {Db, MongoClient} from "mongodb"
import dotenv from "dotenv"
import {dbName} from "../utils"

dotenv.config()

let client : MongoClient
let miBaseDeDatos : Db

export const  connectToMongoDb = async() : Promise<void> =>{
    try{
        const urlMongo = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.CLUSTER}.zolqtad.mongodb.net/?appName=${process.env.CLUSTER_NAME}`;

        client = new MongoClient(urlMongo)
        await client.connect();
        miBaseDeDatos = client.db(dbName);
        console.log("conectado a mongo")

    }catch(err){
        console.error("Error al conectar a Mongo")
        process.exit(1)
    }
    
}

export const getDb = () : Db => miBaseDeDatos;