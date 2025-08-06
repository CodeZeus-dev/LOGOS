import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Prisma } from "generated/prisma";

export class CreateUserDto implements Prisma.UserCreateInput {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    passwordHash: string;
}
