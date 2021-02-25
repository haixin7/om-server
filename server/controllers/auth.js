import Users from '../models/Users';
import Employees from '../models/Employees';
import Social from '../models/Social';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const verifyToken = (token) => jwt.verify(token, jwtSecret);
/* eslint-disable-next-line max-statements */
const socialAuth = async (data) => {
	const { email, password, socialType } = data;

	if (!email) {
		throw 'Missing email';
	}
	if (!password) {
		throw 'Missing password';
	}
	if (!socialType) {
		throw 'Missing socialType';
	}

	const user = await Social.findOne({
		email,
		socialType,
	});

	if (!user) {
		const hashedPassword = bcrypt.hashSync(password);

		data.password = hashedPassword;

		await Social.create(data);
		const sameUser = await Social.findOne({ email, socialType });
		const token = jwt.sign({ userId: sameUser._id }, jwtSecret);

		return {
			token,
			sameUser,
		};
	}

	const isPasswordMatch = bcrypt.compareSync(password, user.password);

	if (!isPasswordMatch) {
		throw 'Password does not match';
	}
	const token = jwt.sign({ userId: user._id }, jwtSecret);

	return {
		token,
		user,
	};
};

const handleUserLogin = async (data) => {
	const { phone, password } = data;

	if (!phone) {
		throw 'Missing phone';
	}
	if (!password) {
		throw 'Missing password';
	}

	const user = await Users.findOne({
		phone,
	});

	if (!user) {
		throw 'phone is not found';
	}
	const isPasswordMatch = bcrypt.compareSync(password, user.password);

	if (!isPasswordMatch) {
		throw 'Password is not correct';
	}
	return jwt.sign(
		{
			userId: user._id,
			role: user.isGuest,
		},
		jwtSecret,
	);
};

/* eslint-disable-next-line max-statements, complexity*/
const handleUserSignUp = async (data) => {
	const { userName, password, phone } = data;
	const duplicatePhone = await Users.findOne({ phone });

	if (duplicatePhone) {
		throw 'phone is already taken';
	}

	if (!userName) {
		throw 'missing user name';
	}

	if (!password) {
		throw 'missing password';
	}

	if (!phone) {
		throw 'missing phone';
	}

	const hashedPassword = bcrypt.hashSync(password);

	return Users.create({
		userName,
		password: hashedPassword,
		isGuest: false,
		phone,
	});
};

const handleEmployeeLogin = async (data) => {
	const { phone, password } = data;

	if (!phone) {
		throw 'Missing phone';
	}
	if (!password) {
		throw 'Missing password';
	}

	const employee = await Employees.findOne({ phone });

	if (!employee) {
		throw 'employee not found';
	}
	const isPasswordMatch = bcrypt.compareSync(password, employee.password);

	if (!isPasswordMatch) {
		throw 'password not match';
	}
	return jwt.sign(
		{
			employeeId: employee._id,
			employeeRole: employee.employeeType,
			employeeActive: employee.isActive,
		},
		jwtSecret,
	);
};

/* eslint-disable-next-line max-statements*/
const handleEmployeeSignUp = async (data) => {
	const { merchantId, employeeName, employeeType, phone, password } = data;
	const duplicatePhone = await Employees.findOne({ phone });

	if (duplicatePhone) {
		throw 'phone is already taken';
	}
	if (!merchantId) {
		throw 'missing merchantId';
	}
	if (!employeeName) {
		throw 'missing employeeType';
	}
	if (!phone) {
		throw 'missing phone';
	}
	if (!password) {
		throw 'missing passowrd';
	}

	const hashedPassword = bcrypt.hashSync(password);

	return Employees.create({
		merchantId,
		employeeName,
		employeeType,
		phone,
		password: hashedPassword,
	});
};

const handleEmployeeForgetPassword = async (data) => {
	const { phone, password } = data;

	if (!phone) {
		throw 'Missing phone';
	}
	if (!password) {
		throw 'Missing password';
	}

	const employee = await Employees.findOne({ phone });
	const hashedPassword = bcrypt.hashSync(password);

	if (!employee) {
		throw 'Employee is not found!';
	}
	return Employees.findByIdAndUpdate(
		employee._id,
		{ $set: { password: hashedPassword } },
		{ new: true },
	);
};

const handleUserForgetPassword = async (data) => {
	const { phone, password } = data;

	if (!phone) {
		throw 'Missing phone';
	}
	if (!password) {
		throw 'Missing password';
	}

	const user = await Users.findOne({ phone });
	const hashedPassword = bcrypt.hashSync(password);

	if (!user) {
		throw 'User is not found!';
	}
	return Users.findByIdAndUpdate(
		user._id,
		{ $set: { password: hashedPassword } },
		{ new: true },
	);
};

const AuthController = {
	handleUserLogin,
	handleUserSignUp,
	handleEmployeeSignUp,
	handleEmployeeLogin,
	handleEmployeeForgetPassword,
	handleUserForgetPassword,
	socialAuth,
	verifyToken,
};

export default AuthController;
