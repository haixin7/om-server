import VariantController from '../controllers/variants';
import express from 'express';
import Variants from '../models/Variants';

const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const result = await VariantController.createVariant(req.body);

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

router.get('/', async (req, res) => {
	const { variantId } = req.query;

	try {
		const result = await Variants.findById(variantId);

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

router.get('/item', async (req, res) => {
	const { itemId } = req.query;

	try {
		const result = await VariantController.getVariantsByItem(req.query);
		const variantData = await Variants.find({ itemId: itemId });
		const total = variantData.length;

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
router.get('/category', async (req, res) => {
	try {
		const result = await VariantController.getVariantsByCategoryId(req.query);

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
	try {
		const result = await VariantController.getVariantsByMerchantId(req.query);

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

	try {
		const result = await VariantController.updateVariant(req.body);

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
	const { variantId } = req.body;
	const result = await Variants.findByIdAndRemove(variantId);

	res.json({
		success: true,
		data: result,
	});
});

export default router;
