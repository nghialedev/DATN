import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Story } from './entities/story.entity';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,
  ) {}

  // Create a new story (only manager)
  async create(createStoryDto: CreateStoryDto, user: any): Promise<Story> {
    if (user.role !== 'manager') {
      throw new UnauthorizedException('Only managers can create stories.');
    }

    try {
      const story = this.storyRepository.create(createStoryDto);
      return await this.storyRepository.save(story);
    } catch (error) {
      console.error('Error creating story:', error);
      throw new InternalServerErrorException('Failed to create story');
    }
  }

  // Get all stories (open to all)
  async findAll() {
    try {
      return await this.storyRepository.find();
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw new InternalServerErrorException('Failed to retrieve stories');
    }
  }

  // Get one story by ID (open to all)
  async findOne(id: number) {
    try {
      const story = await this.storyRepository.findOne({ where: { id } });
      if (!story) {
        throw new NotFoundException(`Story with ID ${id} not found`);
      }
      return story;
    } catch (error) {
      console.error(`Error fetching story with ID ${id}:`, error);
      throw new InternalServerErrorException('Failed to retrieve story');
    }
  }

  // Update a story (only manager)
  async update(id: number, updateStoryDto: UpdateStoryDto, user: any): Promise<Story> {
    if (user.role !== 'manager') {
      throw new UnauthorizedException('Only managers can update stories.');
    }

    try {
      const story = await this.storyRepository.preload({
        id,
        ...updateStoryDto,
      });

      if (!story) {
        throw new NotFoundException(`Story with ID ${id} not found`);
      }

      return await this.storyRepository.save(story);
    } catch (error) {
      console.error(`Error updating story with ID ${id}:`, error);
      throw new InternalServerErrorException('Failed to update story');
    }
  }

  // Delete a story (only manager)
  async delete(id: number, user: any) {
    if (user.role !== 'manager') {
      throw new UnauthorizedException('Only managers can delete stories.');
    }

    try {
      const result = await this.storyRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Story with ID ${id} not found`);
      }
    } catch (error) {
      console.error(`Error deleting story with ID ${id}:`, error);
      throw new InternalServerErrorException('Failed to delete story');
    }
  }
}
