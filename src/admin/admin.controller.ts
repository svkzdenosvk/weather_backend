import {
  Controller,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from './admin.guard';
import { UserResponseDto } from 'src/common/dto-response/user-response.dto';
import { SuccessResponseDto } from 'src/common/dto-response/success-response.dto';

@ApiTags('admin')
@ApiCookieAuth('shortTerm_token')
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users — admin only' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user by ID — admin only' })
  @ApiParam({ name: 'id', description: 'User ID to delete' })
  @ApiResponse({ status: 200, type: SuccessResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Update user role — admin only' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ schema: { example: { role: 'ADMIN' } } })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  updateRole(
    @Param('id') id: string,
    @Body() body: { role: 'ADMIN' | 'USER' },
  ) {
    return this.adminService.updateRole(id, body.role);
  }
}
