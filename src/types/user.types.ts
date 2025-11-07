export interface User {
    id: number;
    email: string;
    password_hash: string;
    name: string;
    role: string;
    display_picture?: string;
    created_at: Date;
}
