import mongoose from 'mongoose';

const MerchantSchema = new mongoose.Schema({
	merchantId: { type: String, unique: true },
	QRcode: String,
	name: String,
	logo: String,
	images: [String],
	description: String,
	street: String,
	city: String,
	state: String,
	zipCode: String,
	location: {
		type: {
			type: String,
			default: 'Point',
		},
		coordinates: { type: [Number] },
	},
	cuisine: [String],
	tel: [String],
	openTime: [Object],
	likes: [String],
	types: [String],
	stripeAccount: String,
});

MerchantSchema.index({ location: '2dsphere' });
const Merchants = mongoose.model('Merchants', MerchantSchema);

export default Merchants;
