import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto/register.dto';
import { LoginDto } from './dto/login.dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    if (!user.is_active) throw new HttpException('Usuario desactivado', HttpStatus.LOCKED);

    const passwordValid = await bcrypt.compare(pass, user.password);
    if (!passwordValid) return null;

    const { password, ...result } = user;
    return result;
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email ya registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    return {
      message: 'Usuario registrado con éxito',
      userId: newUser.id,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const jwt = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      roles: user.roles.map((r) => r.role_name),
    });
    return { access_token: jwt };
  }
}
