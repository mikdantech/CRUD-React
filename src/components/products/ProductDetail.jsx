import React, {Component} from 'react'
import 'whatwg-fetch'
import cookie from 'react-cookies'
import { Link } from 'react-router-dom'

import ProductForm from './ProductForm'

class ProductDetail extends Component {
    constructor(props){
        super(props);
        this.handleProductItemUpdated= this.handleProductItemUpdated.bind(this);
        this.state = {
             id: null,
             post: null,
             doneLoading: false,
        }
    }

    handleProductItemUpdated(postItemData){
        this.setState({
            post: postItemData
        })
    }
    loadProduct(id){
      const endpoint = `http://www.node.mikdantech.com/products/${id}/`;
      let thisComp = this;
      let lookupOptions = {
          method: "GET",
          headers: {
              'Content-Type': 'application/json'
          }
      };

      const csrfToken = cookie.load('csrftoken');
      if (csrfToken !== undefined) {
          lookupOptions['credentials'] = 'include';
          lookupOptions['headers']['X-CSRFToken'] = csrfToken;
       }

      fetch(endpoint, lookupOptions)
      .then(function(response){
          if (response.status === 404){
              console.log('Page not found')
          }
          return response.json()
      }).then(function(responseData){
          if (responseData.detail){
              thisComp.setState({
                  doneLoading: true,
                  post: null
              })
          } else {
           thisComp.setState({
                  doneLoading: true,
                  post: responseData
              })
          }
      }).catch(function(error){
          console.log("error", error)
      })
  }
    componentDidMount(){
        this.setState({
                id: null,
                post: null
            });
        if (this.props.match){
            const {id} = this.props.match.params;
            this.setState({
                id: id,
                doneLoading: false
            });
            this.loadProduct(id)
        }
    }
    render(){
        const {doneLoading} = this.state;
        const {post} = this.state;
        return(
            <p>{(doneLoading === true) ? <div>
                {post === null ? "Not Found":
                <div>
                <h1>{post.title}</h1>
                    {console.log(post)}
                {post.id}

                <p className='lead'>
                <Link maintainscrollposition="false" to={{
                    pathname: `/products`,
                    state: { fromDashboard: false }
                  }}>Products</Link>

                  {post.owner === true ? <Link maintainscrollposition="false" to={{
                    pathname: `/products/create`,
                    state: { fromDashboard: false }
                  }}>Create Product</Link> : "" }
               </p>

                  {post.owner === true ? <ProductForm post={post} postItemUpdated={this.handleProductItemUpdated} /> : ""}
                </div>
               }
           </div> : "Loading..."}</p>
        )
    }
}

export default ProductDetail
