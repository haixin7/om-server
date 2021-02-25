const users = [];

// Join user to room
const SPLITINDEX = 1;
const INDEX = 0;
const CHECK = -1;
const userJoin = (id, username, room) => {
	if (username && room) {
		const user = { id, username, room };

		users.push(user);

		return user;
	}
	return null;
};

const getCurrentUser = (id) => {
	const result = users.find((user) => user.id === id);

	return result;
};

// User leaves chat
const userLeave = (id) => {
	const index = users.findIndex((user) => user.id === id);

	if (index !== CHECK) {
		return users.splice(index, SPLITINDEX)[INDEX];
	}
	return null;
};

// Get room users
const getRoomUsers = (room) => {
	return users.filter((user) => user.room === room);
};

const splitBill = {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers,
};

export default splitBill;
