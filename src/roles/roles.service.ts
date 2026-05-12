import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesEntity } from './roles.entity/roles.entity';
import { CreateRoleDto } from './dto/create-role.dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,
  ) {}

  async create(dto: CreateRoleDto): Promise<RolesEntity> {
    const existing = await this.rolesRepository.findOne({
      where: { role_name: dto.role_name },
    });
    if (existing) {
      throw new ConflictException('role_name ya existe');
    }

    const role = this.rolesRepository.create(dto);
    return this.rolesRepository.save(role);
  }

  async findAll(): Promise<RolesEntity[]> {
    return this.rolesRepository.find();
  }

  async findByName(role_name: string): Promise<RolesEntity | null> {
    return this.rolesRepository.findOne({ where: { role_name } });
  }
}
