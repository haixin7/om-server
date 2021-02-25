import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
	userId: String,
	merchantId: String,
	tableId: String,
	variantId: [Object],
	type: String,
	status: String,
	date: String,
	epoch: Number,
});

const Orders = mongoose.model('Orders', OrderSchema);

export default Orders;
