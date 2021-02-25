/* eslint-disable camelcase */
import Stripe from 'stripe';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Payments from '../models/Payments';

require('dotenv').config();
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_KEY);
const CENTTODOLLAR = 100;
const EPOCH_CONVERT = 1000;

router.post('/checkout', async (req, res) => {

	try {
		const { product, token } = req.body;

		const customer = await stripe.customers.create({
			email: token.email,
			source: token.id,
		});
		const idempotency_key = uuidv4();
		const charge = await stripe.charges.create(
			{
				amount: product.price * CENTTODOLLAR,
				currency: 'usd',
				customer: customer.id,
				receipt_email: token.email,
				description: product.name,
			},
			{
				idempotencyKey: idempotency_key,
			},
		);

		res.json({
			success: true,
			data: charge,
		});
	} catch (error) {
		res.json({
			success: false,
			data: error,
		});
	}
});

router.post('/refund', async(req, res)=>{
	const {chargeId, amount} = req.body;

	try {
		const refund = await stripe.refunds.create({
			charge: chargeId,
			amount: amount * CENTTODOLLAR,
		});

		res.json({
			success: true,
			date: refund,
		});

	} catch (error) {
		res.json({
			success: false,
			date: error,
		});
	}

});
router.get('/', async(req, res)=>{

	const {chargeId} = req.query;

	try {
		const chargeData = await stripe.charges.retrieve(chargeId);

		res.json({
			success: true,
			data: chargeData,
		});
	} catch (error) {
		res.json({
			success: false,
			data: error,
		});
	}

});

router.post('/payment', async(req, res)=>{
	const {userId, orderId, merchantId, tableId,
		tips, tax, total, chargeId, stripeId} = req.body;
	const ISODate = new Date();
	const date = ISODate.toLocaleString();
	const epoch = Math.floor(ISODate.getTime() / EPOCH_CONVERT);
	const result = await Payments.create({
		userId, orderId, merchantId, tableId, tips, tax,
		total, chargeId, stripeId, date, epoch,
	});

	try {
		res.json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.json({
			success: false,
			data: error,
		});
	}
});

export default router;
