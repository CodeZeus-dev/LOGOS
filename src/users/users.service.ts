import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { PasswordHelper } from 'src/common/helpers/password.helper';

@Injectable()
export class UsersService {

  constructor(private readonly databaseService: DatabaseService){}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await PasswordHelper.hash(createUserDto.passwordHash);
    const user = {
      ...createUserDto,
      passwordHash: hashedPassword,
    }

    return this.databaseService.user.create({
      data: user,
    })
  }

  async findAll() {
    return this.databaseService.user.findMany()
  }

  async findOne(username: string) {
    return this.databaseService.user.findUnique({
      where: {
        email: username,
      }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.databaseService.user.update(({
      where: {
        id,
      },
      data: updateUserDto,
    }));
  }

  async remove(id: number) {
    return this.databaseService.user.delete({
      where: {
        id,
      }
    });
  }
}
