// Using built fucn to extend class
var Message = Built.Object.extend("message_test");

Message.prototype.saveMessage = function(model) {
	var message = new Message;
	console.log( JSON.stringify(model) );
	message.set(model);
	message.save().then( function(response) {
		model.id = response.uid;
		messages.push(message);
	});
};

Message.prototype.deleteMessage = function() {
	console.log( this.get('uid') );
};