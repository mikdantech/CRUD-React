import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Products } from './components/products/Products';


class App extends Component {
  render() {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/products' component={Products} />
      </Layout>
    );
  }
}

export default App;
