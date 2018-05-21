import React from 'react';
import ReactDOM from 'react-dom';
import Register from './containers/register/register.js';
import Home from './containers/home/home.js';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

const App = () => {
	return (

		<div>
			<BrowserRouter>
				<Switch>
			      <Route path="/home" component={Home} />
			      <Route path="/" component={Register} />
			    </Switch>
		    </BrowserRouter>
	    </div>
	)
}

ReactDOM.render(<App />, document.getElementById('root'));
