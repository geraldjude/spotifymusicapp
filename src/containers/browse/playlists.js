import React, { Component } from 'react';


class Playlists extends Component {
	constructor(props) {
		super(props);

		this.state = {
			playlists: []
		}
	}

	componentWillMount() {
		if(this.props.playlists.length > 0) {
			localStorage.setItem('playlists', JSON.stringify(this.props.playlists));	
			localStorage.setItem('categoryName', this.props.categoryName)
		}

		this.setState({
			playlists: JSON.parse(localStorage.getItem('playlists'))
		});
	}

	displayPlaylist(playlist) {
		this.props.displayPlaylist(playlist);
	}

	render() {
		return (
			<div>
				<h1 className="pageHeadingBig">{localStorage.getItem('categoryName')}</h1>
					{		
						this.state.playlists.map((playlist,i) => {
							return (
								<div key={i} className='gridViewItem' onClick={() => this.displayPlaylist(playlist)}>
									<img alt='Category' src={playlist.images[0].url}/>
									<div className='gridViewInfo'>
										{playlist.name}
									</div>
								</div>
							)
						})
					}	
			</div>
		)
	}
}

export default Playlists;