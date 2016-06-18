// $(document).ready(function() {

 
// });

//This will check the users cookies and see if they are already set (aka, already looged in)
var AppDisplay = React.createClass({
	getInitialState: function(){
		var cookieCheck;
		if(document.cookie){
			cookieCheck = true;
		} else {
			cookieCheck = '';
		}
		return {
			authenticatedUser: cookieCheck,
		};
	},
	changeLogin: function() {
		this.setState ({
			authenticatedUser: true
		})
	},
	render: function(){
		console.log('authenticatedUser: ', this.state.authenticatedUser);
		console.log('==================================');
		console.log('cookie:', document.cookie);

		if(this.state.authenticatedUser === true) {
			return (
				<div>
					<h1> SUCCESS </h1>
				</div>
				) 
		} else {
			return (
				<div>
  				<LoginForm initalLoginCheck={this.state.authenticatedUser} onChange={this.changeLogin}/>
  				<SignupForm initialCreate={this.state.authenticatedUser} onChange={this.changeLogin}/>
				</div>
			)
		}
	}
});


var LoginForm = React.createClass({
	getInitialState: function() {
		// I chose to have the loginform maintain it's own state as it does meaningful things with data
		// For the form purposes: keep track of username, password
		// For invoking the callback prop, set a state for loginStatus. This is the original parent state for this.state.authenticatedUser
		return {
			username: this.props.initialLoginCheck,
			password: this.props.initialLoginCheck,
			loginStatus: this.props.initialLoginCheck
		};
	},

	// This is a cool helper function. On the form, it will update the input values that user's type into the form
	handleLoginFormChange: function(stateName, e) {
		var change = {};
		change[stateName] = e.target.value;
		this.setState(change);
	},

	// So form gets submitted, prevent default, trim, and send the ajaxcall!
	handleSubmit: function(e) {
		e.preventDefault();
		var username = this.state.username.trim();
		var password = this.state.password.trim();
		console.log('username: ' + username);
		console.log('password: ' + password);
		this.loginAJAX(username, password);
	},
	// },
	// AJAX call. straight up jQuery baby!
	loginAJAX: function(username, password) {
    console.log(username);
    console.log(password);
		$.ajax({
			url: "/auth",
			method: "POST",
			data: {
				username: username,
				password: password
			},
			success: function(data) {
				console.log('Cookie Monster');
				Cookies.set('jwt_token', data.token);
				console.log(data);
				// Let's invoke that sweet callback to the parent component
				this.props.onChange(data.token)
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(status, err.toString());
			}.bind(this),
		});
	},

	// Here's my sexy form
	render: function() {
		// console.log(this);
		return (
			<div className="login-form" >
				<h3>Please Login</h3>
				<form onSubmit={this.handleSubmit}>
					<label htmlFor="username">username</label>
					<input className="username-login-form" type="text" value={this.state.username} onChange={this.handleLoginFormChange.bind(this, 'username')}/>
					<br/>
					<label htmlFor="password">Password</label>
					<input className="password-login-form" type="text" value={this.state.password} onChange={this.handleLoginFormChange.bind(this, 'password')}/>
					<br/>
					<input type="submit"/>
				</form>
			</div>
		)
	}
})

var SignupForm = React.createClass({
	getInitialState: function(){
		return {
			firstName: this.props.initialCreate,
			lastName: this.props.initialCreate,	
			username: this.props.initialCreate,
			password: this.props.initialCreate
		};
	},
	handleSignupFormChange: function(setName, e){
		var change = {};
		change[setName] = e.target.value
		this.setState(change);
	},
	handleSubmit: function(e){
		e.preventDefault();
		var firstName = this.state.firstName.trim();
		var lastName = this.state.lastName.trim();
		var username = this.state.username.trim();
		var password = this.state.password.trim();
		this.signupAJAX(firstName, lastName, username, password);
	},
	signupAJAX: function(firstName, lastName, username, password){
		console.log('sending post request');
		$.ajax({
			url:'/users',
			method: 'POST',
			data: {
				firstName: firstName,
				lastName: lastName,
				username: username,
				password: password
			},
			success: function(data){
				console.log("A new user signing up!!");
				Cookies.set('jwt_token', data.token)
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(status, err.toString());
			}.bind(this)
		});
	},
	render: function(){
		return(
			<div className="signup-form">
			<h3> Create An Account </h3>
			<form onSubmit={this.handleSubmit}>
			<label htmlFor="firstName"> First Name </label>
			<input className="first-name-create" type="text" value={this.state.firstName} onChange={this.handleSignupFormChange.bind(this,'firstName')}/>
			<br/>
			<label htmlFor="lastName"> Last Name </label>
			<input className="last-name-create" type="text" value={this.state.lastName} onChange={this.handleSignupFormChange.bind(this,'lastName')}/>
			<br/>
			<label htmlFor="username"> username </label>
			<input className="username-create" type="text" value={this.state.username} onChange={this.handleSignupFormChange.bind(this,'username')}/>
			<br/>
			<label htmlFor="password"> Password </label>
			<input className="password-create" type="text" value={this.state.password} onChange={this.handleSignupFormChange.bind(this,'password')}/>
			<br/>
			<input type="submit"/>
			</form>
			</div>
			)
	}
})

ReactDOM.render(
	<div>
	<AppDisplay/>
	</div>,
	 document.getElementById('container')
	);

