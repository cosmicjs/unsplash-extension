import React, { Component } from 'react'
import axios from 'axios'
import { Loader } from 'semantic-ui-react'
import Button from './components/Button'
import NavIcons from './components/NavIcons'
import Input from './components/Input'
import Photo from './components/Photo'
import Header from './components/Header'
import EmptyState from './components/EmptyState'
import NoResultState from './components/NoResultState'
import _ from 'lodash'
import { PlusIcon, CheckIcon } from '@heroicons/react/20/solid'
import '../src/styles/globals.css'

const UNSPLASH_SEARCH_URL = 'https://api.unsplash.com/search/photos'
const UNSPLASH_ACCESS_KEY = 'fd2c5776f4acd4cd209ea51fec419d09591404ef9e357ef6a5eed195023bcd53'

function getParameterByName(name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}
const { createBucketClient } = require('@cosmicjs/sdk')

const bucket = createBucketClient({
  bucketSlug: getParameterByName('bucket_slug'),
  readKey: getParameterByName('read_key'),
  writeKey: getParameterByName('write_key'),
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
    }
  }
  componentDidMount() {
    document.getElementById('search-input').focus()
  }
  getPhotos(q) {
    axios
      .get(
        UNSPLASH_SEARCH_URL + '?client_id=' + UNSPLASH_ACCESS_KEY + '&query=' + q + '&per_page=50'
      )
      .then((res) => {
        const photos = res.data.results
        this.setState({
          data: {
            photos,
          },
        })
      })
  }
  handleKeyUp(e) {
    if (!e.target.value) {
      this.setState({
        data: {},
      })
      return
    }
    this.getPhotos(e.target.value)
  }
  handleAddToMedia(photo) {
    let adding_media = this.state.data.adding_media
    if (!adding_media) adding_media = []
    this.setState({
      data: {
        ...this.state.data,
        adding_media: [...adding_media, photo.id],
      },
    })
    axios({
      url: photo.urls.full,
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      const media = new Blob([response.data], { type: 'image/jpeg' })
      media.name = photo.id + '.jpg'
      bucket.media
        .insertOne({
          media: media,
        })
        .then(() => {
          const adding_media = this.state.data.adding_media
          let added_media = this.state.data.added_media
          if (!added_media) added_media = []
          this.setState({
            data: {
              ...this.state.data,
              adding_media: _.pull(adding_media, photo.id),
              added_media: [...added_media, photo.id],
            },
          })
        })
        .catch((err) => {
          console.log(err)
        })
    })
  }
  getButton(photo) {
    if (this.state.data.adding_media && this.state.data.adding_media.indexOf(photo.id) !== -1)
      return (
        <div>
          <Button>
            <span className='mr-2'>Adding...</span>
            <Loader active inline size='mini' />
          </Button>
        </div>
      )
    if (this.state.data.added_media && this.state.data.added_media.indexOf(photo.id) !== -1)
      return (
        <div>
          <Button>
            <span className='mr-2'>Added</span>
            <CheckIcon width={20} height={20} className='text-green-500 dark:text-green-400' />
          </Button>
        </div>
      )
    return (
      <div>
        <Button onClick={this.handleAddToMedia.bind(this, photo)}>
          <span className='mr-2'>Add to Media</span>
          <PlusIcon width={20} height={20} className='text-gray-700 dark:text-gray-400' />
        </Button>
      </div>
    )
  }
  render() {
    const photos = this.state.data.photos
    return (
      <main className='h-full w-full p-2'>
        <Header>
          <Input onKeyUp={this.handleKeyUp.bind(this)} />
          <NavIcons />
        </Header>
        <div>
          {photos && (
            <div className='mt-4 lg:mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:p-4 w-full gap-4 lg:gap-6'>
              {photos.map((photo) => {
                return (
                  <div key={photo.id} className='w-full relative'>
                    <Photo url={photo.urls.regular} photo={photo} id={photo.id}>
                      {this.getButton(photo)}
                    </Photo>
                  </div>
                )
              })}
            </div>
          )}
          {!photos && <EmptyState />}
          {photos && photos.length <= 0 && <NoResultState />}
        </div>
      </main>
    )
  }
}

export default App
