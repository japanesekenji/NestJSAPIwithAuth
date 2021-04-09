import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';

@Module({
  providers: [TodosService]
})
export class TodosModule {}
