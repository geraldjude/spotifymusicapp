import React, { Component } from 'react';

let playlistName = '';
let data = {};

class Yourmusic extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			myPlaylists: []
		}
	}

	componentWillMount() {
		this.showMyPlaylists();
	}

	showMyPlaylists() {
		let thisVar = this;
		let url = `https://api.spotify.com/v1/me/playlists`;
		let method = 'GET';
		this.fetch(url, method).then(function(response) { 
			let items = response.items.reverse();
			thisVar.setState({
	  			myPlaylists: items
	  		});
		})
	}

	createPlaylist() {
		let thisVar = this;
		let user_id = 'wsv1w4yi9ehrneg0i358liouv';
		playlistName = prompt("Please enter the name of your playlist");
		let url = `https://api.spotify.com/v1/users/${user_id}/playlists`;
		let method = 'POST';
		data =	{
				"name": playlistName, 
				"public":true
				};
		if(playlistName != null) {
			this.fetch(url, method).then(function(response) { 
				thisVar.showMyPlaylists();
			})
		}
	}

	displayPlaylist(myPlaylist) {
		this.props.displayPlaylist(myPlaylist, true);
	}

	fetch(url, method){
		if(method === 'POST') {
		return fetch(url, {
        	method: method,
        	headers: {
          	'Accept': 'text/plain',
          	'Content-Type': 'application/json',
          	'Authorization': `Bearer ${sessionStorage.getItem('spotifyToken')}`,
        },
        body: JSON.stringify(data)
      	})
      	.then((res) => res.text())
      	.then((response) => {
      		return JSON.parse(response);
      	})
      	.catch((error) => console.log("an error occurred", error));
      }
      else{
      	return fetch(url, {
        	method: method,
        	headers: {
          	'Accept': 'text/plain',
          	'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          	'Authorization': `Bearer ${sessionStorage.getItem('spotifyToken')}`
        },
  		//body: JSON.stringify(data)
      	})
      	.then((res) => res.text())
      	.then((response) => {
      		return JSON.parse(response);
      	})
      	.catch((error) => console.log("an error occurred", error));
      }
	}

	render() {
		return (
				<div className="playlistsContainer">
					<div className="gridViewContainer">
						<h2>MY PLAYLISTS</h2>
						<div className="buttonItems">
							<button className="button green" onClick={() => this.createPlaylist()}>NEW PLAYLIST</button>
						</div>
						{
							this.state.myPlaylists ?
								this.state.myPlaylists.map((myPlaylist,i) => {
									return (<div key={i} className='gridViewItem' onClick={() => this.displayPlaylist(myPlaylist)}>
												<div className='playlistImage'>
													<img alt="Playlist" src={require('../../assets/images/icons/playlist.png')}/>
												</div>
												<div className='gridViewInfo'>{myPlaylist.name}</div>
											</div>)}):
											(<span class='noResults'>You don't have any playlists yet.</span>)
						}
					</div>
				</div>
			)
		}
	}

export default Yourmusic;