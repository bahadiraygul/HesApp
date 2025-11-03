export declare class UserResponseDto {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
    password: string;
    constructor(partial: Partial<UserResponseDto>);
}
