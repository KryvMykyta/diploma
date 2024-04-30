declare namespace Express {
    export interface Request {
       user?: User
    }
}

type User = {
    id: string
    username: string
}