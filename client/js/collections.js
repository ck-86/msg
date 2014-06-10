/*----------------------------------------/
	Message Collection
/-----------------------------------------*/
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

	fetchMessages : function(){
		var inboxQuery = new Built.Query('message_test');
		inboxQuery.descending('created_at');
		inboxQuery.exec().then( function(allMessages) {
			_.each(allMessages, function(singleMessage) {
				//console.log(singleMessage.toJSON());
				messages.add( singleMessage.toJSON() );
			});
		});
	},

	url : 'https://api.built.io/v1/classes/message_test/objects/'
});