import React, { Component } from 'react';
import 'whatwg-fetch'
import cookie from 'react-cookies'
import { Link } from 'react-router-dom'
import ProductInline from './ProductInline'

class Products extends Component {

    constructor(props){
        super(props);
        this.toggleProductListClass = this.toggleProductListClass.bind(this);
        this.handleNewProduct = this.handleNewProduct.bind(this);
        this.loadMoreProducts =this.loadMoreProducts.bind(this);
        this.state = {
            products: [],
            productsListClass: "card",
            next: null,
            previous: null,
            count: 0
        }
    }

    loadMoreProducts(){
        const {next} = this.state;
        if (next !== null || next !== undefined) {
             this.loadProducts(next)
        }
    }

  loadProducts(nextEndpoint){
      let endpoint = "https://db.mikdan.tech/api/v1/blogs";
      if (nextEndpoint !== undefined) {
          endpoint = nextEndpoint
      }
      let thisComp = this;
      let lookupOptions = {
          method: "GET",
          headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
          }
      };
      const csrfToken = cookie.load('csrftoken');
      if (csrfToken !== undefined) {
          lookupOptions['credentials'] = 'include';
          lookupOptions['headers']['X-CSRFToken'] = csrfToken
      }

      fetch(endpoint, lookupOptions)
      .then(function(response){
          return response.json()
      }).then(function(responseData){
           thisComp.setState({
                  products: responseData,
                  next: responseData.next,
                  previous: responseData.previous,
                  count: responseData.count
              });
      }).catch(function(error){
          console.log("error", error)
      })
  }

  handleNewProduct(postItemData){
      // console.log(postItemData)
      let currentProducts = this.state.products;
      currentProducts.unshift(postItemData); // unshift
      this.setState({
          products: currentProducts
      })
  }



  toggleProductListClass(event){
      event.preventDefault();
      let currentListClass = this.state.productsListClass;
      if (currentListClass === ""){
          this.setState({
              productsListClass: "card",
          })
      } else {
          this.setState({
              productsListClass: "",
          })
      }

  }

  componentDidMount(){
      // this.setState({
      //     products: [],
      //     productsListClass: "card",
      //     next: null,
      //     previous: null,
      //     count: 0
      // })
      this.loadProducts()
  }
  render() {
      const {products} = this.state;
      const {productsListClass} = this.state;
      const {next} = this.state;
    return (
      <div>
        <Link className='mr-2' maintainscrollposition="false" to={{
                  pathname: '/products/create',
                  state: { fromDashboard: false }
                }}>Create Product</Link>
              <br />
          <button onClick={this.toggleProductListClass}>Toggle Class</button>
          {products.length > 0 ? products.map((postItem, index)=>{
              return (
                      <ProductInline key={index} post={postItem} elClass={productsListClass} />
              )
          }) : <p>No Products Found</p>}
          {next !== null ? <button onClick={this.loadMoreProducts}>Load more</button> : ''}
      </div>
    );
  }
}

export default Products;
