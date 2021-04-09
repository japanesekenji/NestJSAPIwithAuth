import * as mongoose from 'mongoose';



export const TodoSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: Boolean,
    user_id: String,
    
}, {
  timestamps: true
});

TodoSchema.pre('save', function(next){

    let todo: any = this;

}); 

