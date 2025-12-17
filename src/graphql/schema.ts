import { gql } from "apollo-server";

export const typeDefs = gql`

    type User{
        _id: ID!,
        email: String!,
        mi_lista: [Peli]!,
        lista_amigos: [UserFriend]!
    }

    type UserFriend{
        _id: ID!,
        name: String,
        email: String!,
    }

    type Peli{
        _id: ID!
        name: String,
        length: Int,
        date: String,
        format: String
    }

    type Query{
        me: User!
        Pelis(page: Int, size: Int): [Peli]!
        PeliID(id: ID!): Peli
    }

    type Mutation{
        register(email: String!, password: String!): String!
        login(email: String!, password: String!): String!,

        addPeli(name: String!, length: Int!, date: String!, format: String!) : Peli!
        updatePeli(id: ID!, name: String, length: Int, date: String, format: String): Peli!
        deletePeli(id: ID!): [Peli]!

        addPeliToUser(idPeli: ID!): User!
        removePeliFromUser(idPeli: ID!): User!,
        delete_Peli_From_Db_and_List(idPeli: ID!) : [Peli]!

        addFriend(idAmigo: ID!): User!,
        crearFriend(name: String!, email: String!): UserFriend!
    }
`