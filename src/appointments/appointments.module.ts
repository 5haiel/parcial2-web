import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsEntity } from './appointments.entity/appointments.entity';
import { UsersEntity } from 'src/users/users.entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentsEntity, UsersEntity])],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
