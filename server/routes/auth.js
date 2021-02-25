import express from 'express';
import AuthController from '../controllers/auth';
const router = express.Router();

router.post('/media/signup', async (req, res) => {
	try {
		const data = await AuthController.socialAuth(req.body);

		res.json({
			success: true,
			data,
		});
	} catch (error) {
		res.json({
			success: false,
			data: error,
		});
	}
});

router.post('/user/login', async (req, res) => {
	try {
		const data = await AuthController.handleUserLogin(req.body);

		return res.json({
			success: true,
			data: data,
		});
	} catch (e) {
		return res.json({
			success: false,
			data: e,
		});
	}
});

router.post('/user/signup', async (req, res) => {
	try {
		const data = await AuthController.handleUserSignUp(req.body);

		return res.json({
			success: true,
			data: data,
		});
	} catch (e) {
		return res.json({
			success: false,
			data: e,
		});
	}
});

router.post('/employee/signup', async (req, res) => {
	try {
		const data = await AuthController.handleEmployeeSignUp(req.body);

		return res.json({
			success: true,
			data: data,
		});
	} catch (e) {
		return res.json({
			success: false,
			data: e,
		});
	}
});

router.post('/employee/login', async (req, res) => {
	try {
		const data = await AuthController.handleEmployeeLogin(req.body);

		return res.json({
			success: true,
			data: data,
		});
	} catch (e) {
		return res.json({
			success: false,
			data: e,
		});
	}
});

router.post('/employee/password', async (req, res) => {
	try {
		const data = await AuthController.handleEmployeeForgetPassword(req.body);

		return res.json({
			success: true,
			data: data,
		});
	} catch (e) {
		return res.json({
			success: false,
			data: e,
		});
	}
});

router.post('/user/password', async (req, res) => {
	try {
		const data = await AuthController.handleUserForgetPassword(req.body);

		return res.json({
			success: true,
			data: data,
		});
	} catch (e) {
		return res.json({
			success: false,
			data: e,
		});
	}
});

export default router;
