
export interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    birthday: Date;
    role: string;
    password?: string;
}
