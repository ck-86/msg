/*-------------------------------------------/
	Validating `user` object and registering
/--------------------------------------------*/

Built.User.validate = function (user, callback) {
	if(!user.first_name) {
		callback.onError("First name is required.");
	} else if(!user.last_name) {
		callback.onError("Last name is required.");
	} else if(!user.email){
		callback.onError("Email is required.");
	} else if(!user.password) {
		callback.onError("Password is required.");
	} else if(!user.password_confirmation) {
		callback.onError("Confirm password field is empty.");
	} else if ( !( user.password === user.password_confirmation) ){
		callback.onError("Password and Confirm Password are different.");
	} else {
		callback.onSuccess(user,"User is valid.");
	}
};

/*----------------------------------------/
	Template Helper Function
/-----------------------------------------*/
var getTemplate = function(id) {
	return _.template( $('#' + id).html());
};

// Clear Main Section
var clearMain = function(){ $('.main').html(''); };


/*-------------------------------------------------------------/
| Show Progress Bar
|--------------------------------------------------------------/
| This will display Simple Pre-loader
*/
var showProgressbar = function(){

	var progressbar = '<div class="progress progress-striped notification active"> \
			<div class="progress-bar progress-bar-success"  role="progressbar" \
			aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">\
			<span class="sr-only">Loading...</span></div></div>';

	return progressbar;
};

/*-------------------------------------------------------------/
| Redirect Invalid User
|--------------------------------------------------------------/
| this will check user using Built.User.isAuthenticated()
*/
var validateUserSession = function(){
	Built.initialize('bltfec4086e0f10d942','message');
	//**** Check User Session ****//
	if( !Built.User.getSession() ) {
		Backbone.history.navigate("#/");
	} else {
		/*--------------------------------------------------------------/
			When session is available and user comes to home page then,
			he will be redirected to 'inbox' route
		/--------------------------------------------------------------*/
		if( (Backbone.history.fragment==="") ){
			Backbone.history.navigate("#/inbox");
		}
	}
};


/*---------------------------------------------------------------------/
| logoutUser function
|----------------------------------------------------------------------/
| This will clear user session if available and shows logged out message
*/
var logoutUser = function() {
	Built.initialize('bltfec4086e0f10d942','message');
	if( Built.User.getSession() ){
		Built.User.clearSession();	
	} else {
		//If No Session then redirect to home page
		Backbone.history.navigate("#/");
	}
};

/*-------------------------------------------------------------/
| Show Recipient Select Box
|--------------------------------------------------------------/
| 'To' Box
*/
var showRecipientSelectBox = function(){
	window.recipientControlView = new RecipientControlView;
	$('#recipient').html(recipientControlView.render().el);
	$(".chosen-select").chosen();
	$(".chosen-select").trigger("chosen-updated");
};

/*-------------------------------------------------------------/
| Check User In Array
|--------------------------------------------------------------/
| Checks Duplicate Users In Array
*/
var checkUserInArray = function(comparer){
  for(var i in usersArray){
    if(comparer[0] === usersArray[i][0]){
      return true; 
    }
  }
  return false;
};