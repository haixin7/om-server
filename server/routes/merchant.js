import express from 'express';
import MerchantController from '../controllers/merchants';

const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const result = await MerchantController.createMerchant(req.body);

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
		const result = await MerchantController.profileUpdate(req.body);

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
router.put('/logo', async (req, res) => {
	try {
		const result = await MerchantController.logoUpdate(req.body);

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
router.put('/images', async (req, res) => {
	try {
		const result = await MerchantController.merchantImagesUpdate(req.body);

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
		const result = await MerchantController.getMerchantById(req.query);

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
router.get('/merchantObj', async (req, res) => {
	try {
		const result = await MerchantController.getMerchantByObjId(req.query);

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
	try {
		const result = await MerchantController.findAllMerchants(req.query);

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
router.get('/filter', async (req, res) => {
	try {
		const result = await MerchantController.findAllMerchantsByFilter(req.query);

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
	try {
		const result = await MerchantController.removeMerchantById(req.body);

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
router.post('/like', async (req, res) => {
	try {
		const result = await MerchantController.likeMerchant(req.body);

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
router.post('/unlike', async (req, res) => {
	try {
		const result = await MerchantController.unlikeMerchant(req.body);

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
router.post('/image', async (req, res) => {
	try {
		const result = await MerchantController.deleteMerchantImage(req.body);

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
