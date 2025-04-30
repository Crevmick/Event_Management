import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../../controller/Category.js';
import  authenticateUser from '../../middleware/authenticateUser.js';

const router = express.Router();

// Route for creating a new category
router.post('/category', authenticateUser,  createCategory);

// Route for getting all categories
router.get('/categories', authenticateUser ,  getCategories);

// Route for getting a category by ID
router.get('/categories/:id', authenticateUser ,  getCategoryById);

// Route for updating a category by ID
router.put('/categories/:id', authenticateUser, updateCategory);

// Route for deleting a category by ID
router.delete('/categories/:id',  authenticateUser ,  deleteCategory);

export default router;
