export declare class PasswordService {
    private readonly saltRounds;
    hashPassword(password: string): Promise<string>;
    comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
