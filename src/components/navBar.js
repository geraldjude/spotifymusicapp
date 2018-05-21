import React, { Component } from 'react';
//import { Link } from 'react-router-dom';

const musicAppDataUrl = process.env.REACT_APP_MUSIC_APP_DATA_URL;
//const musicAppDataUrl = 'http://10.0.0.128:80/musicApp/server/';

class NavBar extends Component {
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

	goToBrowse() {
		this.props.history.push('/home/browse');
	}

	goToHome() {
		this.props.history.push('/home');
	}

	goToSearch() {
		this.props.history.push('/home/search');
	}

	goToYourMusic() {
		this.props.history.push('/home/yourmusic');
	}

	goToSettings() {
		this.props.history.push('/home/settings');
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
      		console.log(response);
      		return JSON.parse(response);
      	})
      	.catch((error) => console.log("an error occurred", error));
	}

	render() {
		return (
			<nav className="navBar">
				<span className="logo" onClick={() => this.goToHome()}>
					<img alt='logo' src={require('../assets/images/icons/Spotify.png')}/>
				</span>
				<div className="group">
					<div className="navItem">
						<span onClick={() => this.goToSearch()} className="navItemLink">Search
							<img src={require('../assets/images/icons/search.png')} className="icon" alt="Search"/>
						</span>
					</div>
				</div>
				<div className="group">
					<div className="navItem">
						<span onClick={() => this.goToBrowse()} className="navItemLink">Browse</span>
					</div>
					<div className="navItem">
						<span onClick={() => this.goToYourMusic()} className="navItemLink">Your Music</span>
					</div>
					<div className="navItem">
						<span className="navItemLink" onClick={() => this.goToSettings()}>{this.state.userDetails.name}</span>
					</div>
				</div>
			</nav>
		)
	}
}

export default NavBar;