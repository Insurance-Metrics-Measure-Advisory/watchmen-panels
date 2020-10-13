import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Path from '../common/path';
import DomainSelect from './domain-select';
import Home from './home';
import ImportData from './import-data';
import Welcome from './welcome';

export default () => {
	return <BrowserRouter>
		<Switch>
			<Route path={Path.HOME}><Home/></Route>
			<Route path={Path.DOMAIN_SELECT}><DomainSelect/></Route>
			<Route path={Path.IMPORT_DATA}><ImportData/></Route>
			<Route path="*"><Welcome/></Route>
		</Switch>
	</BrowserRouter>;
}