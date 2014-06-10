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
		"*notFound" : "notFound" //404
	}
});

var appRouter = new AppRouter;

/*----------------------------------------/
	Home Route
/-----------------------------------------*/
appRouter.on('route:defaultRoute', function() {
	document.title = "Home Page";
	clearMain();

	var signupView = new SignupView;
	$('.main').append( signupView.render().el );

	var loginView = new LoginView;
	$('.main').append( loginView.render().el );
});

/*----------------------------------------/
	Compose Mail Route
/-----------------------------------------*/
appRouter.on('route:composeRoute', function() {
	document.title = "Compose New Message"
	clearMain();

	if(Built.User.getSession){
		console.log('Session is available...');
		//console.log( (Built.getHeaders().authtoken) );

		if(!Built.getHeaders().authtoken){
			console.log('authtoken missing.');
			console.log('re-initialize authtoken.');
		}
	}

	// if( !Built.User.getSession() ){
	// 	Backbone.history.navigate("#/");
	// }
});


/*----------------------------------------/
	Inbox Route
/-----------------------------------------*/
appRouter.on('route:inboxRoute', function() {
	document.title = "Inbox";
	clearMain();
	redirectInvalidUser();
});

/*----------------------------------------/
	404 Route
/-----------------------------------------*/
appRouter.on('route:notFound', function() {
	document.title = "404 - Page Not Found";
	clearMain();
});

Backbone.history.start();