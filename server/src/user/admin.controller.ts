import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserRole } from './entities/user.userRole.enum';
import { Roles } from '../auth/roles.decorator';
import { MyAuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';
import { apiResponse } from '../app/interface/ApiResponse';
import User from './entities/user.entity';

@Controller('admin')
@UseGuards(MyAuthGuard)
export class AdminController {
      constructor(private readonly adminService: AdminService, private readonly userService: UserService) {}

      @Put('/user-admin/:id')
      @Roles(UserRole.ADMIN)
      async cChangeUserRole(@Param('id') id: string) {
            const user = await this.userService.findOneUserByField('_id', id);
            if (!user) throw apiResponse.sendError({ body: { message: 'user with the given Id was not found' } });
            await this.adminService.toggleUserRole(user);

            return apiResponse.send<void>({ body: { message: 'update user success' } });
      }

      @Put('/user-status/:id')
      @Roles(UserRole.ADMIN)
      async cToggleUserStatus(@Param('id') id: string) {
            const user = await this.userService.findOneUserByField('_id', id);
            if (!user) throw apiResponse.sendError({ body: { message: 'user with the given Id was not found' } });
            await this.adminService.toggleUserStatus(user);

            return apiResponse.send<void>({ body: { message: 'update user success' } });
      }

      @Get('/users')
      @Roles(UserRole.ADMIN)
      async cGetAllUsers() {
            const users = await this.adminService.getAllUsers();

            return apiResponse.send<Array<User>>({ body: { data: users } });
      }
}
