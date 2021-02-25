import Users from '../models/Users';

const USERS_PER_PAGE = 5;
const FIRST_PAGE = 1;
const DESCENDING_ORDER = -1;
const ASCENDING_ORDER = 1;
const FIRST_INDEX = 0;
const ZERO = 0;

const updateUserProfile = async (data) => {
	const { userId, field, value } = data;

	if (!userId) {
		throw 'Missing userId';
	}
	if (!field) {
		throw 'Missing field';
	}
	if (!value) {
		throw 'Missing value';
	}
	return Users.findByIdAndUpdate(
		userId,
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

const getAllUsers = async (data) => {
	const { page } = data;

	if (!page) {
		throw 'missing page';
	}
	const result = Users.find()
		.sort({ _id: DESCENDING_ORDER })
		.skip((page - FIRST_PAGE) * USERS_PER_PAGE)
		.limit(USERS_PER_PAGE);

	if (result.length === ZERO) {
		throw 'No user can be found';
	}

	return result;
};

const addMerchant = async (data) => {
	const { userId, merchantId } = data;

	if (!userId) {
		throw 'missing userId';
	}
	if (!merchantId) {
		throw 'missing merchantId';
	}
	return Users.findByIdAndUpdate(
		userId,
		{
			$addToSet: {
				favorites: merchantId,
			},
		},
		{
			new: true,
		},
	);
};

const removeMerchant = async (data) => {
	const { userId, merchantId } = data;

	if (!userId) {
		throw 'missing userId';
	}
	if (!merchantId) {
		throw 'missing merchantId';
	}
	return Users.findByIdAndUpdate(
		userId,
		{
			$pull: {
				favorites: merchantId,
			},
		},
		{
			new: true,
		},
	);
};

/* eslint-disable-next-line max-statements*/
const getMerchantsSortByLocation = async (data) => {
	const { userId, longitude, latitude, page } = data;

	if (!userId) {
		throw 'missing userId';
	}
	if (!longitude) {
		throw 'missing longitude';
	}
	if (!latitude) {
		throw 'missing latitude';
	}
	if (!page) {
		throw 'missing page';
	}
	const [dataArray] = await Users.aggregate([
		{
			$addFields: {
				convertedId: {
					$toString: '$_id',
				},
			},
		},
		{
			$match: {
				convertedId: userId,
			},
		},
		{
			$unwind: '$favorites',
		},
		{
			$lookup: {
				from: 'merchants',
				let: { favorites: '$favorites' },
				pipeline: [
					{
						$geoNear: {
							near: {
								type: 'Point',
								coordinates: [+longitude, +latitude],
							},
							distanceField: 'distance',
							spherical: true,
							key: 'location',
						},
					},
					{
						$sort: { distance: ASCENDING_ORDER },
					},
					{
						$match: {
							$expr: {
								$eq: ['$merchantId', '$$favorites'],
							},
						},
					},
				],
				as: 'merchantList',
			},
		},
		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [
					{ $skip: (page - FIRST_PAGE) * USERS_PER_PAGE },
					{ $limit: USERS_PER_PAGE },
				],
			},
		},
	]);
	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};

const getMerchantsSortByReview = async (data) => {
	const { userId, page } = data;

	if (!userId) {
		throw 'missing userId';
	}
	if (!page) {
		throw 'missing page';
	}
	const [dataArray] = await Users.aggregate([
		{
			$addFields: {
				convertedId: {
					$toString: '$_id',
				},
			},
		},
		{
			$match: {
				convertedId: userId,
			},
		},
		{
			$lookup: {
				from: 'merchants',
				localField: 'favorites',
				foreignField: 'merchantId',
				as: 'merchantList',
			},
		},
		{
			$unwind: '$merchantList',
		},
		{
			$addFields: {
				reviewCount: { $size: '$merchantList.likes' },
			},
		},
		{
			$sort: { reviewCount: DESCENDING_ORDER },
		},
		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [
					{ $skip: (page - FIRST_PAGE) * USERS_PER_PAGE },
					{ $limit: USERS_PER_PAGE },
				],
			},
		},
	]);
	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};

const getMerchantsSortByCuisine = async (data) => {
	const { userId, value, page } = data;

	if (!userId) {
		throw 'missing userId';
	}

	if (!value) {
		throw 'missing value';
	}
	const [dataArray] = await Users.aggregate([
		{
			$addFields: {
				convertedId: {
					$toString: '$_id',
				},
			},
		},
		{
			$match: {
				convertedId: userId,
			},
		},
		{
			$lookup: {
				from: 'merchants',
				localField: 'favorites',
				foreignField: 'merchantId',
				as: 'merchantList',
			},
		},
		{
			$unwind: '$merchantList',
		},
		{
			$addFields: {
				cuisineList: '$merchantList.cuisine',
			},
		},
		{
			$unwind: '$cuisineList',
		},
		{
			$match: {
				cuisineList: value,
			},
		},
		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [
					{ $skip: (page - FIRST_PAGE) * USERS_PER_PAGE },
					{ $limit: USERS_PER_PAGE },
				],
			},
		},
	]);
	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};

const getUsersByMerchantId = async (data) => {
	const { merchantId } = data;

	if (!merchantId) {
		throw 'merchantId is missing';
	}

	const [dataArray] = await Users.aggregate([
		{
			$addFields: {
				convertedId: {
					$toString: '$_id',
				},
			},
		},
		{
			$lookup: {
				from: 'orders',
				localField: 'convertedId',
				foreignField: 'userId',
				as: 'orderList',
			},
		},
		{ $unwind: '$orderList' },
		{
			$addFields: {
				merchantId: '$orderList.merchantId',
			},
		},
		{ $match: { merchantId } },
		{
			$addFields: {
				convertedOrderId: {
					$toString: '$orderList._id',
				},
			},
		},
		{
			$lookup: {
				from: 'payments',
				localField: 'convertedOrderId',
				foreignField: 'orderId',
				as: 'paymentList',
			},
		},
		{ $unwind: '$paymentList' },
		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [{ $sort: { _id: DESCENDING_ORDER } }],
			},
		},
	]);
	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};

const UserController = {
	updateUserProfile,
	getAllUsers,
	addMerchant,
	removeMerchant,
	getMerchantsSortByLocation,
	getMerchantsSortByReview,
	getMerchantsSortByCuisine,
	getUsersByMerchantId,
};

export default UserController;
