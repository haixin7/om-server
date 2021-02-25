import Merchants from '../models/Merchants';

const MERCHANTS_PER_PAGE = 5;
const FIRST_PAGE = 1;
const DESCENDING_ORDER = -1;
const FIRST_INDEX = 0;
// eslint-disable-next-line max-statements, complexity
const createMerchant = async (data) => {
	const { name, description, QRcode, cuisine, longitude, latitude } = data;
	const duplicateName = await Merchants.findOne({ name });
	const checkDuplicatedId = async () => {
		const MULTIPLE = 1000;
		const rndInteger = Math.floor(Math.random() * MULTIPLE);
		const duplicateId = await Merchants.findOne({ rndInteger });

		if (!duplicateId) {
			return rndInteger;
		}
		return nonDuplicatedId();
	};
	const nonDuplicatedId = await checkDuplicatedId();

	if (duplicateName) {
		throw 'name is taken';
	}
	if (!name) {
		throw 'name is missing';
	}
	if (!description) {
		throw 'description is missing';
	}
	if (!QRcode) {
		throw 'QRcode is missing';
	}
	if (!cuisine) {
		throw 'Cuisine is missing';
	}
	if (!longitude) {
		throw 'longitude is missing';
	}
	if (!latitude) {
		throw 'latitude is missing';
	}

	return Merchants.create({
		merchantId: nonDuplicatedId,
		name,
		description,
		QRcode,
		cuisine,
		location: {
			coordinates: [+longitude, +latitude],
		},
	});
};
const logoUpdate = (data) => {
	const { merchantId, logo } = data;

	if (!merchantId) {
		throw 'Missing merchantId';
	}
	return Merchants.findOneAndUpdate(
		{ merchantId },

		{
			$set: { logo },
		},

		{
			new: true,
		},
	);
};
const merchantImagesUpdate = (data) => {
	const { merchantId, images } = data;

	if (!merchantId) {
		throw 'Missing merchantId';
	}
	return Merchants.findOneAndUpdate(
		{ merchantId },

		{
			$set: { images },
		},

		{
			new: true,
		},
	);
};
const profileUpdate = (data) => {
	const {
		merchantId,
		name,
		description,
		openTime,
		street,
		city,
		state,
		zipCode,
		types,
	} = data;

	if (!merchantId) {
		throw 'Missing merchantId';
	}
	if (!name) {
		throw 'Missing name';
	}

	return Merchants.findOneAndUpdate(
		{ merchantId },

		{
			$set: {
				merchantId,
				name,
				description,
				openTime,
				street,
				city,
				state,
				zipCode,
				types,
			},
		},

		{
			new: true,
		},
	);
};

const getMerchantById = async (data) => {
	const { merchantId } = data;

	if (!merchantId) {
		throw 'merchantId is missing';
	}
	const result = await Merchants.findOne({ merchantId });

	if (!result) {
		throw 'Merchant does not exist';
	}

	return result;
};
const getMerchantByObjId = async (data) => {
	const { merchantObjId } = data;

	if (!merchantObjId) {
		throw 'merchantObjId is missing';
	}
	const result = await Merchants.findById(merchantObjId);

	if (!result) {
		throw 'Merchant does not exist';
	}
	return result;
};

const findAllMerchants = async (data) => {
	const { page } = data;

	if (!page) {
		throw 'page is missing';
	}

	const [dataArray] = await Merchants.aggregate([
		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [
					{ $sort: { distance: DESCENDING_ORDER } },
					{ $skip: (page - FIRST_PAGE) * MERCHANTS_PER_PAGE },
					{ $limit: MERCHANTS_PER_PAGE },
				],
			},
		},
	]);

	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};
// eslint-disable-next-line max-statements, complexity
const findAllMerchantsByFilter = async (data) => {
	const {
		page,
		filter,
		value,
		sort,
		keyword,
		longitude,
		latitude,
		trend,
	} = data;

	if (!page) {
		throw 'page is missing';
	}
	if (!filter) {
		throw 'filter is missing';
	}
	if (!value) {
		throw 'value is missing';
	}
	if (!keyword) {
		throw 'keyword is missing';
	}
	if (!sort) {
		throw 'sort is missing';
	}
	if (!trend) {
		throw 'trend is missing';
	}
	if (!longitude) {
		throw 'longitude is missing';
	}
	if (!latitude) {
		throw 'latitude is missing';
	}

	const [dataArray] = await Merchants.aggregate([
		{
			$geoNear: {
				near: {
					type: 'Point',
					coordinates: [+longitude, +latitude],
				},
				distanceField: 'distance',
				key: 'location',
				spherical: true,
			},
		},
		{
			$match: {
				$and: [
					{ name: { $regex: keyword, $options: 'i' } },
					{ [filter]: { $in: [value] } },
				],
			},
		},
		{ $sort: { [sort]: +trend } },
		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [
					{ $skip: (page - FIRST_PAGE) * MERCHANTS_PER_PAGE },
					{ $limit: MERCHANTS_PER_PAGE },
				],
			},
		},
	]);

	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};

const removeMerchantById = (data) => {
	const { merchantId } = data;

	if (!merchantId) {
		throw 'merchantId is missing';
	}
	return Merchants.findOneAndDelete({ merchantId });
};

const likeMerchant = async (data) => {
	const { merchantId, userId } = data;
	const { likes } = await Merchants.findOne({ merchantId });
	const currentLikes = likes.includes(userId);

	if (!merchantId) {
		throw 'Missing merchant id';
	}
	if (!userId) {
		throw 'Missing user id';
	}
	if (currentLikes) {
		throw 'You already liked this merchant';
	}
	return Merchants.findOneAndUpdate(
		{ merchantId },
		{
			$addToSet: {
				likes: userId,
			},
		},
		{ new: true },
	);
};
const unlikeMerchant = async (data) => {
	const { merchantId, userId } = data;
	const { likes } = await Merchants.findOne({ merchantId });
	const currentLikes = likes.includes(userId);

	if (!merchantId) {
		throw 'Missing merchant id';
	}
	if (!userId) {
		throw 'Missing user id';
	}
	if (!currentLikes) {
		throw 'You have not liked this merchant';
	}
	return Merchants.findOneAndUpdate(
		{ merchantId },
		{
			$pull: {
				likes: userId,
			},
		},
		{ new: true },
	);
};

const deleteMerchantImage = async (data) => {
	const { merchantId, index } = data;
	const deleteItem = 1;
	const { images } = await Merchants.findOne({ merchantId });

	images.splice(index, deleteItem);
	if (!merchantId) {
		throw 'Missing merchant id';
	}
	if (!index) {
		throw 'Missing index';
	}
	return Merchants.findOneAndUpdate(
		{ merchantId },
		{
			$set: { images },
		},
		{
			new: true,
		},
	);
};

const MerchantController = {
	createMerchant,
	profileUpdate,
	getMerchantById,
	getMerchantByObjId,
	findAllMerchants,
	findAllMerchantsByFilter,
	removeMerchantById,
	likeMerchant,
	unlikeMerchant,
	deleteMerchantImage,
	logoUpdate,
	merchantImagesUpdate,
};

export default MerchantController;
