import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import axios from 'axios'
import Cosmic from 'cosmicjs'
import S from 'shorti'
import _ from 'lodash'
import { Input, Button, Icon, Loader } from 'semantic-ui-react'
import fileDownload from 'js-file-download'

const UNSPLASH_SEARCH_URL = 'https://api.unsplash.com/search/photos'
const ACCESS_KEY = 'fd2c5776f4acd4cd209ea51fec419d09591404ef9e357ef6a5eed195023bcd53'

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
const api = Cosmic()
const bucket = api.bucket({
  slug: getParameterByName('bucket_slug'),
  read_key: getParameterByName('read_key'),
  write_key: getParameterByName('write_key')
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {}
    }
    this.getPhotos()
  }
  getPhotos(q) {
    if (!q)
      q = 'dog'
    axios.get(UNSPLASH_SEARCH_URL + '?client_id=' + ACCESS_KEY + '&query=' + q + '&per_page=50')
    .then(res => {
      const photos = res.data.results
      this.setState({
        data: {
          photos
        }
      })
    })
  }
  handleKeyUp(e) {
    this.getPhotos(e.target.value)
  }
  handleAddToMedia(photo) {
    let adding_media = this.state.data.adding_media
    if (!adding_media)
      adding_media = []
    this.setState({
      data: {
        ...this.state.data,
        adding_media: [...adding_media, photo.id]
      }
    })
    axios({
      url: photo.urls.full,
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      const media = new Blob([response.data], {type : "image/jpeg" })
      media.name = photo.id + '.jpg'
      bucket.addMedia({
        media
      }).then(data => {
        const adding_media = this.state.data.adding_media
        let added_media = this.state.data.added_media
        if (!added_media)
          added_media = []
        this.setState({
          data: {
            ...this.state.data,
            adding_media: _.pull(adding_media, photo.id),
            added_media: [...added_media, photo.id]
          }
        })
      }).catch(err => {
        console.log(err)
      })
    })
  }
  getButton(photo) {
    if (this.state.data.adding_media && this.state.data.adding_media.indexOf(photo.id) !== -1)
      return <Button default><Loader active inline size="mini"/>&nbsp;&nbsp;Adding...</Button>
    if (this.state.data.added_media && this.state.data.added_media.indexOf(photo.id) !== -1)
      return <Button default><Icon name="check" color="green"/>&nbsp;&nbsp;Added</Button>
    return <Button default onClick={ this.handleAddToMedia.bind(this, photo) } style={ S('mr-10') }><Icon name="plus" />&nbsp;&nbsp;Add to Media</Button>
  }
  render() {
    const photos = this.state.data.photos
    // console.log(2, photos)
    return (
      <div className="App">
        <div style={ S('w-100p') }>
          <div style={ S('pull-left m-15 w-500') }>
            <Input icon='search' placeholder="Search by keywords" style={ S('w-100p') } onKeyUp={ this.handleKeyUp.bind(this) }/>
          </div>
          <div style={ S('pull-right m-10') }>
            <img src="https://cosmicjs.com/images/logo.svg" style={ S('w-30 pull-left mr-10') }/>
            <Icon style={ S('mt-25n mr-10 w-40') } name="heart" color="red" size="large" />
            <svg className="_2m4hn" version="1.1" viewBox="0 0 32 32" width="32" height="32" aria-labelledby="unsplash-home" aria-hidden="false" data-reactid="47"><title id="unsplash-home" data-reactid="48">Unsplash Home</title><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z" data-reactid="49"></path></svg>
          </div>
        </div>
        <div style={ S('clearfix') }/>
        <div>
          { 
            photos &&
            <div>
              {
                photos.map(photo => {
                  return (
                    <div key={photo.id} style={S('pull-left ml-15 mb-15 w-320 relative')}>
                      <div style={ S('bg-url(' + photo.urls.regular + ') bg-center bg-cover w-320 h-320')} />
                      <div style={ S('absolute b-8 text-center w-100p') }>
                        {
                          this.getButton(photo)
                        }
                        <a href={ 'https://unsplash.com/photos/' + photo.id } target="_blank" className="ui button">Unsplash&nbsp;&nbsp;<Icon name="external" /></a>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          }
          {
            !photos &&
            <div>
              Loading...
            </div>
          }
        </div>
      </div>
    )
  }
}

export default App
