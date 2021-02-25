import twilio from 'twilio';

require('dotenv').config();

const ACCT_SID = process.env.ACCOUNT_SID;
const AUTH_TOKEN_STRING = process.env.AUTH_TOKEN;
const SER_SID = process.env.SERVICE_SID;

const PHONE_LENGTH = 12;

const client = twilio(ACCT_SID, AUTH_TOKEN_STRING);

const getSMSCode = async (req, res) => {
	const { phone } = req.body;

	try {
		if (phone.length !== PHONE_LENGTH) {
			throw 'Invalid phone number';
		}
		const result = await client.verify
			.services(SER_SID)
			.verifications.create({ to: phone, channel: 'sms' });

		return res.json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.json({
			success: false,
			data: error,
		});
	}
	return null;
};

const verifyCode = async (req, res) => {
	const { phone, code } = req.body;

	try {
		if (phone.length !== PHONE_LENGTH) {
			throw 'Invalid phone number';
		}
		if (!phone) {
			throw 'Missing phone number';
		}
		if (!code) {
			throw 'Missing code';
		}
		const result = await client.verify
			.services(SER_SID)
			.verificationChecks.create({ to: phone, code: code });

		return res.json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.json({
			success: false,
			data: error,
		});
	}

	return null;
};

const twilioController = {
	getSMSCode,
	verifyCode,
};

export default twilioController;
