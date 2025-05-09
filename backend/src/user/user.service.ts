import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import {
  Expose,
  SuccessStatusCodesEnum,
  ErrorStatusCodesEnum,
} from 'src/classes';

@Injectable()
export class UserService {
  constructor(
    private readonly response: Expose,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: AuthService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({ 
        where: { email: createUserDto.email } 
      });
      
      if (existingUser) {
        return this.response.error(
          "Email đã tồn tại, vui lòng sử dụng email khác", 
          ErrorStatusCodesEnum.BadRequest
        );
      }

      const hashPass = await bcrypt.hash(createUserDto.password, 10);
      const newUser = await this.userRepository.save({...createUserDto, password: hashPass });
      
      const accessToken = await this.jwtService.generateAccessToken({id: newUser.id});
      const res = {newUser, accessToken};
      
      return this.response.success(
        SuccessStatusCodesEnum.Created, 
        "Tạo người dùng thành công", 
        res
      );
    } catch(error) {
      console.error('Create user error:', error);
      
      if (error.code === '23505') {
        return this.response.error(
          "Email đã tồn tại trong hệ thống", 
          ErrorStatusCodesEnum.BadRequest
        );
      }
      
      if (error.name === 'ValidationError') {
        return this.response.error(
          "Dữ liệu không hợp lệ: " + error.message, 
          ErrorStatusCodesEnum.BadRequest
        );
      }
      
      return this.response.error(
        "Không thể tạo người dùng: " + error.message, 
        ErrorStatusCodesEnum.BadRequest
      );
    }
  }

  async updateAccessToken(userId: number, accessToken: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        console.log('User not found');
        return;
      }
      user.accessToken = accessToken;
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      console.log(error);
    }
  }


  async logIn(loginDto: LoginDto){
    try{
      const user = await this.userRepository.findOne({where:{email:loginDto.email}})
      if(!user){
        return this.response.error("email not found", ErrorStatusCodesEnum.BadRequest )
      }
      const correctPass = await bcrypt.compare(loginDto.password,user.password);
      if(!correctPass){
        return this.response.error("wrong password", ErrorStatusCodesEnum.BadRequest )
      }
      const accessToken = await this.jwtService.generateAccessToken({id: user.id})
      const res =  {accessToken, user}
      return this.response.success( SuccessStatusCodesEnum.Ok, "Created Successfully", res);
    }catch(err){
      return this.response.error("email not found", ErrorStatusCodesEnum.InternalServerError )
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository.find();
      return this.response.success(
        SuccessStatusCodesEnum.Ok,
        "Lấy danh sách người dùng thành công",
        users
      );
    } catch (error) {
      console.error('Find all users error:', error);
      return this.response.error(
        "Không thể lấy danh sách người dùng: " + error.message,
        ErrorStatusCodesEnum.InternalServerError
      );
    }
  }

  // Phương thức nội bộ trả về trực tiếp đối tượng User
  async findOneInternal(id: number): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      console.error(`Internal find user ${id} error:`, error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      
      if (!user) {
        return this.response.error(
          "Không tìm thấy người dùng với ID " + id,
          ErrorStatusCodesEnum.NotFound
        );
      }
      
      return this.response.success(
        SuccessStatusCodesEnum.Ok,
        "Lấy thông tin người dùng thành công",
        user
      );
    } catch (error) {
      console.error(`Find user ${id} error:`, error);
      return this.response.error(
        "Không thể lấy thông tin người dùng: " + error.message,
        ErrorStatusCodesEnum.InternalServerError
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      // Kiểm tra người dùng tồn tại
      const user = await this.userRepository.findOne({ where: { id } });
      
      if (!user) {
        return this.response.error(
          "Không tìm thấy người dùng với ID " + id,
          ErrorStatusCodesEnum.NotFound
        );
      }
      
      // Nếu cập nhật email, kiểm tra email đã tồn tại chưa
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.userRepository.findOne({ 
          where: { email: updateUserDto.email } 
        });
        
        if (existingUser) {
          return this.response.error(
            "Email đã tồn tại, vui lòng sử dụng email khác",
            ErrorStatusCodesEnum.BadRequest
          );
        }
      }
      
      // Nếu cập nhật mật khẩu, hash mật khẩu mới
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      
      // Cập nhật thông tin người dùng
      await this.userRepository.update(id, updateUserDto);
      
      // Lấy thông tin người dùng sau khi cập nhật
      const updatedUser = await this.userRepository.findOne({ where: { id } });
      
      return this.response.success(
        SuccessStatusCodesEnum.Ok,
        "Cập nhật thông tin người dùng thành công",
        updatedUser
      );
    } catch (error) {
      console.error(`Update user ${id} error:`, error);
      
      if (error.code === '23505') { // Mã lỗi PostgreSQL cho unique constraint
        return this.response.error(
          "Email đã tồn tại trong hệ thống",
          ErrorStatusCodesEnum.BadRequest
        );
      }
      
      return this.response.error(
        "Không thể cập nhật thông tin người dùng: " + error.message,
        ErrorStatusCodesEnum.InternalServerError
      );
    }
  }

  async remove(id: number) {
    try {
      // Kiểm tra người dùng tồn tại
      const user = await this.userRepository.findOne({ where: { id } });
      
      if (!user) {
        return this.response.error(
          "Không tìm thấy người dùng với ID " + id,
          ErrorStatusCodesEnum.NotFound
        );
      }
      
      // Xóa người dùng
      await this.userRepository.delete(id);
      
      return this.response.success(
        SuccessStatusCodesEnum.Ok,
        "Xóa người dùng thành công",
        { id }
      );
    } catch (error) {
      console.error(`Remove user ${id} error:`, error);
      return this.response.error(
        "Không thể xóa người dùng: " + error.message,
        ErrorStatusCodesEnum.InternalServerError
      );
    }
  }
}
