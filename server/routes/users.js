import express from 'express';

import Users from '../models/Users';
import authenticateUserToken from '../helpers/userjwt';
import UserController from '../controllers/users';

const router = express.Router();

router.put('/', async (req, res) => {
	try {
		const result = await UserController.updateUserProfile(req.body);

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

router.get('/current', authenticateUserToken, async (req, res) => {
	try {
		const result = await Users.findById(req.user.userId);

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
		const result = await UserController.getAllUsers(req.query);

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

router.post('/favorites/add', async (req, res) => {
	try {
		const result = await UserController.addMerchant(req.body);

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

router.delete('/favorites/remove', async (req, res) => {
	try {
		const result = await UserController.removeMerchant(req.body);

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

router.get('/favorites/location', async (req, res) => {
	try {
		const result = await UserController.getMerchantsSortByLocation(req.query);

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

router.get('/favorites/review', async (req, res) => {
	try {
		const result = await UserController.getMerchantsSortByReview(req.query);

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

router.get('/favorites/cuisine', async (req, res) => {
	try {
		const result = await UserController.getMerchantsSortByCuisine(req.query);

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

router.get('/favorites', async (req, res) => {
	try {
		const result = await UserController.getFavMerchants(req.query);

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
router.get('/merchant', async (req, res) => {
	try {
		const result = await UserController.getUsersByMerchantId(req.query);

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
