import React, { Component } from 'react';

const musicAppDataUrl = process.env.REACT_APP_MUSIC_APP_DATA_URL;
//const musicAppDataUrl = 'http://10.0.0.128:80/musicApp/server/';

class settings extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: localStorage.getItem('userLoggedIn'),
			userDetails: []
		}
	}

	componentWillMount() {
		this.getUserDetails();
	}

	getUserDetails() {
		let thisVar = this;
		let url = `${musicAppDataUrl}getUserDetails.php`;
		this.fetch(url).then(function(response) {
			thisVar.setState({
	  			userDetails: response
	  		});
		})
	}

	goToUpdateDetails() {
		this.props.history.push('/home/settings/updatedetails');
	}

	goToLogout() {
		sessionStorage.clear();
		localStorage.clear();
		this.props.history.push('/register');
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
      		return JSON.parse(response);
      	})
      	.catch((error) => console.log("an error occurred", error));
	}

	render() {
		return (
			<div className="entityInfo">
				<div className="centerSection">
					<div className="userInfo">
						<h1>{this.state.userDetails.name}</h1>
					</div>
				</div>
				<div className="buttonItems">
					<button className="button" onClick={() => this.goToUpdateDetails()}>USER DETAILS</button>
					<button className="button" onClick={() => this.goToLogout()}>LOGOUT</button>
				</div>
			</div>
		)
	}
}

export default settings;