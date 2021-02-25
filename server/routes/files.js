import express from 'express';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
import multer from 'multer';
require('dotenv').config();

const router = express.Router();
const index = 1;
const randomRange = 100000;
const maxReview = 9;
const maxSize = 16000000;
const s3 = new aws.S3({
	accessKeyId: process.env.ACCESS_KEY_ID,
	secretAccessKey: process.env.SECRET_ACCESS_KEY,
	region: 'us-east-1',
});
const upload = multer({
	storage: multerS3({
		s3,
		bucket: 'openmenu-images',
		key: function(req, file, callback) {
			const uniqueName =
        Date.now() + '-' + Math.round(Math.random() * randomRange);
			const fileType = file.mimetype.split('/')[index];

			if (fileType !== 'png' && fileType !== 'jpeg' && fileType !== 'jpg') {
				return callback(new Error('only images are allowed'));
			}
			return callback(null, `${uniqueName}.${file.mimetype.split('/')[index]}`);
		},
		Metadata: { 'Content-Type': 'video/mp4' },
	}),
	limits: { fieldSize: maxSize },
});

router.post('/user/avatar', upload.single('avatar'), async (req, res) => {
	res.json({
		success: true,
		data: req.file.location,
	});
});

router.post('/item/image', upload.single('item'), async (req, res) => {
	res.json({
		success: true,
		data: req.file.location,
	});
});

router.post(
	'/merchant/images',
	upload.array('merchant', maxReview),
	async (req, res) => {
		const array = req.files;
		const nextArray = [];

		for (let i = 0; i < array.length; i++) {
			nextArray.push(array[i].location);
		}
		array.map((i) => i.location);
		res.json({
			success: true,
			data: nextArray,
		});
	},
);

router.post('/logo', upload.single('logo'), async (req, res) => {
	res.json({
		success: true,
		data: req.file.location,
	});
});

router.post('/review', upload.array('review', maxReview), async (req, res) => {
	const array = req.files;
	const nextArray = [];

	for (let i = 0; i < array.length; i++) {
		nextArray.push(array[i].location);
	}
	array.map((i) => i.location);
	res.json({
		success: true,
		data: nextArray,
	});
});

router.post('/employee/avatar', upload.single('avatar'), async (req, res) => {
	res.json({
		success: true,
		data: req.file.location,
	});
});

export default router;
