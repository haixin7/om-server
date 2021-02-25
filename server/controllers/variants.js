import Variants from '../models/Variants';

const VARIANT_PER_PAGE = 5;
const FIRST_PAGE = 1;
const ZERO = 0;
const FIRST_INDEX = 0;
const ASCENDING_ORDER = 1;

const createVariant = (data) => {
	const { itemId, title, description, price } = data;

	if (!itemId) {
		throw 'missing itemId';
	}
	if (!title) {
		throw 'missing title';
	}
	if (!description) {
		throw 'missing description';
	}
	if (!price) {
		throw 'missing price';
	}

	return Variants.create({
		itemId,
		title,
		description,
		price,
	});
};
const getVariantsByItem = async (data) => {
	const { itemId, page } = data;

	if (!itemId) {
		throw 'missing item id';
	}
	if (!page) {
		throw 'missing page';
	}
	const result = await Variants.aggregate([
		{
			$addFields: {
				convertedItemId: {
					$toObjectId: '$itemId',
				},
			},
		},
		{
			$match: { itemId: itemId },
		},
		{
			$lookup: {
				from: 'items',
				localField: 'convertedItemId',
				foreignField: '_id',
				as: 'itemList',
			},
		},
	])
		.skip((page - FIRST_PAGE) * VARIANT_PER_PAGE)
		.limit(VARIANT_PER_PAGE);

	if (result.length === ZERO) {
		throw 'Variants cannot be found';
	}

	return result;
};

const getVariantsByCategoryId = async (data) => {
	const { categoryId } = data;

	if (!categoryId) {
		throw 'missing categoryId';
	}

	const [dataArray] = await Variants.aggregate([
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
				],
				as: 'itemInfo',
			},
		},
		{ $unwind: '$itemInfo' },
		{ $sort: { description: ASCENDING_ORDER } },
		{
			$addFields: {
				categoryId: '$itemInfo.categoryId',
				itemTitle: '$itemInfo.title',
			},
		},
		{ $match: { categoryId: categoryId } },

		{
			$lookup: {
				from: 'categories',
				let: { categoryObjId: { $toObjectId: '$itemInfo.categoryId' } },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ['$_id', '$$categoryObjId'] },
						},
					},
				],
				as: 'categoryInfo',
			},
		},
		{ $unwind: '$categoryInfo' },

		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [{ $sort: { itemInfo: ASCENDING_ORDER } }],
			},
		},
	]);

	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};
const getVariantsByMerchantId = async (data) => {
	const { merchantId } = data;

	if (!merchantId) {
		throw 'missing merchantId';
	}

	const [dataArray] = await Variants.aggregate([
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
				],
				as: 'itemInfo',
			},
		},
		{ $unwind: '$itemInfo' },
		{
			$addFields: {
				categoryId: '$itemInfo.categoryId',
				itemTitle: '$itemInfo.title',
			},
		},

		{
			$lookup: {
				from: 'categories',
				let: { categoryObjId: { $toObjectId: '$itemInfo.categoryId' } },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ['$_id', '$$categoryObjId'] },
						},
					},
				],
				as: 'categoryInfo',
			},
		},
		{ $unwind: '$categoryInfo' },
		{
			$addFields: {
				merchantId: '$categoryInfo.merchantId',
			},
		},
		{ $match: { merchantId: merchantId } },

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

const updateVariant = (data) => {
	const { variantId, title, description, price } = data;

	if (!variantId) {
		throw 'Missing variantId';
	}

	// if (!title) {
	//   throw 'Missing title';
	// }
	// if (!description) {
	//   throw 'Missing description';
	// }
	// if (!price) {
	//   throw 'Missing price';
	// }
	return Variants.findByIdAndUpdate(
		variantId,
		{
			$set: {
				title,
				description,
				price,
			},
		},
		{
			new: true,
		},
	);
};

const VariantController = {
	createVariant,
	getVariantsByItem,
	getVariantsByCategoryId,
	getVariantsByMerchantId,
	updateVariant,
};

export default VariantController;
