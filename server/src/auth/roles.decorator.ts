import { SetMetadata } from '@nestjs/common';

//* Internal import
import { UserRole } from '../user/entities/user.userRole.enum';

export const Roles = (role: UserRole) => SetMetadata('role', role);
