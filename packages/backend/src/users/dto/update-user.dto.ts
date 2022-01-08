import {
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  public firstName?: string;
  public lastName?: string;

  @IsEmail()
  @IsOptional()
  public email?: string;

  @IsOptional()
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
  public password?: string;
}
