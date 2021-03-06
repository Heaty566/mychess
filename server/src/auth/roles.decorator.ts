import { SetMetadata } from '@nestjs/common';

import { UserRole } from '../user/entities/user.userRole.enum';

export const Roles = (role: UserRole) => SetMetadata('role', role);
