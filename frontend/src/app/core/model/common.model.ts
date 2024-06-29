export interface User {
    id: string,
    userName: string,
    email: string,
    phoneNumber: string,
}

export interface LoginPayLoad {
    email: string,
    password: string,
}

export interface RegisterPayLoad {
    phoneNumber: string,
    email: string,
    password: string,
}

export interface ApiResponse<T> {
    status?: boolean,
    data: T,
    message?: string
    error?: string
    token?: string
}
