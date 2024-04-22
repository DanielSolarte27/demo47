import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/auth.guard';
import { DateAdderInterceptor } from '../interceptors/date-adder.interceptor';
import { UsersDbService } from './users-db.service';
import { Request, Response } from 'express';
import { UsersBodyDto } from './users.dto';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { Roles } from '../decorators/roles.decorators';
import { Role } from '../role.enum';
import { RolesGuard } from '../guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersDbService: UsersDbService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly authService: AuthService,
  ) {}

  @Get('auth0/protected')
  getAuth0(@Req() request: any) {
    // console.log(JSON.stringify(request.oidc));
    // console.log(JSON.stringify(request.oidc.user));
    return JSON.stringify(request.oidc.user);
  }

  @Get('admin')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  getAdmin() {
    return 'Ruta protegida';
  }

  @Get()
  getUsers(@Query('name') name: string) {
    if (name) {
      return this.usersService.getUserByName(name);
    }
    return this.usersService.getUsers();
  }

  @Get('profile')
  getProfile(@Headers('token') token: string) {
    if (!token) return 'Token is missing';
    if (token !== '1234') return 'Token invalido';
    return 'Perfil del usuario';
  }

  @Get('profile/images')
  @UseGuards(AuthGuard)
  getProfilePics() {
    return 'Devuele las imagenes del perfil';
  }

  @Post('profile/images')
  // @UseGuards(AuthGuard)
  //* Extrae el archivo de la solicitud http, Se hace uso del interceptor de archivos de express
  //* se extrae dicho archivo el cual vamos a estar cargando dentro del formulario bajo la propiedad de image
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfilePic(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 100000,
            message: 'El archivo debe ser de maximo 100kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.cloudinaryService.uploadImage(file);
  }

  @Post('signin')
  async signIn(@Body() user: any) {
    const { email, password } = user;
    return this.authService.signIn(email, password);
  }

  @HttpCode(418)
  @Get('coffee')
  getCoffee() {
    return 'No hago café, soy una tetera';
  }

  @Get('message')
  getMessage(@Res() response: Response) {
    response.status(200).send('Este es el mensaje');
  }

  @Get('request')
  getRequest(@Req() request) {
    // console.log(request);
    return 'Esta es la request';
  }

  @Post('signup')
  @UseInterceptors(DateAdderInterceptor)
  createUser(
    @Body() user: UsersBodyDto,
    @Req() request: Request & { now: string },
  ) {
    const modifiedUser = { ...user, createdAt: request.now };
    console.log({ user });
    return this.authService.signUp(modifiedUser);
  }

  @Put()
  update() {
    return 'Actualiza el usuario';
  }

  @Delete()
  delete() {
    try {
      throw new Error();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.I_AM_A_TEAPOT,
          error: 'Envio de café fallido',
        },
        HttpStatus.I_AM_A_TEAPOT,
      );
    }
  }

  //! Las rutas que trabajan con params siempre deben ir al final del crud, para que no intercepte la solicitud
  @Get(':id')
  async getUser(@Param('id', ParseUUIDPipe) id: string) {
    // return this.usersService.getUser(id);
    const user = await this.usersDbService.getUserById(id);
    if (!user) {
      //* Excepcion preconstruida
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }
}
