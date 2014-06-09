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

appRouter.on('route:defaultRoute', function() {
	document.title = "Home Page";
});

appRouter.on('route:composeRoute', function() {
	document.title = "Compose New Message"
});

appRouter.on('route:inboxRoute', function() {
	document.title = "Inbox";
});

appRouter.on('route:notFound', function() {
	document.title = "404 - Page Not Found";
});

Backbone.history.start();