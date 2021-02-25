// to be added
// example ['/auth/user/login']
const userRoles = {
	user: ['/users/current'],
	guest: [],
	owner: [
		'/employees/',
		'/employees/current',
		'/employees/active',
		'/employees/remove',
		'/employees/edit',
	],
	manager: [
		'/employees/',
		'/employees/current',
		'/employees/active',
		'/employees/remove',
		'/employees/edit',
	],
	employee: [
		'/employees/',
		'/employees/current',
	],
};

export default userRoles;
