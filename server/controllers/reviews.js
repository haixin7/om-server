import Reviews from '../models/Reviews';

const REVIEWS_PER_PAGE = 5;
const FIRST_PAGE = 1;
const DESCENDING_ORDER = -1;
const FIRST_INDEX = 0;

const createReview = async (data) => {
	const { userId, merchantId, text, rating } = data;

	if (!userId) {
		throw 'missing userId';
	}
	if (!merchantId) {
		throw 'missing merchantId';
	}
	if (!text) {
		throw 'missing text';
	}
	if (!rating) {
		throw 'missing rating';
	}
	return Reviews.create({ userId, merchantId, text, rating });
};

const deleteReview = async (data) => {
	const { reviewId } = data;

	if (!reviewId) {
		throw 'missing reviewId';
	}
	return Reviews.findByIdAndDelete(reviewId);
};

const fetchAllReviews = async (data) => {
	const { page } = data;

	if (!page) {
		throw 'missing page';
	}
	const [dataArray] = await Reviews.aggregate([
		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [
					{ $skip: (page - FIRST_PAGE) * REVIEWS_PER_PAGE },
					{ $limit: REVIEWS_PER_PAGE },
				],
			},
		},
	]);
	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};

const fetchReviewById = async (data) => {
	const { reviewId } = data;

	if (!reviewId) {
		throw 'missing reviewId';
	}

	const result = await Reviews.findById(reviewId);

	if (!result) {
		throw 'Review does not exist.';
	}

	return result;
};
// eslint-disable-next-line max-statements
const fetchReviewsByMerchant = async (data) => {
	const { page, merchantId, sort } = data;

	if (!page) {
		throw 'missing page';
	}
	if (!merchantId) {
		throw 'missing merchantId';
	}
	if (!sort) {
		const [dataArray] = await Reviews.aggregate([
			{
				$match: {
					merchantId,
				},
			},
			{ $sort: { _id: DESCENDING_ORDER } },
			{
				$facet: {
					total: [{ $count: 'total' }],
					result: [
						{ $skip: (page - FIRST_PAGE) * REVIEWS_PER_PAGE },
						{ $limit: REVIEWS_PER_PAGE },
					],
				},
			},
		]);
		const total = dataArray.total[FIRST_INDEX].total;
		const result = dataArray.result;

		return { result, total };
	}
	const [dataArray] = await Reviews.aggregate([
		{
			$match: {
				merchantId,
			},
		},
		{ $sort: { rating: DESCENDING_ORDER } },
		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [
					{ $skip: (page - FIRST_PAGE) * REVIEWS_PER_PAGE },
					{ $limit: REVIEWS_PER_PAGE },
				],
			},
		},
	]);
	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};
/* eslint-disable-next-line max-statements */
const fetchReviewsByUser = async (data) => {
	const { page, userId, sort } = data;

	if (!page) {
		throw 'missing page';
	}
	if (!userId) {
		throw 'missing userId';
	}
	if (!sort) {
		const [dataArray] = await Reviews.aggregate([
			{
				$match: {
					userId,
				},
			},
			{ $sort: { _id: DESCENDING_ORDER } },
			{
				$facet: {
					total: [{ $count: 'total' }],
					result: [
						{ $skip: (page - FIRST_PAGE) * REVIEWS_PER_PAGE },
						{ $limit: REVIEWS_PER_PAGE },
					],
				},
			},
		]);
		const total = dataArray.total[FIRST_INDEX].total;
		const result = dataArray.result;

		return { result, total };
	}
	const [dataArray] = await Reviews.aggregate([
		{
			$match: {
				userId,
			},
		},
		{ $sort: { rating: DESCENDING_ORDER } },
		{
			$facet: {
				total: [{ $count: 'total' }],
				result: [
					{ $skip: (page - FIRST_PAGE) * REVIEWS_PER_PAGE },
					{ $limit: REVIEWS_PER_PAGE },
				],
			},
		},
	]);
	const total = dataArray.total[FIRST_INDEX].total;
	const result = dataArray.result;

	return { result, total };
};

const createComment = async (data) => {
	const { reviewId, userId, text } = data;

	if (!reviewId) {
		throw 'missing reviewId';
	}
	if (!userId) {
		throw 'missing userId';
	}
	if (!text) {
		throw 'missing text';
	}
	return Reviews.findByIdAndUpdate(
		reviewId,
		{
			$push: {
				comments: { text: text, authorId: userId },
			},
		},
		{
			new: true,
		},
	);
};

const deleteComment = async (data) => {
	const { reviewId, commentIndex } = data;
	const { comments } = await Reviews.findById(reviewId);
	const currentComment = comments[commentIndex];

	if (!reviewId) {
		throw 'missing';
	}
	if (!commentIndex) {
		throw 'missing';
	}
	return Reviews.findByIdAndUpdate(
		reviewId,
		{
			$pull: {
				comments: currentComment,
			},
		},
		{
			new: true,
		},
	);
};

const ReviewController = {
	createReview,
	deleteReview,
	createComment,
	deleteComment,
	fetchReviewById,
	fetchAllReviews,
	fetchReviewsByMerchant,
	fetchReviewsByUser,
};

export default ReviewController;
