import { Injectable } from '@nestjs/common';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { Rate } from './entities/rate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { identity } from 'rxjs';
import { Expose, SuccessStatusCodesEnum, ErrorStatusCodesEnum } from 'src/classes';
import { error } from 'node:console';

@Injectable()
export class RateService {
  response: Expose;
  constructor(
      @InjectRepository(Rate)
      private readonly userRepository: Repository<Rate>,
    ){}
  async create(createRateDto: CreateRateDto) {
    try{
      const newRate = await this.userRepository.save(createRateDto)
      return this.response.success( SuccessStatusCodesEnum.Created, "Created Successfully", newRate);
    }catch(err){
      return this.response.error( err, ErrorStatusCodesEnum.BadRequest )
    };
  }

 async findAll() {
    try{
      const findAllRates = await this.userRepository.find({})
      if (!findAllRates){
        return this.response.error( "RateNotFound" , ErrorStatusCodesEnum.BadRequest )
    }}catch(err){
      return this.response.error( err, ErrorStatusCodesEnum.BadRequest )
    }
  }

  async findOne() {
    try{
      const newRate = await this.userRepository.findOne({where:{}})
      if (!newRate){
        return this.response.error( "RateNotFound" , ErrorStatusCodesEnum.BadRequest )
      }
    }catch(err){
      return this.response.error( err, ErrorStatusCodesEnum.BadRequest )
    }
  }

  async update(id: number, updateRateDto: UpdateRateDto) {
    try{
    const newRate = await this.userRepository.findOne({where:{id}})
    if (!newRate){
      return this.response.error( "RateNotFound" , ErrorStatusCodesEnum.BadRequest )
    }
    Object.assign(newRate, updateRateDto);
    return this.response.success( SuccessStatusCodesEnum.Ok, "Updated Successfully", newRate);
  }catch(err){
    return this.response.error( err, ErrorStatusCodesEnum.BadRequest )
  }

  }

  async remove(id: number) {
    try{
      const deleteRate = await this.userRepository.softDelete(id)
      if (deleteRate.affected === 0){
      return this.response.error( "RateNotFound" , ErrorStatusCodesEnum.BadRequest )
      }
      return this.response.success( SuccessStatusCodesEnum.Ok, "Deleted Successfully");
    }catch(err){
      return this.response.error( err, ErrorStatusCodesEnum.BadRequest )
    }
  }
}
