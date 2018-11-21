import React, { Component } from 'react';
import 'whatwg-fetch'
import cookie from 'react-cookies'
import { Link } from 'react-router-dom'
import ProductInline from './ProductInline'

class Products extends Component {

    constructor(props){
        super(props)
        this.toggleProductListClass = this.toggleProductListClass.bind(this)
        this.handleNewProduct = this.handleNewProduct.bind(this)
        this.loadMoreProducts =this.loadMoreProducts.bind(this)
        this.state = {
            posts: [],
            postsListClass: "card",
            next: null,
            previous: null,
            author: false,
            count: 0
        }
    }

    loadMoreProducts(){
        const {next} = this.state
        if (next !== null || next !== undefined) {
             this.loadProducts(next)
        }

    }

  loadProducts(nextEndpoint){
      let endpoint = '/api/posts/'
      if (nextEndpoint !== undefined) {
          endpoint = nextEndpoint
      }
      let thisComp = this
      let lookupOptions = {
          method: "GET",
          headers: {
              'Content-Type': 'application/json'
          }
      }
      const csrfToken = cookie.load('csrftoken')
      if (csrfToken !== undefined) {
          lookupOptions['credentials'] = 'include'
          lookupOptions['headers']['X-CSRFToken'] = csrfToken
       }

      fetch(endpoint, lookupOptions)
      .then(function(response){
          return response.json()
      }).then(function(responseData){
          console.log(responseData)
           thisComp.setState({
                  posts: thisComp.state.posts.concat(responseData.results),
                  next: responseData.next,
                  previous: responseData.previous,
                  author: responseData.author,
                  count: responseData.count
              })
      }).catch(function(error){
          console.log("error", error)
      })
  }

  handleNewProduct(postItemData){
      // console.log(postItemData)
      let currentProducts = this.state.posts
      currentProducts.unshift(postItemData) // unshift
      this.setState({
          posts: currentProducts
      })
  }



  toggleProductListClass(event){
      event.preventDefault()
      let currentListClass = this.state.postsListClass
      if (currentListClass === ""){
          this.setState({
              postsListClass: "card",
          })
      } else {
          this.setState({
              postsListClass: "",
          })
      }

  }

  componentDidMount(){
      this.setState({
          posts: [],
          postsListClass: "card",
          next: null,
          previous: null,
          author: false,
          count: 0
      })
      this.loadProducts()
  }
  render() {
      const {posts} = this.state
      const {postsListClass} = this.state
      const {author} = this.state
      const {next} = this.state
    return (
      <div>
          {author === true ? <Link className='mr-2' maintainScrollPosition={false} to={{
                    pathname: `/posts/create/`,
                    state: { fromDashboard: false }
                  }}>Create Product</Link> : ""}

          <button onClick={this.toggleProductListClass}>Toggle Class</button>
          {posts.length > 0 ? posts.map((postItem, index)=>{
              return (
                      <ProductInline post={postItem} elClass={postsListClass} />
              )
          }) : <p>No Products Found</p>}
          {next !== null ? <button onClick={this.loadMoreProducts}>Load more</button> : ''}
      </div>
    );
  }
}

export default Products;
