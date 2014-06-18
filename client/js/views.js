/*----------------------------------------/
	Logout Button View
/-----------------------------------------*/
var LogoutButtonView = Backbone.View.extend({

	template: getTemplate('loginButtonTemplate'),

	render: function() {
		this.$el.html( this.template( Built.User.getSession() ) );
		return this;
	}
});


/*----------------------------------------/
	Signup View
/-----------------------------------------*/
var SignupView = Backbone.View.extend({
	template: getTemplate('signupTemplate'),
	
	render: function(){
		this.$el.html( this.template() );
		return this;
	},

	events: {
		'submit' : 'submit'
	},

	submit: function(e) {
		e.preventDefault();
		
		//Getting Values from the form
		var user = {
			first_name : $.trim( $('#first_name').val() ),
			last_name : $.trim( $('#last_name').val() ),
			email : $.trim( $('#email').val() ),
			password : $.trim( $('#password').val() ),
			password_confirmation : $.trim( $('#password_confirmation').val() ),
			active : true
		};

		/*-------------------------------------------------------------
			Custom func `validate` - checks the user object values
		-------------------------------------------------------------*/
		Built.User.validate(user, { 
			onSuccess : function(data, res) {
				/*--------------------------------------------
					On Successful validation `register` user
					using `Built.User.register()` method
				--------------------------------------------*/
				Built.User.register(data, {
					onSuccess : function(data, res) {
						// Remove sign-up form
						$(".signup").children().fadeOut();

						var message = "<strong>You have successfully completed registeration.</strong>\
						<p>Please check your email and activate your account.</p>";

						// Show Successful Sign-up message
						$(".signup").html( message );
					},
					onError : function(error) {
						//User registeration error
						if(error.errors.email) {
							alert('Email ' + error.errors.email );
						}

						//If Account is Inactive - code is needed
					}
				})
			},
			onError : function(error) {
				//Validation Error
				alert(error);
			}
		});
	}
});

/*----------------------------------------/
	Login View
/-----------------------------------------*/
var LoginView = Backbone.View.extend({
	template: getTemplate('loginTemplate'),

	render: function(){
		this.$el.html( this.template() );
		return this;
	},

	events: {
		'submit' : 'submit'
	},

	submit: function(e) {
		e.preventDefault();
		var user = {
			email : $.trim( $('#login_email').val() ),
			password : $.trim( $('#login_password').val() ),
		};

		if(user.email && user.password){
			// Show preloader
			$('.login').append( showProgressbar(50) );
		} else {
			alert('Email and Password is required to login.');
		}
		

		Built.User.login(user.email, user.password, {
			onSuccess : function(data, res){
				if(res.status === 200){
					$('.notification').remove();
					Built.User.saveSession(); // Save session in localStorage
					Backbone.history.navigate("#/inbox");
				}
			},

			onError : function(error) {
				$('.notification').remove();
				alert(error.errors.errors[0]);
			}
		});
	}
});


/*----------------------------------------/
	Sidebar View
/-----------------------------------------*/
var SidebarView = Backbone.View.extend({
	template: getTemplate('sidebarTemplate'),

	render: function() {
		this.$el.html( this.template() );
		return this;
	}
});

/*----------------------------------------/
	Inbox View
/-----------------------------------------*/
var InboxView = Backbone.View.extend({

	initialize: function(){
		//console.log(this.collection);
		this.collection.on('destroy', this.isInboxEmpty, this);
	},

	tagName:'ul',

	className : 'col-md-6 inbox',

	template: getTemplate('inboxTemplate'),

	render: function() {
		this.$el.html( this.template() );

		this.isInboxEmpty();

		this.collection.forEach(this.addOne, this);
		return this;
	},

	addOne : function(message){
		var messageInfoView = new MessageInfoView( { model:message } );
		this.$el.append( messageInfoView.render().el );
	},

	isInboxEmpty: function(){
		if(this.collection.length === 0){
			console.log(this.$el.html('<p class="inbox_empty_message">Inbox is empty.</p>'));
		}
	}
});

/*----------------------------------------/
	Message View - Items in Inbox
/-----------------------------------------*/
var MessageInfoView = Backbone.View.extend({

	tagName : 'li',

	className: 'message',

	template: getTemplate('messageInfoTemplate'),

	events : {
		'click .delete_message' : 'deleteMessage'
	},

	render: function() {
		this.$el.html( this.template( this.model.toJSON() ) );
		return this;
	},

	deleteMessage : function(e){
		e.preventDefault;
		var thatModel = this;

		//First Destroy Element on Built and then on 
		this.model.destroy({
			success: function(){
				thatModel.$el.slideUp( function(){
				thatModel.$el.remove();
			})}
		});
	},
});


/*----------------------------------------/
	Compose View
/-----------------------------------------*/
var ComposeView = Backbone.View.extend({
	template: getTemplate('composeTemplate'),

	render: function() {
		this.$el.html( this.template() );
		return this;
	},

	events : {
		'submit' : 'submit',

	},

	submit: function(e){
		e.preventDefault();
		var messageObject = {
			// creator_uid is require, need to specify in array for Built Include to work.
			'message_creator_uid' : Array(Built.User.getSession().uid), 
			'message_body' : $('#message_body').val(),
			'message_subject' : $('#message_subject').val(),
			'message_recipient_uid' : $('#message_recipient_uid').val()
		};
		
		var message = new Message;
		message.set(messageObject); // Setting Value
		message.save({
			onSuccess : function(data) {
				alert('1 Message Sent.');
				$('#message_body').val('');
				$('#message_subject').val('');
				showRecipientSelectBox();
			},
			onError : function(error) {
				console.log(error);
			}
		});
	}
});

/*----------------------------------------/
	Email Read Template
/-----------------------------------------*/
var ReadView = Backbone.View.extend({

	initialize: function(){
		console.log(this.model.toJSON());
	},

	template: getTemplate('readTemplate'),

	render: function() {
		this.$el.html( this.template( this.model.toJSON() ) );
		return this;
	}
});

/*----------------------------------------/
	Recipient Template
/-----------------------------------------*/
var RecipientControlView = Backbone.View.extend({

	events : {
		'keyup .search-field > input' : 'updateChosen',

	},

	template: getTemplate('recipientTemplate'),

	render: function() {
		this.$el.html( this.template( ) );
		return this;
	},

	updateChosen : function(){
		var that = this;

		var searchInput = $('.search-field > input').val();

		if(searchInput.length > 1){
			console.log(searchInput);
			var searchUserQuery = new Built.Query('built_io_application_user');
				searchUserQuery.matches('email', '^' + searchInput, 'i' );
				searchUserQuery.where('active', true);
			searchUserQuery.exec().then( function(allUsers){
				_.each(allUsers, function(singleUser){

					//create Array for new user
					var newUser = [singleUser.get('uid'), singleUser.get('email')];
					
					//check is user already present
					var isUserPresent = checkUserInArray(newUser); // isUserPresent = TRUE when Duplicate value is found
					
					//if not present - create an Option Tag and Add into Select Tag
					if(!isUserPresent) {
						usersArray.push(newUser);
						window.newOption = '<option value="' + singleUser.get('uid') + '">' + singleUser.get('email') +'</option>';
						$(".chosen-select").append(newOption);
					} 
				});

				$("#message_recipient_uid").trigger("chosen:updated");
			});
		}
	}
});