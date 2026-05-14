import { IsDate, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  description!: string;

  @IsString()
  id_user!: string;

  @IsString()
  id_doctor!: string;

  @IsDate()
  datetime!: Date;
}
