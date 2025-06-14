import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtLogoutAuthGuard extends AuthGuard('logout-jwt') {}
