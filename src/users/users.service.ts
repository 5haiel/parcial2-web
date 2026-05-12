import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity/users.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from 'src/auth/dto/register.dto/register.dto';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly rolesService: RolesService,
  ) {}

  async create(data: RegisterDto): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: { email: data.email },
    });
    if (user) {
      throw new ConflictException('Email ya registrado');
    }

    const newUser = this.usersRepository.create({
      ...data,
      password: data.password,
    });
    return this.usersRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<UsersEntity | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  async findById(id: string): Promise<UsersEntity | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  async findAll(): Promise<UsersEntity[]> {
    return this.usersRepository.find({ relations: ['roles'] });
  }

  async assignRoles(userId: string, roleNames: string[]): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const roles = await Promise.all(
      roleNames.map((name) => this.rolesService.findByName(name)),
    );

    if (roles.some((r) => !r)) {
      throw new BadRequestException('Roles no válidos');
    }

    user.roles = roles.filter((r) => r !== null);
    await this.usersRepository.save(user);

    return user;
  }
}
