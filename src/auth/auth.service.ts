import { Injectable } from '@nestjs/common';
import { PasswordHelper } from 'src/common/helpers/password.helper';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) {}

    async validateUser(username: string, passwordHash: string) {
        const user = await this.usersService.findOne(username);
        
        if (user && await PasswordHelper.compare(passwordHash, user.passwordHash)) {
            const {passwordHash: _, ...result} = user;
            return result;
        }
        return null;
    }
}
