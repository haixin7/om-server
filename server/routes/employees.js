import express from 'express';
import EmployeeController from '../controllers/employees';
import authenticateEmployeeToken from '../helpers/employeejwt';

const router = express.Router();

router.put(
	'/',
	authenticateEmployeeToken,
	async (req, res) => {
		try {
			const result = await EmployeeController.updateEmployeeProfile(
				req.body,
			);

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
	},
);

router.post('/edit', authenticateEmployeeToken, async (req, res) => {
	try {
		const result = await EmployeeController.editEmployee(req.body);

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

router.get(
	'/current',
	authenticateEmployeeToken,
	async (req, res) => {
		try {
			const result = await EmployeeController.getEmployeeById(
				req.employee,
			);

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
	},
);

router.get(
	'/merchantId',
	async (req, res) => {
		try {
			const result = await EmployeeController.getAllEmployeesByMerchant(
				req.query,
			);

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
	},
);

router.put(
	'/active',
	authenticateEmployeeToken,
	async (req, res) => {
		try {
			const result = await EmployeeController.toggleEmployee(
				req.body,
			);

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
	},
);

router.delete(
	'/remove',
	authenticateEmployeeToken,
	async (req, res) => {
		try {
			const result = await EmployeeController.removeEmployeeById(
				req.body,
			);

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
	},
);
export default router;
