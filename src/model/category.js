import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Category schema
const categorySchema = new Schema(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true,  
      trim: true     
    },
    description: {
      type: String, 
      required: false, 
      trim: true    
    },
  },
  {
    timestamps: true,  
  }
);

// Create the Category model based on the schema
const Category = mongoose.model('Category', categorySchema);

export default Category;
