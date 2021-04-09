import { Document } from 'mongoose';

export interface Todo extends Document {
    readonly title: string;
    readonly description: string;
    readonly status: string;
    readonly user_id: string;
  
}