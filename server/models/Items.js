import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
	categoryId: String,
	title: String,
	description: String,
	image: String,
	type: Object,
});

const Items = mongoose.model('Items', ItemSchema);

export default Items;
