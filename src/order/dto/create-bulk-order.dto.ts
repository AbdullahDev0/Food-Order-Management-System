import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateCommentDto } from './create-comment.dto';
import { CreateOrderDto } from './create-order.dto';

export class CreateBulkOrderDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDto)
  orders: CreateOrderDto[];

  @Type(() => CreateCommentDto)
  comments: CreateCommentDto[];
}
