import React, {Component, PropTypes} from 'react'
import { Card, Textfield, Icon, Button, Spinner } from 'react-mdl'

const styles = {
  button: {
    float: 'right',
    margin: 10,
  },
  container: {
    marginTop: 10,
  },
  searchIcon: {
    verticalAlign: 'middle',
  },
  searchContainer: {
    width: '100%',
    display: 'flex',
    marginBottom: 10,
  },
  searchField: {
    borderRadius: 3,
    marginLeft: 10,
    flex: 1,
  },
  spinnerDiv: {
    margin: 20,
    textAlign: 'center',
  },
  thumbnail: {
    width: 150,
    height: 100,
    objectFit: 'cover',
  },
  thumbnailContainer: {
    margin: '10px 3px',
    width: 150,
    height: 100,
    minHeight: 100,
    cursor: 'pointer',
  },
  imagesContainer: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-between',
  },
  noResults: {
    fontStyle: 'italic',
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingBottom: 10,
  },
}

class ImageSearch extends Component {

  constructor(props) {
    super(props)
    this.state = {
      images: [],
    }
    this.onSearchClick = this.onSearchClick.bind(this)
    this.loadMore = this.loadMore.bind(this)
    this.prepImages = this.prepImages.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll() {
    const bottom = document.getElementById('scrollBottom')
    if (bottom && !this.state.loading &&
      this.state.images.length < this.state.totalResults &&
      this.state.images.length + 10 < 100 &&
      this.scrolledToBottom(bottom)) {
      this.loadMore(this.state.images.length - 1)
    }
  }

  scrolledToBottom(bottom) {
    return bottom.getBoundingClientRect().top < window.innerHeight
  }

  loadMore(start) {
    this.setState({loading: true})
    this.props.searchImage(this.props.imageQuery, start)
      .then(this.prepImages)
  }

  prepImages(searchResults) {
    this.setState((prevState) => {
      prevState.searched =  true
      prevState.loading = false
      prevState.totalResults = parseInt(searchResults.searchInformation.totalResults)
      if (prevState.totalResults === 0) {
        return prevState
      }
      prevState.images = prevState.images.concat(searchResults.items.map((item) => {
        return {
          thumbnail: item.image.thumbnailLink,
          link: item.link,
        }
      }))
      return prevState
    })
  }

  onSearchClick() {
    this.props.searchImage(this.props.imageQuery)
      .then(this.prepImages)
    this.props.searchImage(this.props.imageQuery, 10)
      .then(this.prepImages)
    this.setState({loading: true})
    this.setState({images: []})
  }

  render() {
    return <div style={styles.container}>
      <div style={styles.searchContainer}>
        <Textfield
          onChange={this.props.setImageQuery}
          label='Image search...'
          value={this.props.imageQuery}
          style={styles.searchField}/>
        <Button
          colored
          raised
          style={styles.button}
          onClick={this.onSearchClick}>Find Image</Button>
      </div>
      <div style={styles.imagesContainer}>
        {this.state.images.map((image, i) => {
          return <Card
            shadow={1}
            style={styles.thumbnailContainer}
            key ={i}
            onClick={this.props.setImage(image.link)}>
            <img src={image.thumbnail} style={styles.thumbnail}/>
            </Card>
        })}
      </div>
      {
        this.state.loading &&
        <div style={styles.spinnerDiv}>
          <Spinner />
        </div>
      }
      {
        this.state.searched &&
        this.state.images.length === 0 &&
        <div style={styles.noResults}>No results found, please try again.</div>
      }
      <div id='scrollBottom'/>
    </div>
  }
}

ImageSearch.propTypes = {
  imageQuery: PropTypes.string,
  searchImage: PropTypes.func.isRequired,
}
export default ImageSearch
