import { Controller, UseInterceptors, Post, Body, BadRequestException, ForbiddenException, InternalServerErrorException, Get, Query, Param, NotFoundException, Put, Patch, ParseIntPipe, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoggingInterceptor } from 'src/common/interceptors/loggin.interceptor';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { apiPath } from 'src/api';
import { UserService } from './user.service';
import { EmailValidatorImpl } from 'src/validation/email/email-validator.component';
import { PasswordValidatorImpl } from 'src/validation/password/password-validator.component';
import { User } from './user.entity';
import { CreateUserDto } from 'src/shared';
import { Authorized } from 'src/common/decorators/authorized.decorator';
import { UserRole } from './user.role';
import { FindManyOptions, DeepPartial } from 'typeorm';
import { CurrentUser } from './user.decorator';

@ApiTags('Users')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'users'))
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailValidator: EmailValidatorImpl,
    private readonly passwordValidator: PasswordValidatorImpl
  ) {}

  @ApiOperation({ summary: 'Register new account' })
  @ApiResponse({
    status: 200,
    description: 'Credentials are ok, returning new user data',
    type: User
  })
  @ApiResponse({
    status: 400,
    description: 'Email or password are not valid'
  })
  @Post()
  async create(@Body() req: CreateUserDto) {
    const emailValidation = await this.emailValidator.validateEmail(req.user.email);
    if (!emailValidation.isValid) {
      throw new BadRequestException('Invalid email!');
    }
    const passwordValidation = await this.passwordValidator.validatePassword(req.password);
    if (!passwordValidation.isValid) {
      throw new BadRequestException('Invalid password!');
    }

    try {
      return await this.userService.create(req.user, req.password);
    } catch (err) {
      if (err.message === 'User already exists') {
        throw new ForbiddenException(err.message);
      } else {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  @Get()
  @Authorized(UserRole.Admin)
  async find(@Query() findOptions?: FindManyOptions<User>): Promise<User[]> {
    const options: FindManyOptions = {
      take: 100,
      skip: 0,
      ...findOptions
    };
    return this.userService.find(options);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current user info (check JWT validity)' })
  @ApiResponse({
    status: 200,
    description: 'JWT is ok, returning user data.',
    type: User
  })
  @ApiResponse({
    status: 401,
    description: 'JWT is no longer valid!'
  })
  @Authorized()
  @Get('current')
  async getCurrent(@CurrentUser() currentUser: User): Promise<User> {
    return await this.userService.findOneById(currentUser.id);
  }

  @Get(':idOrEmail')
  @Authorized()
  async findOne(@Param('idOrEmail') idOrEmail: string, @CurrentUser() currentUser: User): Promise<User> {
    const isEmail = this.emailValidator.simpleCheck(idOrEmail);
    const foundUser = isEmail
     ? await this.userService.findOneByEmail(idOrEmail)
     : await this.userService.findOneById(parseInt(idOrEmail, 10));

    if ((!foundUser || foundUser.id !== currentUser.id) && currentUser.role !== UserRole.Admin) {
      throw new ForbiddenException('Only user can get info of himself (or admin)!');
    }

    if (!foundUser) {
      throw new NotFoundException(`User '${idOrEmail}' has not been found`);
    }
    
    return foundUser;
  }

  @Put()
  @Authorized()
  async fullUpdate(@Body() user: User, @CurrentUser() currentUser: User) {
    if (user.id !== currentUser.id && currentUser.role !== UserRole.Admin) {
      throw new ForbiddenException('Only user can update himself (or admin)!');
    }
    return this.userService.update(user.id, user);
  }

  @Patch(':id')
  @Authorized()
  async partialUpdate(
    @Param('id', new ParseIntPipe())
    userId: number,
    @Body() partialEntry: DeepPartial<User>,
    @CurrentUser() currentUser: User
  ) {
    if (userId !== currentUser.id && currentUser.role !== UserRole.Admin) {
      throw new ForbiddenException('Only user can update himself (or admin)!');
    }
    return this.userService.update(userId, partialEntry);
  }

  @Delete(':id')
  @Authorized()
  async remove(
    @Param('id', new ParseIntPipe())
    userId: number,
    @CurrentUser() currentUser: User
  ) {
    if (userId !== currentUser.id && currentUser.role !== UserRole.Admin) {
      throw new ForbiddenException('Only user can delete himself (or admin)!');
    }
    return this.userService.remove(userId);
  }
}