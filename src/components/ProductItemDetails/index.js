import {Link} from 'react-router-dom'

import './index.css'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'
import Header from '../Header'

// import ProductCard from '../ProductCard'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    similarProductList: [],
    detailList: [],
    count: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getSimilarProductsList()
  }

  getSimilarProductsList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {id} = match.params
    // console.log(id)

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    // console.log(jwtToken)
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const fetchedSimilarProducts = data.similar_products
      // console.log(data)
      // console.log(fetchedSimilarProducts)

      const updatedDataSimilarProducts = fetchedSimilarProducts.map(
        eachItem => ({
          availability: eachItem.availability,
          brand: eachItem.brand,
          description: eachItem.description,
          id: eachItem.id,
          imageUrl: eachItem.image_url,
          price: eachItem.price,
          rating: eachItem.rating,
          style: eachItem.style,
          title: eachItem.title,
          totalReviews: eachItem.total_reviews,
        }),
      )
      // console.log(updatedDataSimilarProducts)

      const updatedDetailList = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        style: data.style,
        title: data.title,
        totalReviews: data.total_reviews,
      }

      console.log(updatedDetailList)

      this.setState({
        similarProductList: updatedDataSimilarProducts,
        detailList: updatedDetailList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="primedeals-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-view"
      />
      <h1 className="not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button className="continue-shopping-btn" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  onIncrement = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  onDecrement = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({
        count: prevState.count - 1,
      }))
    }
  }

  renderDetailView = () => {
    const {similarProductList, detailList, count} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      availability,
      brand,
      rating,
      totalReviews,
    } = detailList
    return (
      <div className="similar-detail-container">
        <div className="detail-container">
          <img src={imageUrl} className="detail-img" alt="product" />
          <div className="content-container">
            <h1 className="detail-title">{title}</h1>
            <p className="detail-price">RS {price}/- </p>
            <div className="rating-review-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="total-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="available-brand">
              Available: <span className="span-element">{availability}</span>
            </p>
            <p className="available-brand">
              Brand: <span className="span-element">{brand}</span>
            </p>
            <hr />
            <div className="inc-dec-container">
              <button
                className="inc-dec-button"
                type="button"
                onClick={this.onDecrement}
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
              <p className="count">{count}</p>
              <button
                className="inc-dec-button"
                type="button"
                data-testid="plus"
                onClick={this.onIncrement}
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-cart-button">
              Add to Cart
            </button>
          </div>
        </div>
        <h1 className="similar-products-heading">SimilarProducts</h1>
        <ul className="similar-list">
          {similarProductList.map(eachProduct => (
            <SimilarProductItem
              productData={eachProduct}
              key={eachProduct.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderProductItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderDetailView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-detail-container">
          {this.renderProductItemDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
