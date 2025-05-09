import { Injectable, UnauthorizedException,InternalServerErrorException,NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { UserAttach } from './entities/user-attach.entity';
import { CreateUserAttachDto } from './dto/create-user-attach.dto';
import { UpdateUserAttachDto } from './dto/update-user-attach.dto';

@Injectable()
export class UserAttachService {
  constructor(
    @InjectRepository(UserAttach)
    private readonly userAttachRepository: Repository<UserAttach>,
  ) {}

  async create(createUserAttachDto: CreateUserAttachDto) {
    try {
      const attachment = this.userAttachRepository.create(createUserAttachDto);
      return await this.userAttachRepository.save(attachment);
    } catch (error) {
      console.error('Error adding attachment:', error);
      throw new InternalServerErrorException('Failed to add attachment');
    }
  }


  async findAll() {
    try {
      return await this.userAttachRepository.find();
    } catch (error) {
      console.error('Error fetching attachments:', error);
      throw new InternalServerErrorException('Failed to retrieve attachments');
    }
  }

  async findOne(id: number) {
    try {
      const attachment = await this.userAttachRepository.findOne({
        where: { id }
      });

      if (!attachment) {
        throw new NotFoundException(`Attachment with ID ${id} not found`);
      }

      return attachment;
    } catch (error) {
      console.error(`Error fetching attachment with ID ${id}:`, error);
      throw new InternalServerErrorException('Failed to retrieve attachment');
    }
  }

  async update(id: number, updateUserAttachDto: UpdateUserAttachDto) {
    try {
      
      return "hahahhahahahahahhahahahha"
    } catch (error) {
      console.error(`Error updating attachment with ID ${id}:`, error);
      throw new InternalServerErrorException('Failed to update attachment');
    }
  }


  async delete(id: number) {
    try {
      const result = await this.userAttachRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Attachment with ID ${id} not found`);
      }
    } catch (error) {
      console.error(`Error deleting attachment with ID ${id}:`, error);
      throw new InternalServerErrorException('Failed to delete attachment');
    }
  }
}