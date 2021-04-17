import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';

//----- Entity
import { User } from './entities/user.entity';
import { UserRole } from './entities/user.userRole.enum';
import { Roles } from '../auth/roles.decorator';

//----- Service
import { AdminService } from './admin.service';
import { UserService } from './user.service';

//----- Pipe
import { UserGuard } from '../auth/auth.guard';

//----- Common
import { apiResponse } from '../app/interface/ApiResponse';

@Controller('admin')
@UseGuards(UserGuard)
export class AdminController {
      constructor(private readonly adminService: AdminService, private readonly userService: UserService) {}

      @Get('/users')
      @Roles(UserRole.ADMIN)
      async cGetAllUsers() {
            const users = await this.adminService.getAllUsers();

            return apiResponse.send<Array<User>>({ body: { data: users } });
      }

      @Put('/user-admin/:id')
      @Roles(UserRole.ADMIN)
      async cToggleUserRole(@Param('id') id: string) {
            const user = await this.userService.findOneUserByField('id', id);
            if (!user)
                  throw apiResponse.sendError({
                        body: { message: { type: 'admin.not-found-user' } },
                        type: 'NotFoundException',
                  });
            await this.adminService.toggleUserRole(user);

            return apiResponse.send<void>({
                  body: { message: { type: 'user.update-success' } },
            });
      }

      @Put('/user-status/:id')
      @Roles(UserRole.ADMIN)
      async cToggleUserStatus(@Param('id') id: string) {
            const user = await this.userService.findOneUserByField('id', id);
            if (!user)
                  throw apiResponse.sendError({
                        body: { message: { type: 'admin.not-found-user' } },
                        type: 'NotFoundException',
                  });
            await this.adminService.toggleUserStatus(user);

            return apiResponse.send<void>({
                  body: { message: { type: 'user.update-success' } },
            });
      }
}
