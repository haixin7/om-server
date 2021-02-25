import express from 'express';
import TableController from '../controllers/tables';
import Tables from '../models/Tables';

const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const result = await TableController.createTable(req.body);

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
		const result = await TableController.getTableById(req.query);

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
		const result = await TableController.getTablesByMerchantId(req.query);
		const tableData = await Tables.find({ merchantId: merchantId });
		const total = tableData.length;

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
	try {
		const result = await TableController.removeTableById(req.body);

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
		const result = await TableController.updateTableById(req.body);

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

router.get('/type', async (req, res) => {
	const { type } = req.query;

	try {
		const result = await TableController.getTablesByType(req.query);
		const tableData = await Tables.find({ type: type });
		const total = tableData.length;

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

router.get('/size', async (req, res) => {
	const { size } = req.query;

	try {
		const result = await TableController.getTablesBySize(req.query);
		const tableData = await Tables.find({ size: size });
		const total = tableData.length;

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

export default router;
