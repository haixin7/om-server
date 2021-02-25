import jwt from 'jsonwebtoken';
import userRoles from './userRoles';
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const tokenIndex = 1;

const authenticateUserToken = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(' ')[tokenIndex];
	const urlTochecked = req.baseUrl + req.path;

	if (!token) {
		return res.json({
			success: false,
			data: 'Token is not found',
		});
	}
	try {
		const user = await jwt.verify(
			token,
			JWT_SECRET,
		);

		if (
			!user.role &&
      userRoles.user
      /* eslint-disable-next-line no-mixed-spaces-and-tabs*/
      	.includes(urlTochecked)
		) {
			req.user = user;
			return next();
		}
		return res.json({
			success: false,
			data: 'Invalid token',
		});
	} catch (e) {
		return res.json({
			success: false,
			data: e,
		});
	}
};

export default authenticateUserToken;
