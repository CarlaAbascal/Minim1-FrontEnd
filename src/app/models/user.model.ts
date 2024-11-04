
export interface User {
    _id?: string; // MongoDb genera automàticament aquest camp
    username: string,
    name: string,
    email: string,
    password: string,
    actualUbication: [],
    inHome: boolean,
    admin: boolean,
    isEnabled:boolean, //habilitar/deshabilitar
}

export type login = Pick<User, 'username' | 'password' >
    

  