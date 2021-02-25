import mongoose, { Schema } from 'mongoose';

const VariantSchema = new mongoose.Schema({
	itemId: String,
	title: String,
	description: String,
	price: Schema.Types.Decimal128,
});

const Variants = mongoose.model('Variants', VariantSchema);

export default Variants;
