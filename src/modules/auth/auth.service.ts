import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  // =========================
  // REGISTER
  // =========================
  async register(data: { email: string; password: string }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: Role.USER,
      },
    });
  }

  // =========================
  // LOGIN
  // =========================
  async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.generateTokens(user);
  }

  // =========================
  // REFRESH TOKEN
  // =========================
	async refresh(token: string) {
	  try {
		const decoded = this.jwtService.verify<{
		  sub: number;
		  email: string;
		}>(token, {
		  secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
		});

		const user = await this.prisma.user.findUnique({
		  where: { id: Number(decoded.sub) },
		});

		if (!user) throw new UnauthorizedException();

		return this.generateTokens(user);
	  } catch {
		throw new UnauthorizedException('Refresh token inválido');
	  }
	}

  // =========================
  // LOGOUT (mock - depois evoluímos)
  // =========================
  async logout(userId: number) {
    return {
      message: `Logout realizado com sucesso para usuário ${userId}`,
    };
  }

  // =========================
  // TOKENS (PADRÃO SAAS)
  // =========================
  private generateTokens(user: {
    id: number;
    email: string;
    role: Role;
  }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.config.get<string>('JWT_SECRET'),
        expiresIn: '15m', // ✅ STRING (corrige erro)
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d', // ✅ STRING (corrige erro)
      }),
    };
  }
}