import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';
import {
  ErrorStatusCodesEnum,
  Expose,
  SuccessStatusCodesEnum,
} from 'src/classes';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentsRepository: Repository<Department>,
    private readonly expose: Expose,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto, user: any) {
    if (user.role !== 'manager')
      return this.expose.error(
        'Only manager can perform this action.',
        ErrorStatusCodesEnum.Forbidden,
      );
    try {
      const newDepartment = await this.departmentsRepository.save({
        ...createDepartmentDto,
      });
      return this.expose.success(
        SuccessStatusCodesEnum.Created,
        'Department created successfully',
        newDepartment,
        true,
      );
    } catch (error) {
      return this.expose.error(error, ErrorStatusCodesEnum.BadRequest);
    }
  }

  async findAll() {
    try {
      const departments = await this.departmentsRepository.find();
      return this.expose.success(
        SuccessStatusCodesEnum.Ok,
        'Departments fetched successfully',
        departments,
        true,
      );
    } catch (error) {
      return this.expose.error(error, ErrorStatusCodesEnum.InternalServerError);
    }
  }

  async findOne(id: number) {
    try {
      const department = await this.departmentsRepository.findOne({
        where: { id },
      });
      if (!department) {
        return this.expose.error(
          'Deparment not found',
          ErrorStatusCodesEnum.NotFound,
        );
      }
      return this.expose.success(
        SuccessStatusCodesEnum.Ok,
        'Department found',
        department,
        true,
      );
    } catch (error) {
      return this.expose.error(error, ErrorStatusCodesEnum.InternalServerError);
    }
  }

  async update(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
    user: any,
  ) {
    if (user.role !== 'manager')
      return this.expose.error(
        'Only manager can update departments.',
        ErrorStatusCodesEnum.Forbidden,
      );
    try {
      const department = await this.departmentsRepository.findOne({
        where: { id },
      });
      if (!department) {
        return this.expose.error(
          'Deparment not found',
          ErrorStatusCodesEnum.NotFound,
        );
      }
      Object.assign(department, updateDepartmentDto);
      const updated = await this.departmentsRepository.save(department);
      return this.expose.success(
        SuccessStatusCodesEnum.Ok,
        'Department updated successfully',
        updated,
        true,
      );
    } catch (error) {
      return this.expose.error(error, ErrorStatusCodesEnum.InternalServerError);
    }
  }

  async remove(id: number, user: any) {
    if (user.role !== 'manager')
      return this.expose.error(
        'Only manager can delete departments.',
        ErrorStatusCodesEnum.Forbidden,
      );
    try {
      const department = await this.departmentsRepository.softDelete(id);
      if (department.affected === 0) {
        return this.expose.error(
          'Deparment not found',
          ErrorStatusCodesEnum.NotFound,
        );
      }
      return this.expose.success(
        SuccessStatusCodesEnum.Ok,
        'Department deleted successfully',
        null,
        true,
      );
    } catch (error) {
      return this.expose.error(error, ErrorStatusCodesEnum.InternalServerError);
    }
  }
}
