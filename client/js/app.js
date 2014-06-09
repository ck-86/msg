Built.initialize('bltfec4086e0f10d942','message');

//var messages = new Messages;
var messages = [];
var message = new Message;

var saveMessage = function(model) {
	message.set(model);
	message.save().then( function(response){
		message.set('id', response.uid);
		messages.push(message);
	});
};

var deleteMessage = function(collection, index){
	collection[index].destroy();
	collection.splice(index);
}