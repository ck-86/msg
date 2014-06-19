/*-------------------------------------------------------------/
| Messages Collection
|--------------------------------------------------------------/
| 
*/
var Messages = Backbone.Collection.extend({
	initialize: function(){
		/*----------------------------------------/
			jQuery AJAX used for setting headers
		/-----------------------------------------*/
		$.ajaxSetup({
		    headers: {
		        'application_api_key': 'bltfec4086e0f10d942',
		        'application_uid': 'message',
		        'content-type': 'application/json'
		    }
		});
	},

	url : 'https://api.built.io/v1/classes/message/objects/',

	fetchMessages : function(callback){

		var messages = new Messages; //Init in local scope
		var inboxQuery = new Built.Query('message');
		inboxQuery.where('message_recipient_uid',Built.User.getSession().uid);
		inboxQuery.include('message_creator_uid');
		inboxQuery.descending('created_at');
		inboxQuery.exec().then( function(allMessages) {
			_.each(allMessages, function(singleMessage) {
				messages.add( singleMessage.toJSON() ); // messages is instance of Messages Collection
			});
		}).then( function(){
				callback.onSuccess(messages);
		});
	}
});