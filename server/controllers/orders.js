import Orders from '../models/Orders';

const ITEMS_PER_PAGE = 5;
const FIRST_PAGE = 1;
const DECREASE = -1;
const FIRST_INDEX = 0;
const NEEDED_FIELDS = 1;

const EPOCH_CONVERT = 1000;
const MIDNIGHT_OFFSET_TIME = 0;
const CONVERT_DAY_MULTIPLE = 86400;
const CONVERT_WEEK_MULTIPLE = 604800;
const CONVERT_MONTH_MULTIPLE = 2629743;
let convertNumber;

// eslint-disable-next-line max-statements
const createOrder = async (data) => {
	const ISODate = new Date();
	const date = ISODate.toLocaleString();
	const epoch = Math.floor(ISODate.getTime() / EPOCH_CONVERT);

	const { userId, merchantId, tableId, type, variantId } = data;

	if (!userId) {
		throw 'Missing userId';
	}
	if (!merchantId) {
		throw 'Missing merchantId';
	}
	if (!tableId) {
		throw 'Missing tableId';
	}
	if (!type) {
		throw 'Missing type';
	}
	if (!variantId) {
		throw 'Missing variantId';
	}

	return Orders.create({
		userId,
		merchantId,
		tableId,
		variantId,
		type,
		status: 'Confirming',
		date,
		epoch,
	});
};

const addVariant = (data) => {
	const { orderId, variantId } = data;

	if (!orderId) {
		throw 'orderId is missing';
	}
	if (!variantId) {
		throw 'variantId is missing';
	}

	return Orders.findByIdAndUpdate(
		orderId,
		{
			$addToSet: {
				variantId,
			},
		},
		{ new: true },
	);
};

const removeVariant = (data) => {
	const { orderId, variantId } = data;

	if (!orderId) {
		throw 'orderId is missing';
	}
	if (!variantId) {
		throw 'variantId is missing';
	}

	return Orders.findByIdAndUpdate(
		orderId,
		{
			$pull: {
				variantId,
			},
		},
		{ new: true },
	);
};

const deleteOrderByOrderId = (data) => {
	const { orderId } = data;

	if (!orderId) {
		throw 'orderId is missing';
	}

	return Orders.findByIdAndDelete(orderId);
};

const getAllOrders = async (data) => {
	const { page } = data;

	if (!page) {
		throw 'page is missing';
	}

	const [dataArray] = await Orders.aggregate([
		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [
					{ $sort: { _id: DECREASE } },
					{ $skip: (page - FIRST_PAGE) * ITEMS_PER_PAGE },
					{ $limit: ITEMS_PER_PAGE },
				],
			},
		},
	]);

	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};

const getOrderById = async (data) => {
	const { orderId } = data;

	if (!orderId) {
		throw 'orderId is missing';
	}

	const result = await Orders.findById(orderId);

	if (!result) {
		throw 'Order does not exist.';
	}

	return result;
};

const getOrdersByUserId = async (data) => {
	const { page, userId } = data;

	if (!page) {
		throw 'page is missing';
	}
	if (!userId) {
		throw 'userId is missing';
	}

	const [dataArray] = await Orders.aggregate([
		{ $match: { userId } },
		{
			$lookup: {
				from: 'users',
				let: { userObjId: { $toObjectId: '$userId' } },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ['$_id', '$$userObjId'] },
						},
					},
					{
						$project: {
							userName: NEEDED_FIELDS,
						},
					},
				],
				as: 'userId',
			},
		},
		{
			$lookup: {
				from: 'merchants',
				let: { merchantId: '$merchantId' },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ['$merchantId', '$$merchantId'] },
						},
					},
					{
						$project: {
							name: NEEDED_FIELDS,
							logo: NEEDED_FIELDS,
						},
					},
				],
				as: 'merchantId',
			},
		},
		{
			$lookup: {
				from: 'tables',
				let: { tableObjId: { $toObjectId: '$tableId' } },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ['$_id', '$$tableObjId'] },
						},
					},
					{
						$project: {
							title: NEEDED_FIELDS,
						},
					},
				],
				as: 'tableId',
			},
		},
		{
			$lookup: {
				from: 'variants',
				let: { variantId: '$variantId' },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ['$_id', '$$variantId'] },
						},
					},
				],
				as: 'variantInfo',
			},
		},
		{ $unwind: '$variantId' },
		{
			$lookup: {
				from: 'variants',
				let: { variantObjId: { $toObjectId: '$variantId' } },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ['$_id', '$$variantObjId'] },
						},
					},
				],
				as: 'variantInfo',
			},
		},
		{ $unwind: '$variantInfo' },
		{
			$addFields: {
				itemId: '$variantInfo.itemId',
			},
		},

		{
			$lookup: {
				from: 'items',
				let: { itemObjId: { $toObjectId: '$itemId' } },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ['$_id', '$$itemObjId'] },
						},
					},
					{
						$project: {
							title: NEEDED_FIELDS,
						},
					},
				],
				as: 'variantInfo.itemId',
			},
		},

		{
			$group: {
				_id: '$_id',
				userId: { $first: '$userId' },
				merchantId: { $first: '$merchantId' },
				tableId: { $first: '$tableId' },
				variantId: { $push: '$variantId' },
				variantInfo: { $push: '$variantInfo' },
				itemId: { $push: '$itemId' },
				type: { $first: '$type' },
				status: { $first: '$status' },
				date: { $first: '$date' },
				epoch: { $first: '$epoch' },
			},
		},

		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [
					{ $sort: { _id: DECREASE } },
					{ $skip: (page - FIRST_PAGE) * ITEMS_PER_PAGE },
					{ $limit: ITEMS_PER_PAGE },
				],
			},
		},
	]);

	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};
// eslint-disable-next-line complexity, max-statements
const getOrdersByUserIdInDateRange = async (data) => {
	const { page, userId, dateRange, rangeAmount } = data;

	if (!page) {
		throw 'page is missing';
	}
	if (!userId) {
		throw 'userId is missing';
	}
	if (!rangeAmount) {
		throw 'range amount date is missing';
	}
	if (!dateRange) {
		throw 'date range is missing';
	}

	const epochMidnight = Math.floor(
		new Date(
			new Date().setHours(
				MIDNIGHT_OFFSET_TIME,
				MIDNIGHT_OFFSET_TIME,
				MIDNIGHT_OFFSET_TIME,
				MIDNIGHT_OFFSET_TIME,
			),
		).getTime() / EPOCH_CONVERT,
	);

	if (dateRange === 'days') {
		convertNumber = +rangeAmount * CONVERT_DAY_MULTIPLE;
	}
	if (dateRange === 'weeks') {
		convertNumber = +rangeAmount * CONVERT_WEEK_MULTIPLE;
	}
	if (dateRange === 'months') {
		convertNumber = +rangeAmount * CONVERT_MONTH_MULTIPLE;
	}
	const convertRange = epochMidnight - convertNumber;

	const [dataArray] = await Orders.aggregate([
		{
			$match: {
				userId,
				epoch: { $gte: convertRange },
			},
		},
		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [
					{ $sort: { _id: DECREASE } },
					{ $skip: (page - FIRST_PAGE) * ITEMS_PER_PAGE },
					{ $limit: ITEMS_PER_PAGE },
				],
			},
		},
	]);

	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};

const getOrdersByUserIdAndType = async (data) => {
	const { page, userId, type } = data;

	if (!page) {
		throw 'page is missing';
	}
	if (!userId) {
		throw 'userId is missing';
	}
	if (!type) {
		throw 'type is missing';
	}

	const [dataArray] = await Orders.aggregate([
		{ $match: { userId, type } },
		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [
					{ $sort: { _id: DECREASE } },
					{ $skip: (page - FIRST_PAGE) * ITEMS_PER_PAGE },
					{ $limit: ITEMS_PER_PAGE },
				],
			},
		},
	]);
	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};
const getOrdersByMerchantId = async (data) => {
	const { page, merchantId } = data;

	if (!page) {
		throw 'page is missing';
	}
	if (!merchantId) {
		throw 'merchantId is missing';
	}

	const [dataArray] = await Orders.aggregate([
		{ $match: { merchantId } },
		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [
					{ $sort: { _id: DECREASE } },
					{ $skip: (page - FIRST_PAGE) * ITEMS_PER_PAGE },
					{ $limit: ITEMS_PER_PAGE },
				],
			},
		},
	]);
	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};

const getOrdersByMerchantIdAndType = async (data) => {
	const { page, merchantId, type } = data;

	if (!page) {
		throw 'page is missing';
	}
	if (!merchantId) {
		throw 'merchantId is missing';
	}
	if (!type) {
		throw 'type is missing';
	}

	const [dataArray] = await Orders.aggregate([
		{ $match: { merchantId, type } },
		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [
					{ $sort: { _id: DECREASE } },
					{ $skip: (page - FIRST_PAGE) * ITEMS_PER_PAGE },
					{ $limit: ITEMS_PER_PAGE },
				],
			},
		},
	]);
	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};

// eslint-disable-next-line max-statements, complexity
const getOrdersByMerchantIdInDateRange = async (data) => {
	const { page, merchantId, dateRange, rangeAmount } = data;

	if (!merchantId) {
		throw 'merchantId is missing';
	}
	if (!rangeAmount) {
		throw 'range amount date is missing';
	}
	if (!dateRange) {
		throw 'date range is missing';
	}

	const epochMidnight = Math.floor(
		new Date(
			new Date().setHours(
				MIDNIGHT_OFFSET_TIME,
				MIDNIGHT_OFFSET_TIME,
				MIDNIGHT_OFFSET_TIME,
				MIDNIGHT_OFFSET_TIME,
			),
		).getTime() / EPOCH_CONVERT,
	);

	if (dateRange === 'days') {
		convertNumber = +rangeAmount * CONVERT_DAY_MULTIPLE;
	}
	if (dateRange === 'weeks') {
		convertNumber = +rangeAmount * CONVERT_WEEK_MULTIPLE;
	}
	if (dateRange === 'months') {
		convertNumber = +rangeAmount * CONVERT_MONTH_MULTIPLE;
	}
	const convertRange = epochMidnight - convertNumber;

	if (page) {
		const [dataArray] = await Orders.aggregate([
			{
				$match: {
					merchantId,
					epoch: { $gte: convertRange },
				},
			},
			{
				$facet: {
					total: [{ $count: 'total' }],
					result: [
						{ $sort: { _id: DECREASE } },
						{ $skip: (page - FIRST_PAGE) * ITEMS_PER_PAGE },
						{ $limit: ITEMS_PER_PAGE },
					],
				},
			},
		]);
		const total = dataArray.total[FIRST_INDEX].total;
		const result = dataArray.result;

		return { result, total };
	}

	const [dataArray] = await Orders.aggregate([
		{
			$match: {
				merchantId,
				epoch: { $gte: convertRange },
			},
		},
		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [{ $sort: { _id: DECREASE } }],
			},
		},
	]);
	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};
/* eslint-disable-next-line complexity, max-statements*/
const getCategrotyStatistics = async (data) => {
	const { merchantId, dateRange, rangeAmount } = data;

	if (!merchantId) {
		throw 'merchantId is missing';
	}
	if (!rangeAmount) {
		throw 'range amount date is missing';
	}
	if (!dateRange) {
		throw 'date range is missing';
	}

	const epochMidnight = Math.floor(
		new Date(
			new Date().setHours(
				MIDNIGHT_OFFSET_TIME,
				MIDNIGHT_OFFSET_TIME,
				MIDNIGHT_OFFSET_TIME,
				MIDNIGHT_OFFSET_TIME,
			),
		).getTime() / EPOCH_CONVERT,
	);

	if (dateRange === 'days') {
		convertNumber = +rangeAmount * CONVERT_DAY_MULTIPLE;
	}
	if (dateRange === 'weeks') {
		convertNumber = +rangeAmount * CONVERT_WEEK_MULTIPLE;
	}
	if (dateRange === 'months') {
		convertNumber = +rangeAmount * CONVERT_MONTH_MULTIPLE;
	}
	const convertRange = epochMidnight - convertNumber;

	const [dataArray] = await Orders.aggregate([
		{
			$match: {
				merchantId,
				epoch: { $gte: convertRange },
			},
		},
		{
			$unwind: '$variantId',
		},
		{
			$lookup: {
				from: 'variants',
				let: { variantObjectId: { $toObjectId: '$variantId' } },
				pipeline: [
					{
						$match: {
							$expr: {
								$eq: ['$_id', '$$variantObjectId'],
							},
						},
					},
				],
				as: 'variantList',
			},
		},
		{
			$unwind: '$variantList',
		},
		{
			$lookup: {
				from: 'items',
				let: { itemObjectId: { $toObjectId: '$variantList.itemId' } },
				pipeline: [
					{
						$match: {
							$expr: {
								$eq: ['$_id', '$$itemObjectId'],
							},
						},
					},
				],
				as: 'itemList',
			},
		},
		{
			$unwind: '$itemList',
		},
		{
			$lookup: {
				from: 'categories',
				let: { categoryObjectId: { $toObjectId: '$itemList.categoryId' } },
				pipeline: [
					{
						$match: {
							$expr: {
								$eq: ['$_id', '$$categoryObjectId'],
							},
						},
					},
				],
				as: 'categoryList',
			},
		},
		{
			$unwind: '$categoryList',
		},
		{
			$addFields: { description: '$categoryList.description' },
		},
		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [{ $sort: { _id: DECREASE } }],
			},
		},
	]);

	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};

const changeOrderStatus = (data) => {
	const { orderId, status } = data;

	if (!orderId) {
		throw 'orderId is missing';
	}
	if (!status) {
		throw 'status is missing';
	}

	return Orders.findByIdAndUpdate(
		orderId,
		{
			$set: {
				status,
			},
		},
		{ new: true },
	);
};

const getTodayMerchantOrdersByStatus = async (data) => {
	const { merchantId, status } = data;
	const today = new Date().toLocaleDateString();

	if (!merchantId) {
		throw 'merchantId is missing';
	}
	if (!status) {
		throw 'status is missing';
	}

	//   if (!page) {
	//     throw 'page is missing';
	//   }

	const [dataArray] = await Orders.aggregate([
		{
			$match: {
				merchantId,
				status,
				date: { $gte: today },
			},
		},
		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [
					{ $sort: { _id: DECREASE } },

					//   { $skip: (page - FIRST_PAGE) * ITEMS_PER_PAGE },
					//   { $limit: ITEMS_PER_PAGE },
				],
			},
		},
	]);
	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};
const getTodayMerchantOrdersByTable = async (data) => {
	const { merchantId, tableId, page } = data;
	const today = new Date().toLocaleDateString();

	if (!merchantId) {
		throw 'merchantId is missing';
	}
	if (!tableId) {
		throw 'tableId is missing';
	}
	if (!page) {
		throw 'page is missing';
	}

	const [dataArray] = await Orders.aggregate([
		{
			$match: {
				merchantId,
				tableId,
				date: { $gte: today },
			},
		},
		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [
					{ $sort: { _id: DECREASE } },
					{ $skip: (page - FIRST_PAGE) * ITEMS_PER_PAGE },
					{ $limit: ITEMS_PER_PAGE },
				],
			},
		},
	]);
	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};

const OrderController = {
	createOrder,
	addVariant,
	removeVariant,
	deleteOrderByOrderId,
	getAllOrders,
	getOrderById,
	getOrdersByUserId,
	changeOrderStatus,
	getOrdersByUserIdInDateRange,
	getOrdersByUserIdAndType,
	getOrdersByMerchantIdAndType,
	getOrdersByMerchantIdInDateRange,
	getOrdersByMerchantId,
	getTodayMerchantOrdersByStatus,
	getTodayMerchantOrdersByTable,
	getCategrotyStatistics,
};

export default OrderController;
