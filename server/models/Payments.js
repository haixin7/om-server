import mongoose, { Schema } from 'mongoose';

const PaymentSchema = new mongoose.Schema({
	userId: String,
	orderId: String,
	merchantId: String,
	tableId: String,
	tips: Schema.Types.Decimal128,
	tax: Schema.Types.Decimal128,
	total: Schema.Types.Decimal128,
	chargeId: String,
	stripeId: String,
	description: String,
	currency: String,
	epoch: Number,
	date: String,
});

const Payments = mongoose.model('Payments', PaymentSchema);

export default Payments;
