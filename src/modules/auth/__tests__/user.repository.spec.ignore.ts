/* istanbul ignore file */
/* eslint-disable */
import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';
import { AuthCredentialsDto } from '../shared/dtos/auth-credentials.dto';
import { ConflictException } from '@nestjs/common';

const userRegistrationGoodExample: AuthCredentialsDto[] = [
  {
    username: 'user_01',
    password: 'password_01',
  },
  {
    username: 'user_02',
    password: 'password_02',
  },
  {
    username: 'user_03',
    password: 'password_02',
  },
];

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeAll(async () => {
    const mockModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: 'test.env',
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('PG_DB_HOST', 'localhost'),
            port: configService.get<number>('PG_DB_PORT', 5432),
            username: configService.get('PG_DB_USERNAME', 'postgres'),
            password: configService.get('PG_DB_PASSWORD', 'postgres'),
            database: configService.get('PG_DB_DATABASE', 'taskmanagement_test'),
            entities: [User, Task],
            synchronize: true,
          }),
        }),
        TypeOrmModule.forFeature([UserRepository]),
      ],
      providers: [
        UserRepository
      ],
    }).compile();

    userRepository = mockModule.get<UserRepository>(UserRepository);
  });

  beforeEach(async () => {
    await userRepository.delete({});
  });

  it('should be definable', async () => {
    expect(userRepository).toBeTruthy();
  });

  describe('SignUp function', () => {
    describe('in correct ways', () => {
      it('should able to sign up an valid user', async () => {
        const returnUser0: User = await userRepository.signUp(
          userRegistrationGoodExample[0],
        );
        expect(returnUser0).toBeDefined();
      });

      it('should return hashed password with salt', async () => {
        const returnUser0: User = await userRepository.signUp(
          userRegistrationGoodExample[0],
        );
        expect(returnUser0).toBeDefined();

        expect(returnUser0.password).not.toEqual(
          userRegistrationGoodExample[0],
        );
        expect(returnUser0.salt).toBeDefined();
      });

      it('should able to sign up 2 unique users', async () => {
        const returnUser1: User = await userRepository.signUp(
          userRegistrationGoodExample[1],
        );
        const returnUser2: User = await userRepository.signUp(
          userRegistrationGoodExample[2],
        );

        expect(returnUser1).toBeDefined();
        expect(returnUser2).toBeDefined();
      });

      it('should contains 3 users in database after sign up 3 ones', async () => {
        await userRepository.signUp(userRegistrationGoodExample[0]);
        await userRepository.signUp(userRegistrationGoodExample[1]);
        await userRepository.signUp(userRegistrationGoodExample[2]);

        const allUsers: User[] = await userRepository.find();

        expect(allUsers.length).toEqual(3);
      });
    });

    describe('in not correct ways, exceptions', () => {
      it('should NOT able to sign up a duplicate user then throw ConflictException', async () => {
        const returnUser1: User = await userRepository.signUp(
          userRegistrationGoodExample[1],
        );

        await expect(
          userRepository.signUp(userRegistrationGoodExample[1]),
        ).rejects.toThrow(ConflictException);

        expect(returnUser1).toBeDefined();
      });
    });
  });

  describe('validateUserPassword function', () => {
    describe('in correct ways', () => {
      it('should return same username if valid credential is valid', async () => {
        const returnedSignUpUser0: User = await userRepository.signUp(
          userRegistrationGoodExample[0],
        );
        expect(returnedSignUpUser0).toBeDefined();

        const returnedSignInUsername: string = await userRepository.validateUserPassword(
          userRegistrationGoodExample[0],
        );
        expect(returnedSignUpUser0.username).toEqual(returnedSignInUsername);
      });

      it('should return same username if valid credential is valid, but validate 10 times continuously :D', async () => {
        const returnedSignUpUser0: User = await userRepository.signUp(
          userRegistrationGoodExample[0],
        );
        expect(returnedSignUpUser0).toBeDefined();

        for (let i = 0; i < 10; i++) {
          const returnedSignInUsername: string = await userRepository.validateUserPassword(
            userRegistrationGoodExample[0],
          );
          expect(returnedSignUpUser0.username).toEqual(returnedSignInUsername);
        }
      });

      it('should return same username if credential valid is valid, test for 3 different credentials', async () => {
        const returnedSignUpUser0: User = await userRepository.signUp(
          userRegistrationGoodExample[0],
        );
        expect(returnedSignUpUser0).toBeDefined();
        const returnedSignUpUser1: User = await userRepository.signUp(
          userRegistrationGoodExample[1],
        );
        expect(returnedSignUpUser1).toBeDefined();
        const returnedSignUpUser2: User = await userRepository.signUp(
          userRegistrationGoodExample[2],
        );
        expect(returnedSignUpUser2).toBeDefined();

        const returnedSignInUsername0: string = await userRepository.validateUserPassword(
          userRegistrationGoodExample[0],
        );
        expect(returnedSignUpUser0.username).toEqual(returnedSignInUsername0);
        const returnedSignInUsername1: string = await userRepository.validateUserPassword(
          userRegistrationGoodExample[1],
        );
        expect(returnedSignUpUser1.username).toEqual(returnedSignInUsername1);
        const returnedSignInUsername2: string = await userRepository.validateUserPassword(
          userRegistrationGoodExample[2],
        );
        expect(returnedSignUpUser2.username).toEqual(returnedSignInUsername2);
      });
    });
    describe('in not correct ways, exceptions', () => {
      beforeEach(async () => {
        await userRepository.delete({});
        await userRepository.signUp(userRegistrationGoodExample[0]);
        await userRepository.signUp(userRegistrationGoodExample[1]);
        await userRepository.signUp(userRegistrationGoodExample[2]);
      });

      it('should return null if credential.username is not found', async () => {
        const wrongCredential0: AuthCredentialsDto =
          userRegistrationGoodExample[0];
        wrongCredential0.username = wrongCredential0.username + 'some_salt';

        const returnedSignInUsername0: string = await userRepository.validateUserPassword(
          wrongCredential0,
        );
        expect(returnedSignInUsername0).toBeNull();
      });

      it('should return null if credential.username is found but credential.password not correct', async () => {
        const wrongCredential0: AuthCredentialsDto =
          userRegistrationGoodExample[0];
        wrongCredential0.password = wrongCredential0.password + 'some_salt';

        const returnedSignInUsername0: string = await userRepository.validateUserPassword(
          wrongCredential0,
        );
        expect(returnedSignInUsername0).toBeNull();
      });

      it('should return null if credential.username is empty', async () => {
        const wrongCredential0: AuthCredentialsDto =
          userRegistrationGoodExample[0];
        wrongCredential0.username = '';

        const returnedSignInUsername0: string = await userRepository.validateUserPassword(
          wrongCredential0,
        );
        expect(returnedSignInUsername0).toBeNull();
      });

      it('should return null if credential.username is null', async () => {
        const wrongCredential0: AuthCredentialsDto =
          userRegistrationGoodExample[0];
        wrongCredential0.username = null;

        const returnedSignInUsername0: string = await userRepository.validateUserPassword(
          wrongCredential0,
        );
        expect(returnedSignInUsername0).toBeNull();
      });

      it('should return null if credential.password is empty', async () => {
        const wrongCredential0: AuthCredentialsDto =
          userRegistrationGoodExample[0];
        wrongCredential0.password = null;

        const returnedSignInUsername0: string = await userRepository.validateUserPassword(
          wrongCredential0,
        );
        expect(returnedSignInUsername0).toBeNull();
      });

      it('should return null if credential.password is null', async () => {
        const wrongCredential0: AuthCredentialsDto =
          userRegistrationGoodExample[0];
        wrongCredential0.password = null;

        const returnedSignInUsername0: string = await userRepository.validateUserPassword(
          wrongCredential0,
        );
        expect(returnedSignInUsername0).toBeNull();
      });
    });
  });
});
