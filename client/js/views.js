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

	tagName:'ul',

	className : 'col-md-6',

	template: getTemplate('inboxTemplate'),

	render: function() {
		this.$el.html( this.template() );
		this.collection.forEach(this.addOne, this);
		return this;
	},

	addOne : function(message){
		var messageInfoView = new MessageInfoView( { model:message } );
		this.$el.append( messageInfoView.render().el );
	}
});

/*----------------------------------------/
	Message View - Items in Inbox
/-----------------------------------------*/
var MessageInfoView = Backbone.View.extend({

	tagName : 'li',

	className: 'message',

	template: getTemplate('messageInfoTemplate'),

	render: function() {
		this.$el.html( this.template( this.model.toJSON()	 ) );
		return this;
	}
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
		'submit' : 'submit'
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
	Recipient Template
/-----------------------------------------*/
var RecipientControlView = Backbone.View.extend({
	template: getTemplate('recipientTemplate'),

	render: function() {
		this.$el.html( this.template( users ) );
		return this;
	}
});