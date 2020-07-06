import { Injectable } from '@nestjs/common';
import { PasswordCryptographerService } from './password-cryptographer.interface';
import * as bcrypt from 'bcrypt-nodejs';

@Injectable()
export class PasswordCryptographerServiceImpl implements PasswordCryptographerService {
  private readonly saltRounds = 5;

  doHash(plaintextPassword: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(this.saltRounds, (error, salt) => {
        bcrypt.hash(plaintextPassword, salt, null, (err, hash) => {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      });
    });
  }

  doCompare(plaintextPassword: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plaintextPassword, hash, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
}