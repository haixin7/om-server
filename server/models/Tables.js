import mongoose from 'mongoose';

const TableSchema = new mongoose.Schema({
	merchantId: String,
	title: String,
	type: String,
	size: String,
});

const Tables = mongoose.model('Tables', TableSchema);

export default Tables;
