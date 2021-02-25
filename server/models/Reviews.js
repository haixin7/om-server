import mongoose, { Schema } from 'mongoose';

const ReviewSchema = new mongoose.Schema({
	userId: String,
	merchantId: String,
	text: String,
	comments: [Object],
	rating: Schema.Types.Decimal128,
	images: [String],
});

const Reviews = mongoose.model('Reviews', ReviewSchema);

export default Reviews;
