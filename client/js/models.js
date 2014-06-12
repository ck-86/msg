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