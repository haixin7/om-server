import express from 'express';
import CategoriesController from '../controllers/categories';
import Categories from '../models/Categories';

const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const result = await CategoriesController.createCategories(req.body);

		res.json({
			success: true,
			data: result,
		});
	} catch (e) {
		res.json({
			success: false,
			data: e,
		});
	}
});

router.get('/merchant', async (req, res) => {
	const { merchantId } = req.query;

	try {
		const result = await CategoriesController.getCategoriesByMerchantId(
			req.query,
		);
		const CategoryData = await Categories.find({ merchantId: merchantId });
		const total = CategoryData.length;

		res.json({
			success: true,
			data: { result, total },
		});
	} catch (e) {
		res.json({
			success: false,
			data: e,
		});
	}
});

router.get('/', async (req, res) => {
	const { categoryId } = req.query;

	try {
		const result = await Categories.findById(categoryId);

		if (!result) {
			throw 'category cannot be found';
		}

		res.json({
			success: true,
			data: result,
		});
	} catch (e) {
		res.json({
			success: false,
			data: e,
		});
	}
});

router.put('/', async (req, res) => {
	const { categoryId, field, value } = req.body;

	try {
		const result = await CategoriesController.updateCategoriesById({
			categoryId,
			field,
			value,
		});

		res.json({
			success: true,
			data: result,
		});
	} catch (e) {
		res.json({
			success: false,
			data: e,
		});
	}
});

router.delete('/', async (req, res) => {
	const { categoryId } = req.body;
	const result = await Categories.findByIdAndRemove(categoryId);

	res.json({
		success: true,
		data: result,
	});
});

router.get('/menu', async (req, res) => {
	try {
		const result = await CategoriesController.getMenuByMerchantId(req.query);

		res.json({
			success: true,
			data: result,
		});
	} catch (e) {
		res.json({
			success: false,
			data: e,
		});
	}
});
router.post('/category', async (req, res) => {
	try {
		const result = await CategoriesController.upsertCategoryById(req.body);

		res.json({
			success: true,
			data: result,
		});
	} catch (e) {
		res.json({
			success: false,
			data: e,
		});
	}
});
export default router;
