"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const argon2 = __importStar(require("argon2"));
const prisma_service_1 = require("@shared/infrastructure/prisma/prisma.service");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    prisma;
    jwt;
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { username: dto.username },
            include: {
                roles: {
                    include: {
                        role: {
                            include: {
                                permissions: { include: { permission: true } }
                            }
                        }
                    }
                }
            }
        });
        if (!user)
            throw new common_1.UnauthorizedException("Invalid credentials");
        const ok = await argon2.verify(user.passwordHash, dto.password);
        if (!ok)
            throw new common_1.UnauthorizedException("Invalid credentials");
        const permissions = Array.from(new Set(user.roles.flatMap((ur) => ur.role.permissions.map((rp) => rp.permission.code))));
        const payload = { sub: user.id, username: user.username, permissions };
        const accessToken = await this.jwt.signAsync(payload, {
            secret: process.env.JWT_ACCESS_SECRET ?? "change-me-access",
            expiresIn: process.env.JWT_ACCESS_TTL ?? "15m"
        });
        const refreshToken = await this.jwt.signAsync({ sub: user.id, jti: (0, crypto_1.randomUUID)() }, {
            secret: process.env.JWT_REFRESH_SECRET ?? "change-me-refresh",
            expiresIn: process.env.JWT_REFRESH_TTL ?? "30d"
        });
        await this.prisma.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: await argon2.hash(refreshToken),
                expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000)
            }
        });
        return { accessToken, refreshToken, user: { id: user.id, username: user.username, permissions } };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], AuthService);
