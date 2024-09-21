// controllers/admins/categoryController.js
const { getCategories}=require('../../models/resources/categoryModel')

const getAllCategories = async (req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

const createNewCategory = async (req, res) => {
  const { industry_name, creator_id } = req.body;
  try {
    const categoryId = await createCategory({ industry_name, creator_id });
    res.status(201).json({ categoryId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

const updateOldCategory = async (req, res) => {
  const { id, industry_name, updator_id } = req.body;
  try {
    const affectedRows = await updateCategory({ id, industry_name, updator_id });
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'No category found with the given ID' });
    }
    res.status(200).json({ affectedRows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
};

const deleteOldCategory = async (req, res) => {
  const { id } = req.body;
  try {
    const affectedRows = await deleteCategory(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'No category found with the given ID' });
    }
    res.status(200).json({ affectedRows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

module.exports = { getAllCategories, createNewCategory, updateOldCategory, deleteOldCategory };
