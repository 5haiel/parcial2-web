import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator/roles.decorator';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/createAppointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'doctor', 'paciente')
  async findAll() {
    const appointments = await this.appointmentsService.findAll();
    if (appointments.length === 0) {
      throw new NotFoundException('No se encontraron citas');
    }
    return appointments;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string) {
    const appointment = await this.appointmentsService.findById(id);
    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }
    return appointment;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('paciente')
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return {
      appointment: await this.appointmentsService.create(createAppointmentDto),
      message: 'Cita creada con éxito',
    };
  }

  @Put(':id/update')
  @HttpCode(HttpStatus.OK)
  @Roles('doctor')
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: CreateAppointmentDto,
  ) {
    return {
      appointment: await this.appointmentsService.update(
        id,
        updateAppointmentDto,
      ),
      message: 'Cita actualizada con éxito',
    };
  }

  @Put(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @Roles('paciente')
  async cancel(@Param('id') id: string) {
    return {
      appointment: await this.appointmentsService.cancel(id),
      message: 'Cita eliminada con éxito',
    };
  }
}
