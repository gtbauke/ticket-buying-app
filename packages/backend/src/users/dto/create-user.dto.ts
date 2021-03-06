import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  public firstName?: string;
  public lastName?: string;

  @IsEmail()
  @IsNotEmpty({
    message: 'Email is required',
  })
  public email: string;

  @IsNotEmpty({
    message: 'Password is required',
  })
  @MinLength(8, {
    message: 'Password must be at least $constraint1 characters long',
  })
  @MaxLength(255, {
    message: 'Password must be at most $constraint1 characters long',
  })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase character',
  })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase character',
  })
  @Matches(/[0-9]/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/, {
    message: 'Password must contain at least one special character',
  })
  public password: string;
}
