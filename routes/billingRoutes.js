const keys = require('../config/.keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

const ObjectID = require('mongodb').ObjectID;

module.exports = app => {
	app.post('/api/stripe', requireLogin, async (req, res) => {

		const charge = await stripe.charges.create({
			amount: 500,
			currency: 'usd',
			description: '$5 for 5 credits at Emaily',
			source: req.body.id
		});

		const db = req.app.locals.db;
		//req.user holds user data because of passport.initialize call
		db.collection('users').findOneAndUpdate(
			{ _id: ObjectID(req.user._id)},
			{ $inc: { credits: 5} })
		.then(documents => {
			console.log(`user ${req.user.userEmail} bought 5 credits`);
			documents.value.credits += 5;
			res.send(documents.value)
		})
		.catch(err => console.log(err.stack));
	});
};