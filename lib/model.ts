export interface LoginRequest{
    username: string,
    password?: string
}

export interface RegisterRequest{
    username: string,
    password?: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    address?: string,
    avatarURL?: string
}

export interface CreateUserRequest{
    username: string,
    password?: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    address?: string,
    avatarURL?: string,
    role: 'DOCTOR' | 'MEDICAL_STAFF' | 'ADMIN'
}

//RESPONSE

export interface LoginResponse{
    token: string,
    type: string,
    userId: number,
    username: string,
    role: string
}

export interface MessageResponse{
    message: string
}

export interface ErrorResponse{
    statusCode: number,
    timestamp: string,
    message: string,
    description: string
}