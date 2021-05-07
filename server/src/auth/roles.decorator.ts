import { SetMetadata } from '@nestjs/common';

//---- Entity
import { UserRole } from '../user/entities/user.userRole.enum';

export const Roles = (role: UserRole) => SetMetadata('role', role);
