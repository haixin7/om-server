import Items from '../models/Items';
import Categories from '../models/Categories';

const ITEMS_PER_PAGE = 5;
const FIRST_PAGE = 1;
const ZERO = 0;

const createItem = (data) => {
	const { title, description, type, categoryId, image } = data;

	if (!title) {
		throw 'missing title';
	}
	if (!description) {
		throw 'missing description';
	}
	if (!type) {
		throw 'missing type';
	}
	if (!categoryId) {
		throw 'missing category';
	}

	// if (!image) {
	// 	throw 'missing image link';
	// }
	return Items.create({ title, description, type, categoryId, image });
};

const getItemsByCategoryId = async (data) => {
	const { categoryId, page } = data;

	if (!categoryId) {
		throw 'missing category id';
	}
	if (!page) {
		throw 'missing page';
	}
	const result = await Items.aggregate([
		{
			$addFields: {
				convertedId: { $toObjectId: categoryId },
			},
		},
		{
			$match: {
				categoryId: categoryId,
			},
		},
		{
			$lookup: {
				from: 'categories',
				localField: 'convertedId',
				foreignField: '_id',
				as: 'categoryList',
			},
		},
	])
		.skip((page - FIRST_PAGE) * ITEMS_PER_PAGE)
		.limit(ITEMS_PER_PAGE);

	if (result.length === ZERO) {
		throw 'Items cannot be found';
	}

	return result;
};

const updateItemImageById = (data) => {
	const { itemId, link } = data;

	if (!itemId) {
		throw 'missing item Id';
	}

	if (!link) {
		throw 'Missing image link';
	}
	return Items.findByIdAndUpdate(
		itemId,
		{
			$set: {
				image: link,
			},
		},
		{
			new: true,
		},
	);
};
const updateItemById = (data) => {
	const { itemId, title, description, type } = data;

	if (!itemId) {
		throw 'missing item Id';
	}

	return Items.findByIdAndUpdate(
		itemId,
		{
			$set: {
				title,
				description,
				type,
			},
		},
		{
			new: true,
		},
	);
};

const getItemsByMerchantId = async (data) => {
	const { merchantId } = data;

	if (!merchantId) {
		throw 'missing merchantId';
	}

	return Categories.aggregate([
		{
			$addFields: {
				convertedFieldId: {
					$toString: '$_id',
				},
			},
		},
		{ $match: { merchantId } },
		{
			$lookup: {
				from: 'items',
				localField: 'categoryId',
				foreignField: 'convertedFieldId',
				as: 'itemList',
			},
		},
	]);
};

const deleteImage = async (data) => {
	const { image, itemId } = data;

	if (!image) {
		throw 'missing image';
	}
	if (!itemId) {
		throw 'missing itemId';
	}
	return Items.findByIdAndUpdate(
		itemId,
		{
			$pull: { image: image },
		},
		{
			new: true,
		},
	);
};

const ItemController = {
	createItem,
	getItemsByCategoryId,
	updateItemImageById,
	updateItemById,
	getItemsByMerchantId,
	deleteImage,
};

export default ItemController;
