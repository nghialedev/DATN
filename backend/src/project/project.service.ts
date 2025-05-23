import { Injectable, Param } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { error } from 'console';
import { ProjectUser } from 'src/project_user/entities/project_user.entity';
import { Expose, SuccessStatusCodesEnum, ErrorStatusCodesEnum } from 'src/classes';


@Injectable()
export class ProjectService {
  constructor(
    private readonly response: Expose,
    @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectUser)
        private readonly projectUserRepository: Repository<ProjectUser>
  ){}
  async create(createProjectDto: CreateProjectDto) {
    try{
      // Convert client_id to proper format for the new relationship
      const newProject = await this.projectRepository.save({
        ...createProjectDto,
        client: { id: createProjectDto.client_id } // Create reference to User entity
      });
      return this.response.success(SuccessStatusCodesEnum.Ok, "Created Successfully", newProject);
    }
    catch(error){
      return this.response.error(error, ErrorStatusCodesEnum.BadRequest)
    }
  }

  async findAll(){
    try{
      // Sử dụng relations để load thông tin client
      const projects = await this.projectRepository.find({
        relations: ['client']
      });
      
      if(!projects || projects.length === 0){
        return this.response.error(`No Projects found`, ErrorStatusCodesEnum.NotFound)
      }
      
      // Chuyển đổi kết quả để bao gồm client_id
      const projectsWithClientId = projects.map(project => {
        const { client, ...rest } = project;
        return {
          ...rest,
          client_id: client ? client.id : null,
          client: client // Giữ lại đối tượng client đầy đủ
        };
      });
      
      return this.response.success(SuccessStatusCodesEnum.Ok, "Projects retrieved successfully", projectsWithClientId);
    }
    catch(error){
      return this.response.error(error, ErrorStatusCodesEnum.BadRequest);
    }
  }

  async findOne(id: number,request){
    try{
      const project = await this.projectRepository.findOne({ where: { id }});
      const isMember = await this.projectUserRepository.findOne({where: { project_id: { id }, user_id: { id: request.user.id }},})
      if (!project) {
        return this.response.error(`Project with Id ${id} not found`, ErrorStatusCodesEnum.NotFound)
      }else{
        if(!isMember){
          return this.response.error(`Resource not authorized`,ErrorStatusCodesEnum.NotAcceptable)
        }
        else{
          return this.response.success( SuccessStatusCodesEnum.Ok, `success`, project)
        }
      }
      }
      catch(error){
        return this.response.error( error, ErrorStatusCodesEnum.BadRequest)
      }
    }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    try{
      const projectToUpdate = await this.projectRepository.findOne({ where: { id } });
      
      if (!projectToUpdate) {
        return this.response.error(`Project with Id ${id} not found`,ErrorStatusCodesEnum.NotFound)
      }else{
      const updatedProject = await this.projectRepository.update(id, updateProjectDto)
      return this.response.success( SuccessStatusCodesEnum.Ok, `Project with id ${id} updated successfully`, updatedProject)
      }
    }
    catch(error){
      return this.response.error(error, ErrorStatusCodesEnum.BadRequest)
    }
  }

  async remove(id: number) {
    try{
    const projectToDelete = await this.projectRepository.findOne({ where: { id } });

    if (!projectToDelete) {
      return this.response.error(`Project with Id ${id} not found`,ErrorStatusCodesEnum.NotFound)
    }
    else{
      await this.projectRepository.delete(id);
      return this.response.success( SuccessStatusCodesEnum.Ok, `Project with Id ${id} deleted successfully`)
    }
  }
  catch(error){
    return this.response.error(error, ErrorStatusCodesEnum.BadRequest)
  }
  }
}

