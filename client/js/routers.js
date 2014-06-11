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
	document.title = "Test";
	clearMain();

		//Get all users for email list
		window.users = new Users;
		users.fetchUsers();

	var logoutButton = new LogoutButtonView;
	$('.menu-button').html( logoutButton.render().el );

	var sidebarView = new SidebarView;
	$('.main').append(sidebarView.render().el);

	var composeView = new ComposeView;
	$('.main').append(composeView.render().el);


	
});


/*----------------------------------------/
	Inbox Route
/-----------------------------------------*/
appRouter.on('route:inboxRoute', function() {
	validateUserSession();
	clearMain();
	document.title = "Inbox";

		//pre-fetch all the messages
		window.messages = new Messages; // Collection
		messages.fetchMessages();

	var logoutButton = new LogoutButtonView;
	$('.menu-button').html( logoutButton.render().el );

	var sidebarView = new SidebarView;
	$('.main').append(sidebarView.render().el);

	var inboxView = new InboxView;
	$('.main').append(inboxView.render().el);
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