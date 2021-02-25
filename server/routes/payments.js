import express from 'express';
import PaymentController from '../controllers/payments';

const router = express.Router();

router.get('/payment', async (req, res) => {
	try {
		const result = await PaymentController.getPaymentById(req.query);

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

router.get('/user', async (req, res) => {
	try {
		const result = await PaymentController.getPaymentsByUserId(req.query);

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

router.get('/order', async (req, res) => {
	try {
		const result = await PaymentController.getPaymentByOrderId(req.query);

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

router.get('/table', async (req, res) => {
	try {
		const result = await PaymentController.getPaymentByTableId(req.query);

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

router.get('/date', async (req, res) => {
	try {
		const result = await PaymentController.getPaymentsByMerchantIdInDateRange(
			req.query,
		);

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
		const result = await PaymentController.getPaymentsByMerchantId(req.query);

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
		const result = await PaymentController.getPaymentInDateRange(req.query);

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
