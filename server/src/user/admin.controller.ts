import { Controller, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserRole } from './entities/user.userRole.enum';
import { Roles } from '../auth/roles.decorator';
import { MyAuthGuard } from '../auth/auth.guard';

@Controller('admin')
@Roles(UserRole.ADMIN)
@UseGuards(MyAuthGuard)
export class AdminController {
      constructor(private readonly adminService: AdminService) {}
}
