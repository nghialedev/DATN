import { Controller,Post, Get, Patch, Delete,Param,Body, UseGuards,  Request,} from '@nestjs/common';
import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Stories')
@ApiBearerAuth()
@Controller('stories')
@UseGuards(AuthGuard('jwt')) // Ensures only authenticated users can access
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new story' })
  @ApiResponse({ status: 201, description: 'Story successfully created', type: CreateStoryDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createStoryDto: CreateStoryDto, @Request() req) {
    return this.storyService.create(createStoryDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stories' })
  @ApiResponse({ status: 200, description: 'Return all stories', type: [CreateStoryDto] })
  findALL() {
    return this.storyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get story by id' })
  @ApiResponse({ status: 200, description: 'Return the story', type: CreateStoryDto })
  @ApiResponse({ status: 404, description: 'Story not found' })
  @ApiParam({ name: 'id', description: 'Story ID' })
  findOne(@Param('id') id: string) {
    return this.storyService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update story by id' })
  @ApiResponse({ status: 200, description: 'Story successfully updated', type: CreateStoryDto })
  @ApiResponse({ status: 404, description: 'Story not found' })
  @ApiParam({ name: 'id', description: 'Story ID' })
  update(@Param('id') id: string, @Body() updateStoryDto: UpdateStoryDto, @Request() req) {
    return this.storyService.update(+id, updateStoryDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete story by id' })
  @ApiResponse({ status: 200, description: 'Story successfully deleted' })
  @ApiResponse({ status: 404, description: 'Story not found' })
  @ApiParam({ name: 'id', description: 'Story ID' })
  remove(@Param('id') id: string, @Request() req) {
    return this.storyService.delete(+id, req.user);
  }
}