import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	userName: String,
	email: { type: String, unique: true },
	password: String,
	isGuest: { type: Boolean, default: true },
	gender: String,
	location: {
		type: { type: String, default: 'Point' },
		coordinates: { type: [Number] },
	},
	street: String,
	city: String,
	state: String,
	zipCode: String,
	phone: { type: String, unique: true },
	avatar: String,
	favorites: [String],
});

UserSchema.index({ location: '2dsphere' });
const Users = mongoose.model('Users', UserSchema);

export default Users;
