import { SetMetadata } from '@nestjs/common';

import { UserRole } from '../users/entities/user.userRole.enum';

export const Roles = (role: UserRole) => SetMetadata('role', role);
