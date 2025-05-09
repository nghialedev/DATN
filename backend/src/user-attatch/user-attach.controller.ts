import {Controller,Post,Get,Delete,Param,Body,UseGuards, Request, Put,} from '@nestjs/common';
import { UserAttachService } from './user-attach.service';
import { CreateUserAttachDto } from './dto/create-user-attach.dto';
import { UpdateUserAttachDto } from './dto/update-user-attach.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('attachments')
@UseGuards(JwtAuthGuard)// Ensures only authenticated users can access
export class UserAttachController {
  constructor(private readonly userAttachService: UserAttachService) {}
  @Post()
  create(@Body() dto: CreateUserAttachDto, @Request() req) {
    return this.userAttachService.create(dto);
  }

  @Get()
  findAll() {
    return this.userAttachService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userAttachService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserAttachDto,
    @Request() req,
  ) {
    return this.userAttachService.update(+id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.userAttachService.delete(+id);
  }
}