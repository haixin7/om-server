import jwt from 'jsonwebtoken';
import userRoles from './userRoles';
require('dotenv').config();

const JWT_SECRET =
  process.env.JWT_SECRET;

const tokenIndex = 1;

const authenticateEmployeeToken = async (
	req,
	res,
	next,
) => {
	const authHeader =
    req.headers.authorization;
	const token =
    authHeader &&
    authHeader.split(' ')[tokenIndex];
	const urlTochecked =
    req.baseUrl + req.path;

	if (!token) {
		return res.json({
			success: false,
			data: 'Token is not found',
		});
	}
	try {
		const employee = await jwt.verify(
			token,
			JWT_SECRET,
		);

		if (
			employee.employeeActive &&
      userRoles[
      /* eslint-disable-next-line no-mixed-spaces-and-tabs*/
      	employee.employeeRole
      ].includes(urlTochecked)
		) {
			req.employee = employee;
			return next();
		}
		return res.json({
			success: false,
			data: 'token is not valid',
		});
	} catch (e) {
		return res.json({
			success: false,
			data: e,
		});
	}
};

export default authenticateEmployeeToken;
