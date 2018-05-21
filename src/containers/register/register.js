import React, { Component } from 'react';
import '../../assets/css/register.css';

const musicAppDataUrl = process.env.REACT_APP_MUSIC_APP_DATA_URL;
//const musicAppDataUrl = 'http://172.16.1.43:80/musicApp/server/';
//const musicAppDataUrl = 'http://10.0.0.128:80/musicApp/server/';

class Register extends Component {
	constructor(props){
		super(props);

		this.state = {
			displayLogin: '',
			displayRegister: 'none',
			loginUserName: '',
			loginPassword: '',
			username: '',
			firstName: '',
			lastName: '',
			email: '',
			email2: '',
			password: '',
			password2: '',
			usernameError: '',
			firstNameError: '',
			lastNameError: '',
			emailError: '',
			passwordError: '',
			loginUsernameError: ''
		}

		console.log(musicAppDataUrl);
	};

	componentDidMount() {
		sessionStorage.setItem('spotifyToken', window.location.hash.substring(14,window.location.hash.indexOf('&t')));
		sessionStorage.setItem('loggedin',true);
	}

	loginSubmit = (e) => {
		e.preventDefault();
		this.signIn();
	}

	handleLoginUserNameChange = (e) => {
		this.setState({
			loginUserName: e.target.value
		},function() {
			localStorage.setItem('userLoggedIn', this.state.loginUserName);
		})

	}

	handleLoginPasswordChange = (e) => {
		this.setState({
			loginPassword: e.target.value
		})
	}

	registerSubmit = (e) => {
		e.preventDefault();
		this.validateUserName(this.state.username);
		this.validateFirstName(this.state.firstName);
		this.validateLastName(this.state.lastName);
		this.validateEmails(this.state.email,this.state.email2);
		this.validatePasswords(this.state.password,this.state.password2);
		this.signUp();
	}

	handleUserNameChange = (e) => {
		this.setState({
				username: e.target.value
		})
	}

	handleFirstNameChange = (e) => {
		this.setState({
				firstName: e.target.value
		})
	}

	handleLastNameChange = (e) => {
		this.setState({
				lastName: e.target.value
		})
	}

	handleEmailChange = (e) => {
		this.setState({
				email: e.target.value
		})
	}

	handleEmail2Change = (e) => {
		this.setState({
				email2: e.target.value
		})
	}

	handlePasswordChange = (e) => {
		this.setState({
				password: e.target.value
		})
	}

	handlePassword2Change = (e) => {
		this.setState({
				password2: e.target.value
		})
	}

	validateUserName(username){
		if(username.length > 25 || username.length < 5){
			this.setState({
				usernameError: 'Your username must be between 5 and 25 characters'
			});
			return;
		}
		else{
			this.setState({
				usernameError: ''
			});
		}
	}

	validateFirstName(firstName){
		if(firstName.length > 25 || firstName.length < 2){
			this.setState({
				firstNameError: 'Your first name must be between 2 and 25 characters'
			});
			return;
		}
		else{
			this.setState({
				firstNameError: ''
			});
		}
	}

	validateLastName(lastName){
		if(lastName.length > 25 || lastName.length < 2){
			this.setState({
				lastNameError: 'Your last name must be between 2 and 25 characters'
			});
			return;
		}
		else{
			this.setState({
				lastNameError: ''
			});
		}
	}

	validateEmails(email, email2){
		if(email !== email2){
			this.setState({
				emailError: "Your emails don't match"
			});
			return;
		}
		else{
			this.setState({
				emailError: ''
			})
		}
		let emRegex = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
		if (!emRegex.test(email)){
		    this.setState({
				emailError: 'Email is invalid'
			});
			return;
		}
		else{
			this.setState({
				emailError: ""
			})
		}
	}

	validatePasswords(password, password2){
		if(password !== password2){
			this.setState({
				passwordError: "Your passwords don't match"
			});
			return;
		}
		else{
			this.setState({
				passwordError: ''
			})
		}
		let passRegex = /[^A-Za-z0-9]/;
		if(passRegex.test(password)){
			this.setState({
				passwordError: "Your password can only contain numbers and letters"
			});
			return;
		}
		else{
			this.setState({
				passwordError: ''
			})
		}

		if(password.length > 30 || password.length < 5){
			this.setState({
				passwordError: 'Your password must be between 5 and 30 characters'
			});
			return;
		}
		else{
			this.setState({
				passwordError: ''
			})
		}
	}

	hideLogin(displayLogin,displayRegister){
		this.setState({
				displayLogin: displayLogin ? '' : 'none',
				displayRegister: ''
		});
	}

	hideRegister(displayLogin,displayRegister){
		console.log(this.state.displayRegister);
		this.setState({
				displayRegister: displayRegister ? '' : 'none',
				displayLogin: ''
		})
	}

	signIn() {
		let response;

    	response = this.fetch(`${musicAppDataUrl}handle_signin.php`);

      	if(response === 'failed'){
      		this.setState({
      			loginUsernameError: 'Your username or password was incorrect'
      		})
    	}
    	else{
      		this.props.history.push('/home');
      		//save logged in variable in async storage
    	}
  	}

  	signUp() {
  		let response;
  		response = this.fetch(`${musicAppDataUrl}handle_signup.php`);

  		if(response === 'Not successful'){
      		alert("User registration not successful");
    	}
    	else{
      		this.props.history.push('/home');
      		//save logged in variable in async storage
    	}	
  	}

  	fetch(url) {
  		fetch(url, {
        	method: 'POST',
        	headers: {
          	'Accept': 'text/plain',
          	'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: JSON.stringify(this.state),
      	})
      	.then((res) => res.text())
      	.then((response) => {
        	return response;
      	})
      	.catch((error) => console.log("an error occurred", error));
  	}

	render() {
		return (
			<div id="background">
				<div id="loginContainer">
					<div id="inputContainer">
						<form id="loginForm" style={{'display' : this.state.displayLogin}} onSubmit={this.loginSubmit}>
							<h2>Login to your account</h2>
							<p>
								<span className='errorMessage'>{this.state.loginUsernameError}</span>
								<label htmlFor="loginUsername">Username</label>
								<input id="loginUsername" name="loginUsername" type="text" placeholder="e.g. bartSimpson" value={this.state.loginUserName} onChange={this.handleLoginUserNameChange} required/>
							</p>
							<p>
								<label htmlFor="loginPassword">Password</label>
								<input id="loginPassword" name="loginPassword" type="password" placeholder="Your password" value={this.state.loginPassword} onChange={this.handleLoginPasswordChange}  required/>
							</p>

							<button type="submit" name="loginButton">LOG IN</button>

							<div className="hasAccountText">
								<span id="hideLogin" onClick={() => this.hideLogin(this.state.displayLogin,this.state.displayRegister)}>Don't have an account yet? Signup here.</span>
							</div>	
						</form>

						<form id="registerForm" style={{'display': this.state.displayRegister}} onSubmit={this.registerSubmit}>
							<h2>Create your free account</h2>
							<p>
								<span className='errorMessage'>{this.state.usernameError}</span>
								<label htmlFor="username">Username</label>
								<input id="username" name="username" type="text" placeholder="e.g. bartSimpson" value={this.state.username} onChange={this.handleUserNameChange} required/>
							</p>

							<p>
								<span className='errorMessage'>{this.state.firstNameError}</span>
								<label htmlFor="firstName">First name</label>
								<input id="firstName" name="firstName" type="text" placeholder="e.g. Bart" value={this.state.firstName} onChange={this.handleFirstNameChange} required/>
							</p>

							<p>
								<span className='errorMessage'>{this.state.lastNameError}</span>
								<label htmlFor="lastName">Last name</label>
								<input id="lastName" name="lastName" type="text" placeholder="e.g. Simpson" value={this.state.lastName} onChange={this.handleLastNameChange} required/>
							</p>

							<p>
								<span className='errorMessage'>{this.state.emailError}</span>
								<label htmlFor="email">Email</label>
								<input id="email" name="email" type="email" placeholder="e.g. bart@gmail.com" value={this.state.email} onChange={this.handleEmailChange} required/>
							</p>

							<p>
								<label htmlFor="email2">Confirm email</label>
								<input id="email2" name="email2" type="email" placeholder="e.g. bart@gmail.com" value={this.state.email2}  onChange={this.handleEmail2Change} required/>
							</p>

							<p>
								<span className='errorMessage'>{this.state.passwordError}</span>
								<label htmlFor="password">Password</label>
								<input id="password" name="password" type="password" placeholder={this.state.password} onChange={this.handlePasswordChange} required/>
							</p>

							<p>
								<label htmlFor="password2">Confirm password</label>
								<input id="password2" name="password2" type="password" placeholder={this.state.password2} onChange={this.handlePassword2Change} required/>
							</p>

							<button type="submit" name="registerButton">SIGN UP</button>

							<div className="hasAccountText">
								<span id="hideRegister" onClick={() => this.hideRegister(this.state.displayLogin,this.state.displayRegister)}>Already have an account? Log in here.</span>
							</div>
						</form>
					</div>
					<div id="loginText">
						<h1>Get great music, right now</h1>
						<h2>Listen to loads of songs for free</h2>
						<ul>
							<li>Discover music you'll fall in love with</li>
							<li>Create your own playlist</li>
							<li>Follow artists to keep up to date</li>
						</ul>
					</div>
				</div>
			</div>
		)
	}
}

export default Register;