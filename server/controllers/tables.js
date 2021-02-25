import Tables from '../models/Tables';

const TABLE_PER_PAGE = 5;
const FIRST_PAGE = 1;
const DECREASE = -1;
const ZERO = 0;

const createTable = (data) => {
	const { merchantId, title, type, size } = data;

	if (!merchantId) {
		throw 'missing merchantId';
	}
	if (!title) {
		throw 'missing title';
	}
	if (!type) {
		throw 'missing type';
	}
	if (!size) {
		throw 'missing size';
	}
	return Tables.create({
		merchantId,
		title,
		type,
		size,
	});
};

const getTableById = async (data) => {
	const { tableId } = data;

	if (!tableId) {
		throw 'tableId is missing';
	}

	const result = await Tables.findById(tableId);

	if (!result) {
		throw 'Table does not exist';
	}

	return result;
};

const getTablesByMerchantId = async (data) => {
	const { merchantId, page } = data;

	if (!merchantId) {
		throw 'missing merchantId';
	}
	if (!page) {
		throw 'missing page';
	}

	const result = await Tables.find({ merchantId: merchantId })
		.skip((page - FIRST_PAGE) * TABLE_PER_PAGE)
		.limit(TABLE_PER_PAGE)
		.sort({ title: DECREASE });

	if (result.length === ZERO) {
		throw 'Table cannot be found';
	}

	return result;
};

const removeTableById = (data) => {
	const { tableId } = data;

	if (!tableId) {
		throw 'tableId is missing';
	}
	return Tables.findByIdAndRemove(tableId);
};

const updateTableById = (data) => {
	const { tableId, field, value } = data;

	if (!tableId) {
		throw 'Missing tableId';
	}
	if (!field) {
		throw 'Missing key field';
	}
	if (!value) {
		throw 'Missing value';
	}
	return Tables.findByIdAndUpdate(
		tableId,
		{
			$set: {
				[field]: value,
			},
		},
		{
			new: true,
		},
	);
};

const getTablesByType = async (data) => {
	const { type, page } = data;

	if (!type) {
		throw 'type is missing';
	}
	if (!page) {
		throw 'missing page';
	}
	const result = await Tables.find({ type: type })
		.skip((page - FIRST_PAGE) * TABLE_PER_PAGE)
		.limit(TABLE_PER_PAGE)
		.sort({ title: DECREASE });

	if (result.length === ZERO) {
		throw 'This type of table cannot be found';
	}

	return result;
};

const getTablesBySize = async (data) => {
	const { size, page } = data;

	if (!size) {
		throw 'size is missing';
	}
	if (!page) {
		throw 'missing page';
	}
	const result = await Tables.find({ size: size })
		.skip((page - FIRST_PAGE) * TABLE_PER_PAGE)
		.limit(TABLE_PER_PAGE)
		.sort({ title: DECREASE });

	if (result.length === ZERO) {
		throw 'Table in this size cannot be found';
	}

	return result;
};

const TableController = {
	createTable,
	getTableById,
	getTablesByMerchantId,
	removeTableById,
	updateTableById,
	getTablesByType,
	getTablesBySize,
};

export default TableController;
