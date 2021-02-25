import express from 'express';
import ReviewController from '../controllers/reviews';

const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const result = await ReviewController.createReview(req.body);

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
		const result = await ReviewController.deleteReview(req.body);

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
		const result = await ReviewController.fetchAllReviews(req.query);

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

router.get('/id', async (req, res) => {
	try {
		const result = await ReviewController.fetchReviewById(req.query);

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

router.get('/merchantId', async (req, res) => {
	try {
		const result = await ReviewController.fetchReviewsByMerchant(req.query);

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

router.get('/userId', async (req, res) => {
	try {
		const result = await ReviewController.fetchReviewsByUser(req.query);

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

router.post('/comments', async (req, res) => {
	try {
		const result = await ReviewController.createComment(req.body);

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

router.post('/comments/remove', async (req, res) => {
	try {
		const result = await ReviewController.deleteComment(req.body);

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
