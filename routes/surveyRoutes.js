const ObjectID = require('mongodb').ObjectID;

// const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const { host } = require('../config/.keys');

module.exports = app => {
	app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
		const { title, subject, body, recipients } = req.body;

		const recipientsArray = recipients.split(',');

		const db = req.app.locals.db;

		const survey = {
			title, subject, body,
			recipients: recipientsArray.map(email => ({
				email: email.trim(),
				responded: false,
				timeResponded: null,
			})),
			yesCount: 0,
			noCount: 0,
			_user: ObjectID(req.user._id),
			dateSent: null,
			lastResponded: null
		}

		// const mailer = new Mailer(survey, surveyTemplate);

		try {
			// await mailer.send();
			await db.collection('surveys').insertOne(survey);

			req.user.credits-=1;

			db.collection('users').findOneAndUpdate(
				{ _id: ObjectID(req.user._id)},
				{ $inc: { credits: -1} })
			.then(documents => {
				console.log(`user ${req.user.userEmail} spent 1 credit`);
				res.send(documents.value)
			})
			.catch(err => console.log(err.stack));
		} catch (err) {
			res.status(422).send(err);
		}
	});
};