import { User } from '.prisma/client';

export interface IRequestWithUser {
  user: { userId: string };
}
