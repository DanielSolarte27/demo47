import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

// function validateRequest(request) {
//   const token = request.headers['token']
//   return token === '1234';
// }

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1] ?? '';

    try {
      const secret = process.env.JWT_SECRET;
      const payload = this.jwtService.verify(token, { secret });
      payload.iat = new Date(payload.iat * 1000); // emitido
      payload.exp = new Date(payload.exp * 1000); // expira
      payload.roles = ['admin'];

      request.user = payload;
      // console.log(payload);
      return true;
    } catch (error) {
      throw new BadRequestException('Invalid Token');
    }

    // return validateRequest(request);
  }
}
