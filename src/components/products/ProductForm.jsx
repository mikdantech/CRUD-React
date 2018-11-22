import React, {Component} from 'react'
import 'whatwg-fetch'
import cookie from 'react-cookies'
import moment from 'moment'

class ProductForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDraftChange = this.handleDraftChange.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.postTitleRef = React.createRef();
        this.postContentRef = React.createRef();
        this.state = {
            draft: true,
            title: 'sdf',
            content: 'sdfsdf',
            publish: null,
            errors: {}
        }
    }

    createProduct(data) {
        const endpoint = 'http://www.node.mikdantech.com/products';
        const csrfToken = cookie.load('csrftoken');
        let thisComp = this;
        if (csrfToken !== undefined) {
            let lookupOptions = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify(data),
                credentials: 'include'
            };

            fetch(endpoint, lookupOptions)
                .then(function (response) {
                    return response.json()
                }).then(function (responseData) {
                console.log(responseData);
                if (thisComp.props.newProductItemCreated) {
                    thisComp.props.newProductItemCreated(responseData)
                }
                thisComp.clearForm()
            }).catch(function (error) {
                console.log("error", error);
                alert("An error occured, please try again later.")
            })
        }

    }

    updateProduct(data) {
        const {post} = this.props;
        const endpoint = `http://www.node.mikdantech.com/products/${post.id}`;
        const csrfToken = cookie.load('csrftoken');
        let thisComp = this;
        if (csrfToken !== undefined) {
            let lookupOptions = {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify(data),
                credentials: 'include'
            };

            fetch(endpoint, lookupOptions)
                .then(function (response) {
                    return response.json()
                }).then(function (responseData) {
                // console.log(responseData)
                if (thisComp.props.postItemUpdated) {
                    thisComp.props.postItemUpdated(responseData)
                }

            }).catch(function (error) {
                console.log("error", error);
                alert("An error occured, please try again later.")
            })
        }

    }

    handleSubmit(event) {
        event.preventDefault();
        let data = this.state;
        console.log(data);
        const {post} = this.props;
        if (post !== undefined) {
            this.updateProduct(data)
        } else {
            this.createProduct(data)
        }

    }

    handleInputChange(event) {
        event.preventDefault();
        let key = event.target.name;
        let value = event.target.value;
        if (key === 'title') {
            if (value.length > 120) {
                alert("This title is too long")
            }
        }
        this.setState({
            [key]: value
        })
    }

    handleDraftChange(event) {
        this.setState({
            draft: !this.state.draft
        })
    }

    clearForm(event) {
        if (event) {
            event.preventDefault()
        }
        this.postCreateForm.reset();
        this.defaultState();
    }


    clearFormRefs() {
        this.postTitleRef.current = '';
        this.postContentRef.current = '';
    }


    defaultState() {
        this.setState({
            draft: false,
            title: null,
            content: null,
            publish: moment(new Date()).format('YYYY-MM-DD'),
        })
    }

    // componentDidMount() {
    //     const {post} = this.props;
    //     if (post !== undefined) {
    //         this.setState({
    //             draft: post.draft,
    //             title: post.title,
    //             content: post.content,
    //             publish: moment(post.publish).format('YYYY-MM-DD'),
    //         })
    //     } else {
    //         this.defaultState()
    //     }
    //     // this.postTitleRef.current.focus()
    // }

    render() {
        const {publish} = this.state;
        const {title} = this.state;
        const {content} = this.state;
        // const cancelClass = this.props.post !== undefined ? "d-none" : "";
        // let thisComp = this;
        return (
            <form onSubmit={this.handleSubmit} ref={(el) => this.postCreateForm = el}>
                <div className='form-group'>
                    <label htmlFor='title'>Product title</label>
                    <input
                        type='text'
                        id='title'
                        name='title'
                        defaultValue={title}
                        className='form-control'
                        placeholder='Blog post title'
                        ref={this.postTitleRef}
                        onChange={this.handleInputChange}
                        required='required'/>
                </div>
                <div className='form-group'>
                    <label htmlFor='content'>Content</label>
                    <textarea
                        id='content'
                        ref={this.postContentRef}
                        name='content'
                        defaultValue={content}
                        className='form-control'
                        placeholder='Product content'
                        onChange={this.handleInputChange}
                        required='required'/>

                </div>
                <div className='form-group'>
                    <label htmlFor='draft'>
                        <input type='checkbox' checked={this.state.draft} id='draft' name='draft' className='mr-2'
                               onChange={this.handleDraftChange}/>
                        Draft </label>&nbsp;&nbsp;
                    <button className={`btn btn-secondary`} onClick={(event) => {
                        event.preventDefault();
                        this.handleDraftChange()
                    }}>Toggle Draft
                    </button>
                </div>
                <div className='form-group'>
                    <label htmlFor='publish'>Publish Date</label>
                    <input
                        type='date'
                        id='publish'
                        name='publish'
                        className='form-control'
                        onChange={this.handleInputChange}
                        defaultValue={publish}
                        required='required'/>
                </div>
                <button type='submit' className='btn btn-primary'>Save</button>
                &nbsp;
                <button className={'btn btn-danger'} onClick={this.clearForm}>Clear</button>
            </form>
        )
    }

}

export default ProductForm
