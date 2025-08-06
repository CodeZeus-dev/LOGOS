import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordHelper } from 'src/common/helpers/password.helper';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findOne(username);
        
        if (user && await PasswordHelper.compare(password, user.passwordHash)) {
            const {passwordHash: _, ...result} = user;
            return result;
        }
        return null;
    }

    async register(createUserDto: CreateUserDto) {
        const existingUser = await this.usersService.findOne(createUserDto.email);

        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const user = await this.usersService.create(createUserDto);
        const payload = { username: user.email, sub: user.id };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user.id };

        const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    async refreshToken(token: string) {
        try {
            const payload = this.jwtService.verify(token);

            const user = await this.usersService.findOne(payload.username);
            if (!user) throw new UnauthorizedException();

            const newAccessToken = this.jwtService.sign(
                { username: user.email, sub: user.id },
                { expiresIn: '1h' },
            );

            return {
                access_token: newAccessToken,
            };
        } catch (e) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

    async logout(userId: number) {
        // In a JWT-based system, logout is typically handled client-side
        // by removing the token from storage. For server-side logout,
        // you would need to implement token blacklisting.
        
        // For now, we'll just return a success message
        // In a production system, you might want to:
        // 1. Add the token to a blacklist/redis cache
        // 2. Log the logout event
        // 3. Invalidate refresh tokens for this user
        
        return { message: 'Logout successful' };
    }
}
