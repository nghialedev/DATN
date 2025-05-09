import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRateDto } from './create-rate.dto';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';


export class UpdateRateDto extends PartialType(CreateRateDto) {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 5, description: "Write Your Rate" })
    rate: number;
            
    @IsNotEmpty()
    @IsDate()
    @ApiProperty({ example: "Jan", description: "Jan" })
    month: Date;
    
    @IsNotEmpty()
    @IsDate()
    @ApiProperty({ example: "1990", description: "1990" })
    year: Date;
            
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    user_id: User;
    
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    rated_by_user_id: User;
}
