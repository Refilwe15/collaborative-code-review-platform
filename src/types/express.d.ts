
import { User } from "./user.types";

interface AuthUser extends User {
    role: string;
}

declare global {
    namespace Express {
        export interface Request {
            user?: AuthUser;
        }
    }
}

export {};