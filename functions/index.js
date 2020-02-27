/* Resources

https://github.com/firebase/functions-samples/tree/master/fcm-notifications

https://firebase.google.com/docs/cloud-messaging/server

https://firebase.google.com/docs/functions/firestore-events

To deploy: (from parent directory)
> firebase deploy --only functions
*/

const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp();

exports.sendNotificationToDevice = functions.firestore
	.document('accounts/{userId}')
	.onUpdate((change, context) => {
		const newValue = change.after.data();
		const uid = context.params.userId;
		const text = newValue.text;
		const registrationToken = newValue.registrationToken;

		var message = {
			notification: {
				title: "New message from laptop!",
				body: text
			},
			//data: {
			//	text: 'this is a test string',
			//	time: '2:45'
			//},
			token: registrationToken
		};

		admin.messaging().send(message)
			.then((response) => {
				console.log('Successfully sent message:', response);
				return 1;
			})
			.catch((error) => {
				console.log('Error sending message:', error);
			});
	});



