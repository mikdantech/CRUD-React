import React, {Component} from 'react';
import './App.css';

import {Route, Switch} from 'react-router-dom';
import {Layout} from './components/Layout';
import {Home} from './components/Home';
import Products from './components/products/Products';
import ProductDetail from './components/products/ProductDetail';
import ProductCreate from './components/products/ProductCreate';

class App extends Component {
    render() {
        return (
            <Layout>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route exact path='/products' component={Products}/>
                    <Route exact path='/products/create' component={ProductCreate}/>
                    <Route exact path='/products/:id' component={ProductDetail}/>
                    <Route component={Products}/>
                </Switch>
            </Layout>
        );
    }
}

export default App;
