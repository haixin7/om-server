import Categories from '../models/Categories';
import Merchants from '../models/Merchants';

const ZERO = 0;
const ASCENDING_ORDER = 1;
const FIRST_INDEX = 0;
const createCategories = (data) => {
	const { merchantId, title, avaliableTime, description } = data;

	if (!merchantId) {
		throw 'missing merchantId';
	}
	if (!title) {
		throw 'missing title';
	}
	if (!avaliableTime) {
		throw 'missing avaliableTime';
	}
	if (!description) {
		throw 'missing description';
	}
	return Categories.create({
		merchantId,
		title,
		avaliableTime,
		description,
	});
};

const getMenuByMerchantId = async (data) => {
	const { merchantId } = data;

	if (!merchantId) {
		throw 'missing merchantId';
	}

	const [dataArray] = await Categories.aggregate([
		{ $match: { merchantId: merchantId } },
		{
			$lookup: {
				from: 'items',
				let: { categoryStringId: { $toString: '$_id' } },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ['$categoryId', '$$categoryStringId'] },
						},
					},
				],
				as: 'itemInfo',
			},
		},
		{ $unwind: '$itemInfo' },
		{
			$addFields: {
				itemStringId: { $toString: '$itemInfo._id' },
				itemTitle: '$itemInfo.title',
			},
		},

		// {
		// 	$lookup: {
		// 		from: 'variants',
		// 		localField: 'itemStringId',
		// 		foreignField: 'itemId',
		// 		as: 'variantsInfo',
		// 	},
		// },
		// { $unwind: '$variantsInfo' },
		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [{ $sort: { itemTitle: ASCENDING_ORDER } }],
			},
		},
	]);
	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};
const getCategoriesByMerchantId = async (data) => {
	const { merchantId } = data;

	if (!merchantId) {
		throw 'missing merchantId';
	}

	const result = await Merchants.aggregate([
		{ $match: { merchantId: merchantId } },
		{
			$addFields: {
				likesCount: { $size: '$likes' },
			},
		},
		{
			$lookup: {
				from: 'categories',
				localField: 'merchantId',
				foreignField: 'merchantId',
				as: 'categoryInfo',
			},
		},
		{ $unwind: '$categoryInfo' },
		{
			$addFields: {
				categoryTitle: '$categoryInfo.title',
			},
		},
		{ $sort: { categoryTitle: ASCENDING_ORDER } },
	]);

	if (result.length === ZERO) {
		throw 'Categories can not be found';
	}
	return result;
};

const updateCategoriesById = (data) => {
	const { categoryId, field, value } = data;

	if (!categoryId) {
		throw 'Missing user id';
	}
	if (!field) {
		throw 'Missing key field';
	}
	if (!value) {
		throw 'Missing value';
	}
	return Categories.findByIdAndUpdate(
		categoryId,
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
/* eslint-disable-next-line max-statements */
const upsertCategoryById = (data) => {
	const { _id, merchantId, title, description, avaliableTime } = data;

	if (!_id) {
		throw 'Missing category objectId';
	}
	if (!merchantId) {
		throw 'Missing category merchantId';
	}
	if (!title) {
		throw 'Missing title';
	}
	if (!avaliableTime) {
		throw 'Missing avaliableTime';
	}
	if (!description) {
		throw 'Missing description';
	}

	const query = { _id };

	return Categories.replaceOne(query, data, {
		upsert: true,
	});
};

const CategoriesController = {
	createCategories,
	getCategoriesByMerchantId,
	updateCategoriesById,
	getMenuByMerchantId,
	upsertCategoryById,
};

export default CategoriesController;
