import React, { Component } from 'react';

class Browse extends Component {
	constructor(props) {
		super(props);

		this.state = {
			categories: []
		}
	}

	componentWillMount() {
		this.getCategories();
	}

	getCategories() {
		let thisVar = this;
		let url = 'https://api.spotify.com/v1/browse/categories?country=AU'
		this.fetch(url).then(function(response) {
			thisVar.setState({
	  			categories: response.categories.items
	  		});
		})
	}

	getPlaylists(categoryId, categoryName) {
		let thisVar = this;
		this.fetch(`https://api.spotify.com/v1/browse/categories/${categoryId}/playlists`).then(function(response) {
			/*thisVar.setState({
	  			tracks: response.items
	  		});*/
	  		thisVar.displayPlaylists(response.playlists.items, categoryName);
		})
	}

	displayPlaylists(playlists, categoryName) {
		this.props.displayPlaylists(playlists, categoryName);
	}

	fetch(url){
		return fetch(url, {
        	method: 'GET',
        	headers: {
          	'Accept': 'text/plain',
          	'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          	'Authorization': `Bearer ${sessionStorage.getItem('spotifyToken')}`
        },
        //body: JSON.stringify(this.state),
      	})
      	.then((res) => res.text())
      	.then((response) => {
      		//console.log(JSON.parse(response).categories.items);
      		return JSON.parse(response);
      	})
      	.catch((error) => console.log("an error occurred", error));
	}

	render() {
		return (
			<div>
				<h1 className="pageHeadingBig">Genres and Moods</h1>
				{		
					this.state.categories.map((category,i) => {
						return (
							<div key={i} className='gridViewItem' onClick={() => this.getPlaylists(category.id, category.name)}>
								<img alt='Category' src={category.icons[0].url}/>
								<div className='gridViewInfo'>
									{category.name}
								</div>
							</div>
						)
					})
				}	
			</div>
		)
	}
}

export default Browse;