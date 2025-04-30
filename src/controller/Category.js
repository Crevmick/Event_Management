import Category from '../model/category.js';

// Create a new category
export const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).send('Category already exists');
    }

    // Create a new category
    const category = new Category({ name, description });
    await category.save();

    return res.status(201).json({
      message: 'Category created successfully',
      category,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Something went wrong while creating the category',
      error: err.message,
    });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch all categories
    return res.status(200).json({ categories });
  } catch (err) {
    return res.status(500).json({
      message: 'Error fetching categories',
      error: err.message,
    });
  }
};

// Get a category by ID
export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send('Category not found');
    }

    return res.status(200).json({ category });
  } catch (err) {
    return res.status(500).json({
      message: 'Error fetching category by ID',
      error: err.message,
    });
  }
};

// Update an existing category
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send('Category not found');
    }

    category.name = name || category.name;
    category.description = description || category.description;

    await category.save();

    return res.status(200).json({
      message: 'Category updated successfully',
      category,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Error updating category',
      error: err.message,
    });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send('Category not found');
    }

    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'Category deleted successfully',
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Error deleting category',
      error: err.message,
    });
  }
};
