import Payments from '../models/Payments';

const PAYMENTS_PER_PAGE = 5;
const FIRST_PAGE = 1;
const DESCENDING_ORDER = -1;
const NEEDED_FIELDS = 1;
const NO_LENGTH = 0;

const FIRST_INDEX = 0;

const EPOCH_CONVERT = 1000;
const MIDNIGHT_OFFSET_TIME = 0;
const CONVERT_DAY_MULTIPLE = 86400;
const CONVERT_WEEK_MULTIPLE = 604800;
const CONVERT_MONTH_MULTIPLE = 2629743;
let convertNumber;

const getPaymentById = async (data) => {
	const { paymentId } = data;

	if (!paymentId) {
		throw 'paymentId is missing';
	}
	const result = await Payments.findById(paymentId);

	if (!result) {
		throw 'result is false';
	}
	return result;
};

const getPaymentsByUserId = async (data) => {
	const { userId, page } = data;

	if (!userId) {
		throw 'userId is missing';
	}
	if (!page) {
		throw 'page is missing';
	}

	const [dataArray] = await Payments.aggregate([
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
				from: 'orders',
				let: { orderObjId: { $toObjectId: '$orderId' } },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ['$_id', '$$orderObjId'] },
						},
					},
				],
				as: 'orderId',
			},
		},
		{
			$addFields: {
				variantId: '$orderId.variantId',
			},
		},
		{ $unwind: '$variantId' },
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
				as: 'variantId',
			},
		},
		{ $unwind: '$variantId' },
		{
			$addFields: {
				itemId: '$variantId.itemId',
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
				as: 'variantId.itemId',
			},
		},

		{
			$group: {
				_id: '$_id',
				userId: { $first: '$userId' },
				merchantId: { $first: '$merchantId' },
				tableId: { $first: '$tableId' },
				chargeId: { $first: '$chargeId' },
				stripeId: { $first: '$stripeId' },
				tips: { $first: '$tips' },
				tax: { $first: '$tax' },
				total: { $first: '$total' },
				description: { $first: '$description' },
				date: { $first: '$date' },
				epoch: { $first: '$epoch' },
				orderId: { $first: '$orderId' },
				variantId: { $push: '$variantId' },
				itemId: { $push: '$itemId' },
			},
		},

		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [
					{ $sort: { _id: DESCENDING_ORDER } },
					{ $skip: (page - FIRST_PAGE) * PAYMENTS_PER_PAGE },
					{ $limit: PAYMENTS_PER_PAGE },
				],
			},
		},
	]);
	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};

const getPaymentByOrderId = async (data) => {
	const { orderId } = data;

	if (!orderId) {
		throw 'orderId is missing';
	}

	const result = await Payments.find({ orderId });

	if (result.length === NO_LENGTH) {
		throw 'null';
	}

	return result;
};

const getPaymentByTableId = async (data) => {
	const { page, tableId } = data;

	if (!page) {
		throw 'page is missing';
	}
	if (!tableId) {
		throw 'tableId is missing';
	}

	const [dataArray] = await Payments.aggregate([
		{ $match: { tableId } },
		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [
					{ $sort: { _id: DESCENDING_ORDER } },
					{ $skip: (page - FIRST_PAGE) * PAYMENTS_PER_PAGE },
					{ $limit: PAYMENTS_PER_PAGE },
				],
			},
		},
	]);
	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};

// eslint-disable-next-line max-statements,complexity
const getPaymentsByMerchantIdInDateRange = async (data) => {
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

	const result = await Payments.aggregate([
		{
			$match: {
				merchantId,
				epoch: { $gte: convertRange },
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
				as: 'table',
			},
		},
	]);

	return result;
};

const getPaymentsByMerchantId = async (data) => {
	const { merchantId } = data;

	if (!merchantId) {
		throw 'merchantId is missing';
	}

	const result = await Payments.aggregate([
		{
			$match: {
				merchantId: merchantId,
			},
		},
		{
			$lookup: {
				from: 'tables',
				let: {
					tableObjId: {
						$toObjectId: '$tableId',
					},
				},
				pipeline: [
					{
						$match: {
							$expr: {
								$eq: ['$_id', '$$tableObjId'],
							},
						},
					},
					{
						$project: {
							title: 1,
						},
					},
				],
				as: 'table',
			},
		},
	]);

	return result;
};

// eslint-disable-next-line max-statements,complexity
const getPaymentInDateRange = async (data) => {
	const { page, dateRange, rangeAmount } = data;

	if (!page) {
		throw 'page is missing';
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

	const [dataArray] = await Payments.aggregate([
		{
			$match: {
				epoch: { $gte: convertRange },
			},
		},
		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [
					{ $sort: { _id: DESCENDING_ORDER } },
					{ $skip: (page - FIRST_PAGE) * PAYMENTS_PER_PAGE },
					{ $limit: PAYMENTS_PER_PAGE },
				],
			},
		},
	]);
	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};

const PaymentController = {
	getPaymentById,
	getPaymentsByUserId,
	getPaymentByOrderId,
	getPaymentByTableId,
	getPaymentsByMerchantIdInDateRange,
	getPaymentsByMerchantId,
	getPaymentInDateRange,
};

export default PaymentController;
