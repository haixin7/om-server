import Employees from '../models/Employees';
import bcrypt from 'bcryptjs';

const getEmployeeById = async (data) => {
	const { employeeId } = data;

	if (!employeeId) {
		throw 'missing employeeId';
	}

	const result = await Employees.findById(employeeId);

	if (!result) {
		throw 'Employee does not exist';
	}

	return result;
};

/* eslint-disable-next-line complexity, max-statements*/
const updateEmployeeProfile = async (
	data,
) => {
	const {
		employeeId,
		merchantId,
		employeeName,
		employeeType,
		phone,
		password,
	} = data;

	if (!employeeId) {
		throw 'missing employeeId';
	}
	if (!merchantId) {
		throw 'missing merchantId';
	}
	if (!employeeName) {
		throw 'missing employeeName';
	}
	if (!employeeType) {
		throw 'missing employee type';
	}
	if (!phone) {
		throw 'missing phone';
	}
	if (!password) {
		throw 'missing password';
	}

	const hashedPassword = bcrypt.hashSync(password);

	return Employees.findByIdAndUpdate(
		employeeId,
		{
			/* eslint-disable-next-line max-len*/
			$set: { merchantId: merchantId, employeeName: employeeName, employeeType: employeeType, phone: phone, password: hashedPassword },
		},
		{
			new: true,
		},
	);
};

/* eslint-disable-next-line consistent-return*/
const editEmployee = async (data) => {
	const { employeeId, employeeName, employeeType, phone } = data;

	if (!employeeId) {
		throw 'missing employeeId';
	}
	if (employeeName) {
		return Employees.findByIdAndUpdate(employeeId, {
			$set: { employeeName: employeeName },
		}, {
			new: true,
		});
	}
	if (employeeType) {
		return Employees.findByIdAndUpdate(employeeId, {
			$set: { employeeType: employeeType },
		}, {
			new: true,
		});
	}
	if (phone) {
		return Employees.findByIdAndUpdate(employeeId, {
			$set: { phone: phone },
		},
		{ new: true },
		);
	}
};

const getAllEmployeesByMerchant = async (data) => {
	const { merchantId } = data;

	if (!merchantId) {
		throw 'missing merchantId';
	}

	const result = await Employees.find({ merchantId });

	return { result, total: result.length };
};

/* eslint-disable-next-line complexity, max-statements*/
const toggleEmployee = async (data) => {
	const { merchantId, employeeId } = data;

	if (!merchantId) {
		throw 'missing merchantId';
	}
	if (!employeeId) {
		throw 'missing employeeId';
	}
	const employee = await Employees.findById(employeeId);

	if (merchantId !== employee.merchantId) {
		throw 'not allowed to make changes';
	}
	if (employee.isActive) {
		return Employees.findByIdAndUpdate(
			employeeId,
			{
				$set: {
					isActive: false,
				},
			},
			{ new: true },
		);
	} else if (!employee.isActive) {
		return Employees.findByIdAndUpdate(
			employeeId,
			{
				$set: {
					isActive: true,
				},
			},
			{ new: true },
		);
	}
	throw 'isActive is not valid';
};

const removeEmployeeById = async (data) => {
	const { employeeId } = data;

	if (!employeeId) {
		throw 'missing employeeId';
	}
	const employee = await Employees.findById(employeeId);

	if (!employee) {
		throw 'employee not found';
	}
	return Employees.findByIdAndDelete(employeeId);
};

const EmployeeController = {
	getEmployeeById,
	updateEmployeeProfile,
	editEmployee,
	getAllEmployeesByMerchant,
	toggleEmployee,
	removeEmployeeById,
};

export default EmployeeController;
