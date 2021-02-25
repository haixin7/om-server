import express from 'express';
import twilioController from '../controllers/twilio';

const router = express.Router();

router.post('/', async (req, res) => {
	const data = await twilioController.getSMSCode(req, res);

	return data;
});

router.post('/verify', async (req, res) => {
	const data = await twilioController.verifyCode(req, res);

	return data;
});

export default router;
