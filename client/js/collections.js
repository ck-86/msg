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

	fetchMessages : function(){
		var inboxQuery = new Built.Query('message');
		inboxQuery.descending('created_at');
		inboxQuery.exec().then( function(allMessages) {
			_.each(allMessages, function(singleMessage) {
				messages.add( singleMessage.toJSON() ); // messages is instance of Messages Collection
			});
		});
	},

	url : 'https://api.built.io/v1/classes/message_test/objects/'
});


/*-------------------------------------------------------------/
| Users Collection
|--------------------------------------------------------------/
| 
*/
var Users = Backbone.Collection.extend({
	fetchUsers: function(){
		var userQuery = new Built.Query('built_io_application_user');
			userQuery.where('active', true);
			userQuery.ascending('email');
		userQuery.exec().then( function(allUsers){
			_.each(allUsers, function(singleUser){
				users.add( singleUser.toJSON() );
			});
		}).then( function(){
			var recipientControlView = new RecipientControlView;
			$('#recipient').html(recipientControlView.render().el);
			$(".chosen-select").chosen();
		} );
	}
});