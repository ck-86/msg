/*-------------------------------------------------------------/
| Application Routes 
|--------------------------------------------------------------/
| 
*/

var AppRouter = Backbone.Router.extend({
	routes : {
		"" : "defaultRoute", // Login-Page is our default Route
		"compose" : "composeRoute",
		"inbox" : "inboxRoute",
		"inbox/:uid" : "viewMailRoute",
		"logout" : "logoutRoute",
		"test" : "testRoute",
		"*notFound" : "notFound" //404
	}
});

var appRouter = new AppRouter;

/*----------------------------------------/
	Home Route
/-----------------------------------------*/
appRouter.on('route:defaultRoute', function() {
	validateUserSession();
	clearMain();
	document.title = "Home Page";
	var signupView = new SignupView;
	$('.main').append( signupView.render().el );

	var loginView = new LoginView;
	$('.main').append( loginView.render().el );

	$('.menu-button').html(''); //Clear logout button

});

/*----------------------------------------/
	Compose Mail Route
/-----------------------------------------*/
appRouter.on('route:composeRoute', function() {
	validateUserSession();
	document.title = "Compose";
	clearMain();

		//Get all users for email list
		//users.fetchUsers();
		window.usersArray = []; //Setting Global User Array

	var logoutButton = new LogoutButtonView;
	$('.menu-button').html( logoutButton.render().el );

	var sidebarView = new SidebarView;
	$('.main').append(sidebarView.render().el);

	var composeView = new ComposeView;
	$('.main').append(composeView.render().el);

	showRecipientSelectBox();
});


/*----------------------------------------/
	Inbox Route
/-----------------------------------------*/
appRouter.on('route:inboxRoute', function() {
	validateUserSession();
	clearMain();
	document.title = "Inbox";

	var logoutButton = new LogoutButtonView;
	$('.menu-button').html( logoutButton.render().el );

	var sidebarView = new SidebarView;
	$('.main').append(sidebarView.render().el);

		// Init 'messages' collection
		var messages = new Messages;
		/*----------------------------------------------------------------/
			Fetch Message and 'onSuccess' show inboxView
			NOTE : 'response' param is required in 'onSuccess' function
		/----------------------------------------------------------------*/
		messages.fetchMessages({ onSuccess: function(response){
			inboxView = new InboxView({ collection:response });
			$('.main').append(inboxView.render().el);
			}
		});
});

/*----------------------------------------/
	Email Read View
/-----------------------------------------*/

appRouter.on('route:viewMailRoute', function(uid){
	validateUserSession();
	clearMain();
	document.title = "Reading Email";

	var logoutButton = new LogoutButtonView;
	$('.menu-button').html( logoutButton.render().el );

	var sidebarView = new SidebarView;
	$('.main').append(sidebarView.render().el);

	//var readView = new ReadView;
	//$('.main').append( readView.render().el );

	var message = new Message;
	message.fetchMessage( uid, function(msg){
		var readView = new ReadView({model:msg});
		$('.main').append( readView.render().el );
	});
});

/*----------------------------------------/
	Logout Route
/-----------------------------------------*/
appRouter.on('route:logoutRoute',function(){
	logoutUser();
	clearMain();
	document.title = "Logout";
	$('.main').html('You have been logged out.<a href="/#">Click Here To Login.</a>');

	$('.menu-button').html('');
});

/*----------------------------------------/
	404 Route
/-----------------------------------------*/
appRouter.on('route:notFound', function() {
	validateUserSession();
	clearMain();
	document.title = "404 - Page Not Found";

	$('.main').html('<h3>Page Not Found.</h3>');
});


/*----------------------------------------/
	Test Route
/-----------------------------------------*/
appRouter.on('route:testRoute',function(){
	validateUserSession();
	document.title = "Test";
	clearMain();

	var logoutButton = new LogoutButtonView;
	$('.menu-button').html( logoutButton.render().el );

	var sidebarView = new SidebarView;
	$('.main').append(sidebarView.render().el);

	var composeView = new ComposeView;
	$('.main').append(composeView.render().el);

});

Backbone.history.start();