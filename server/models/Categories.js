import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
	merchantId: String,
	title: String,
	avaliableTime: [String],
	description: String,
});

const Categories = mongoose.model('Categories', CategorySchema);

export default Categories;
