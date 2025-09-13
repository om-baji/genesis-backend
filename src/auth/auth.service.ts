import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { SignupSchema } from './dto/signup.dto';
import { comparePasswords, hashPassword, PrismaService } from 'src/utils';
import { JwtService } from '@nestjs/jwt'
import { LoginSchema } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    async registerUser(payload: SignupSchema) {

        const exist = await this.prisma.user.findUnique({
            where: {
                email: payload.email
            }
        })

        if (exist) throw new ConflictException('User Already Exists!')

        const hash = await hashPassword(payload.password)

        const user = await this.prisma.user.create({
            data: {
                name: payload.name,
                email: payload.email,
                password: hash
            }
        })

        const tokens = await this.generateTokens({
            id: user.id,
            email: user.email
        })

        await this.prisma.user.update({
            where: {
                email: user.email,
            },
            data: {
                refreshToken: await hashPassword(tokens.refreshToken)
            }
        })

        return tokens;
    }

    async loginUser(payload: LoginSchema) {
        const exist = await this.prisma.user.findUnique({
            where: {
                email: payload.email
            }
        })

        if (!exist) throw new NotFoundException('User does not Exists!')

        const isValid = await comparePasswords(payload.password, exist.password);

        if (!isValid) throw new Error("Wrong password or email!")

        const tokens = await this.generateTokens({
            id: exist.id,
            email: exist.email
        })

        await this.saveRefreshToken(exist.id, tokens.refreshToken)

        return tokens;
    }

    async generateTokens(user: { id: string; email: string }) {
        const payload = { sub: user.id, email: user.email };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: '15m',
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    async refreshToken(token: string) {
        const payload = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_REFRESH_SECRET,
        });

        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });

        if (!user || !user.refreshToken)
            throw new ForbiddenException('Access Denied');

        const isMatch = await comparePasswords(token, user.refreshToken);
        if (!isMatch) throw new ForbiddenException('Access Denied');

        const newTokens = await this.generateTokens({
            id: user.id,
            email: user.email,
        });

        await this.saveRefreshToken(user.id, newTokens.refreshToken);

        return newTokens;
    }

    async saveRefreshToken(id: string, token: string) {
        await this.prisma.user.update({
            where: {
                id
            },
            data: {
                refreshToken: await hashPassword(token)
            }
        })
    }

}
