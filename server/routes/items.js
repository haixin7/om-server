import ItemController from '../controllers/items';
import Items from '../models/Items';

import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const result = await ItemController.createItem(req.body);

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
	const { itemId } = req.query;

	try {
		const result = await Items.findById(itemId);

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

router.get('/category', async (req, res) => {
	const { categoryId } = req.query;

	try {
		const result = await ItemController.getItemsByCategoryId(req.query);
		const ItemData = await Items.find({ categoryId: categoryId });
		const total = ItemData.length;

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

router.delete('/', async (req, res) => {
	const { itemId } = req.body;
	const result = await Items.findByIdAndRemove(itemId);

	res.json({
		success: true,
		data: result,
	});
});

router.put('/image', async (req, res) => {
	try {
		const result = await ItemController.updateItemImageById(req.body);

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
		const result = await ItemController.updateItemById(req.body);

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
		const result = await ItemController.getItemsByMerchantId(req.query);

		return res.json({
			success: true,
			data: result,
		});
	} catch (e) {
		return res.json({
			scuccess: false,
			data: e,
		});
	}
});

router.post('/image/remove', async (req, res) => {
	try {
		const result = await ItemController.deleteImage(req.body);

		return res.json({
			success: true,
			data: result,
		});
	} catch (e) {
		return res.json({
			success: false,
			data: e,
		});
	}
});

export default router;
