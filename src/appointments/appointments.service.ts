import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentsEntity } from './appointments.entity/appointments.entity';
import { Repository } from 'typeorm';
import { AppointmentsDto } from './dto/appointments.dto';
import { UsersEntity } from 'src/users/users.entity/users.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(AppointmentsEntity)
    private readonly appointmentsRepository: Repository<AppointmentsEntity>,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async create(data: AppointmentsDto): Promise<AppointmentsEntity> {
    const user = await this.usersRepository.findOne({
      where: { id: data.id_user },
    });

    const doctor = await this.usersRepository.findOne({
      where: { id: data.id_doctor },
    });

    if (!user || !doctor) {
      throw new NotFoundException('Usuario o doctor no encontrado');
    }

    const appointment = this.appointmentsRepository.create({
      description: data.description,
      id_user: user,
      id_doctor: doctor,
      datetime: data.datetime,
    });

    return this.appointmentsRepository.save(appointment);
  }

  async findAll(): Promise<AppointmentsEntity[]> {
    return this.appointmentsRepository.find({
      relations: ['id_user', 'id_doctor'],
    });
  }

  async findById(id: string): Promise<AppointmentsEntity | null> {
    return this.appointmentsRepository.findOne({
      where: { id },
      relations: ['id_user', 'id_doctor'],
    });
  }

  async update(id: string, data: AppointmentsDto): Promise<AppointmentsEntity> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
    });
    if (!appointment) {
      throw new NotFoundException('No se encontró la cita con el id dado');
    }

    const user = await this.usersRepository.findOne({
      where: { id: data.id_user },
    });
    const doctor = await this.usersRepository.findOne({
      where: { id: data.id_doctor },
    });

    if (!user || !doctor) {
      throw new NotFoundException('Usuario o doctor no encontrado');
    }

    appointment.description = data.description;
    appointment.datetime = data.datetime;
    appointment.id_user = user;
    appointment.id_doctor = doctor;

    return this.appointmentsRepository.save(appointment);
  }

  async cancel(id: string): Promise<AppointmentsEntity> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
    });
    if (!appointment) {
      throw new NotFoundException('No se encontró la cita con el id dado');
    }

    appointment.status = 'CANCELLED';
    return this.appointmentsRepository.save(appointment);
  }
}
