import React, { Component } from 'react';

const musicAppDataUrl = process.env.REACT_APP_MUSIC_APP_DATA_URL;
//const musicAppDataUrl = 'http://10.0.0.128:80/musicApp/server/';

class UpdateDetails extends Component {
	constructor(props) {
		super(props);

		this.state = {
			emailMessage: '',
			passwordMessage: '',
			username: localStorage.getItem('userLoggedIn'),
			email: '',
			oldPassoword: '',
			newPassword: '',
			confirmPassword: ''
		}
	}

	updateEmail() {
		let thisVar = this;
			let url = `${musicAppDataUrl}updateEmail.php`;
			this.fetch(url).then(function(response) {
				thisVar.setState({
		  			emailMessage: response
		  		});
			})
	}

	updatePassword() {
		let thisVar = this;
			let url = `${musicAppDataUrl}updatePassword.php`;
			this.fetch(url).then(function(response) {
				thisVar.setState({
		  			passwordMessage: response
		  		});
			})
	}

	handleEmailChange(e) {
		this.setState({
			email: e.target.value
		})
	}

	handleOldPasswordChange(e) {
		this.setState({
			oldPassword: e.target.value
		})
	}

	handleNewPasswordChange(e) {
		this.setState({
			newPassword: e.target.value
		})
	}

	handleConfirmPaswordChange(e) {
		this.setState({
			confirmPassword: e.target.value
		})
	}

	fetch(url){
		return fetch(url, {
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
			<div className="userDetails">
				<div className="container borderBottom">
					<h2>EMAIL</h2>
					<input type="text" className="email" name="email" placeholder="Email address..." value={this.state.email} onChange={(e) => this.handleEmailChange(e)}/>
					<span className="message">{this.state.emailMessage}</span>
					<button className="button" onClick={() => this.updateEmail()}>SAVE</button>
				</div>
				<div className="container">
					<h2>PASSWORD</h2>
					<input type="password" className="oldPassword" name="oldPassword" placeholder="Current password" onChange={(e) => this.handleOldPasswordChange(e)}/>
					<input type="password" className="newPassword1" name="newPassword1" placeholder="New password" onChange={(e) => this.handleNewPasswordChange(e)}/>
					<input type="password" className="newPassword2" name="newPassword2" placeholder="Confirm password" onChange={(e) => this.handleConfirmPaswordChange(e)}/>
					<span className="message">{this.state.passwordMessage}</span>
					<button className="button" onClick={() => this.updatePassword()}>SAVE</button>
				</div>
			</div>
		)
	}
}

export default UpdateDetails;