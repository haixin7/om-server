import express from 'express';
import OrderController from '../controllers/orders';

const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const result = await OrderController.createOrder(req.body);

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

router.post('/variant/add', async (req, res) => {
	try {
		const result = await OrderController.addVariant(req.body);

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
router.post('/variant/remove', async (req, res) => {
	try {
		const result = await OrderController.removeVariant(req.body);

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
		const result = await OrderController.deleteOrderByOrderId(req.body);

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
		const result = await OrderController.getAllOrders(req.query);

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
		const result = await OrderController.getOrderById(req.query);

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
		const result = await OrderController.getOrdersByUserId(req.query);

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
router.get('/user/date', async (req, res) => {
	try {
		const result = await OrderController.getOrdersByUserIdInDateRange(
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
router.get('/user/type', async (req, res) => {
	try {
		const result = await OrderController.getOrdersByUserIdAndType(req.query);

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
		const result = await OrderController.getOrdersByMerchantId(req.query);

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
router.get('/merchant/type', async (req, res) => {
	try {
		const result = await OrderController.getOrdersByMerchantIdAndType(
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
router.get('/merchant/date', async (req, res) => {
	try {
		const result = await OrderController.getOrdersByMerchantIdInDateRange(
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

router.get('/merchant/date/statistics', async (req, res) => {
	try {
		const result = await OrderController.getCategrotyStatistics(
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

router.put('/status', async (req, res) => {
	try {
		const result = await OrderController.changeOrderStatus(req.body);

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
router.get('/merchant/status', async (req, res) => {
	try {
		const result = await OrderController.getTodayMerchantOrdersByStatus(
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
router.get('/merchant/table', async (req, res) => {
	try {
		const result = await
		OrderController.getTodayMerchantOrdersByTable(req.query);

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
