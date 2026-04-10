// Đây là Port (Giao kèo) mà AuthService sẽ dùng. Nó không biết Prisma là gì.
export const AUTH_REPOSITORY = Symbol("AUTH_REPOSITORY");

export interface IAuthRepository {
  findUserWithPermissionsByUsername(username: string): Promise<any>;
  saveRefreshToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void>;
}