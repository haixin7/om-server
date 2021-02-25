import mongoose from 'mongoose';

const SocialSchema = new mongoose.Schema({
	userName: String,
	email: String,
	password: String,
	isGuest: { type: Boolean, default: true },
	gender: String,
	location: {
		type: { type: String },
		coordinates: [],
	},
	street: String,
	city: String,
	state: String,
	zipCode: String,
	phone: String,
	avatar: String,
	favorites: [String],
	socialType: { type: String, enum: ['facebook', 'google'] },
});

const Social = mongoose.model('Social', SocialSchema);

export default Social;

// enum: ["Facebook", "Google"]
