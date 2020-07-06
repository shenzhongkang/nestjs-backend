import { Injectable, Inject } from '@nestjs/common';
import { USER_REPOSITORY_TOKEN } from './constants';
import { Repository, FindManyOptions, DeepPartial, UpdateResult, DeleteResult } from 'typeorm';
import { User } from './user.entity';
import { Log } from 'src/logger/logger.component';
import { PASSWORD_CRYPTOGRAPHER_TOKEN, HASHING_ALGORITHM } from 'src/auth/constants';
import { PasswordCryptographerService } from 'src/auth/password-cryptographer/password-cryptographer.interface';
import { IUser } from 'src/shared';
import { UserRole } from './user.role';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: Repository<User>,
    private readonly log: Log,
    @Inject(PASSWORD_CRYPTOGRAPHER_TOKEN) private readonly passwordCryptographerService: PasswordCryptographerService
  ) {}

  async create(userDto: IUser, password: string): Promise<User> {
    this.log.debug('trying to create user...');
    const existingUser = await this.userRepository.findOne({ where: { email: userDto.email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = this.userRepository.create(userDto);
    user.role = UserRole.Regular;
    user.password = {
      hash: await this.passwordCryptographerService.doHash(password),
      algorithm: HASHING_ALGORITHM
    };

    const savedUser = await this.userRepository.save(user);
    this.log.debug(JSON.stringify(savedUser));
    return savedUser;
  }

  async find(findOptions?: FindManyOptions<User>): Promise<User[]> {
    const options: FindManyOptions = {
      take: 100,
      skip: 0,
      ...findOptions
    };
    this.log.debug(`Searching for max ${options.take} users with an offset of ${options.skip} ...`);
    return await this.userRepository.find(options);
  }

  async findOneById(id: number): Promise<User> {
    this.log.debug('Trying to find one user by id...');
    return await this.userRepository.findOne(id);
  }

  async findOneByEmail(email: string): Promise<User> {
    this.log.debug('Trying to find one user by email...');
    return await this.userRepository.findOne({ email });
  }

  async emailIsTaken(email: string): Promise<boolean> {
    this.log.debug('Checking if email is taken...');
    return this.findOneByEmail(email).then(user => {
      return !!user;
    });
  }

  async update(id: number, partialEntry: DeepPartial<User>): Promise<UpdateResult> {
    this.log.debug('Trying to update user...');
    return await this.userRepository.update(id, partialEntry);
  }

  async remove(id: number): Promise<DeleteResult> {
    this.log.debug('Trying to remove user...');
    return await this.userRepository.delete(id);
  }
}