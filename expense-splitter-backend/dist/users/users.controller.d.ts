import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: User): UserResponseDto;
    updateProfile(updateUserDto: UpdateUserDto, user: User): Promise<UserResponseDto>;
    findOne(id: string): Promise<UserResponseDto>;
}
