/*-------------------------------------------------------------/
| Message
|--------------------------------------------------------------/
| Using built object to extend class 
*/
var Message = Built.Object.extend("message");

/*--------------------------------------------/
	create() - save on DB and in Collection
/---------------------------------------------*/
Message.prototype.create = function(model) {
	var message = new Message;
	console.log( JSON.stringify(model) );
	message.set(model);
	message.save().then( function(response) {
		//unshift will at element at 0 index
		messages.unshift( message.toJSON() );
	});
};

/*----------------------------------------/
	Read Mail
/-----------------------------------------*/
Message.prototype.fetchMessage = function(message_uid, callback) {

	var msg = new Message;
	var testdata = null;

	var messageQuery = new Built.Query('message');
	messageQuery.where('uid', message_uid);
	messageQuery.include('message_creator_uid');
	messageQuery.include('message_recipient_uid');
	messageQuery.exec().then( function(response){
		_.each(response, function(message){
			//console.log(message);
			testdata = message;
		});
	}).then( function(){
		callback(testdata);
	});
}