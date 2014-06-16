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
			showRecipientSelectBox(); //'to' box
		} );
	}
});

Users.prototype.searchUsers = function(searchTerm) {

	var searchUserQuery = new Built.Query('built_io_application_user');
		searchUserQuery.matches('email', '^' + searchTerm , 'i');
		searchUserQuery.where('active', true);
	searchUserQuery.exec().then( function(allUsers){
		_.each(allUsers, function(singleUser){
			users.add( singleUser.toJSON() );
		});
	}).then( function(){
		
		if(!searchTerm){
			console.log('No Search Term.');
			users.reset(); // Removing Previous Values from Collection
			console.log(users);
			console.log('Empty Select Box');
		} else {
			console.log('Searching : ' + searchTerm);
			reRenderSelectBox(searchTerm);
		}
		
	});
};