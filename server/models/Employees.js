import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
	merchantId: String,
	isActive: { type: Boolean, default: true },
	employeeName: String,
	employeeType: String,
	phone: { type: String, unique: true },
	password: String,
});

const Employees = mongoose.model('Employees', EmployeeSchema);

export default Employees;
