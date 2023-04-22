import React, { Component } from 'react'
import axios from 'axios'
import { Loader } from 'semantic-ui-react'
import _ from 'lodash'
import { PlusIcon, ArrowUpRightIcon, HeartIcon, CheckIcon } from '@heroicons/react/20/solid'
import '../src/globals.css'

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
          <button className='flex items-center justify-center bg-gray-50 border-gray-300 rounded-md py-2 px-4 w-[164px] hover:bg-gray-100'>
            <span className='mr-2'>Adding...</span>
            <Loader active inline size='mini' />
          </button>
        </div>
      )
    if (this.state.data.added_media && this.state.data.added_media.indexOf(photo.id) !== -1)
      return (
        <div>
          <button className='flex items-center justify-center bg-gray-50 border-gray-300 rounded-md py-2 px-4 w-[164px] hover:bg-gray-100'>
            <span className='mr-2'>Added</span>
            <CheckIcon width={20} height={20} className='text-green-500 dark:text-green-400' />
          </button>
        </div>
      )
    return (
      <div>
        <button
          className='flex items-center justify-center bg-gray-50 border-gray-300 rounded-md py-2 px-4 w-[164px] hover:bg-gray-100'
          onClick={this.handleAddToMedia.bind(this, photo)}
        >
          <span className='mr-2'>Add to Media</span>
          <PlusIcon width={20} height={20} className='text-gray-700 dark:text-gray-400' />
        </button>
      </div>
    )
  }
  render() {
    const photos = this.state.data.photos
    return (
      <div className='bg-white dark:bg-[#111] min-h-screen w-full'>
        <div className='flex w-full items-center justify-between p-6 space-x-4'>
          <div className='w-full md:w-1/2 lg:w-1/3'>
            <input
              className='w-full p-2 border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#2AAAE2] focus:border-transparent rounded-md selection:text-neutral-700 selection:dark:text-neutral-300'
              id='search-input'
              placeholder='Search free high-resolution photos'
              onKeyUp={this.handleKeyUp.bind(this)}
            />
          </div>
          <div className='flex w-max items-center space-x-4'>
            <a href='https://cosmicjs.com' target='_blank'>
              <img src='https://cosmicjs.com/images/logo.svg' className='w-6 h-6' />
            </a>
            <HeartIcon width={20} height={20} className='text-red-500' />
            <a href='https://unsplash.com' target='_blank'>
              <svg
                className='h-6 w-6 fill-black dark:fill-white hover:fill-gray-800 hover:dark:fill-gray-200'
                width='32'
                height='32'
                aria-labelledby='unsplash-home'
                aria-hidden='false'
                viewBox='0 0 32 32'
              >
                <path d='M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z' />
              </svg>
            </a>
          </div>
        </div>
        <div>
          {photos && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6 w-full gap-6'>
              {photos.map((photo) => {
                return (
                  <div key={photo.id} className='w-full relative'>
                    <img
                      src={`${photo.urls.regular}`}
                      className={`object-cover w-full h-96 rounded-md overflow-hidden relative z-10`}
                    />
                    <div className='text-center z-0 absolute top-64 w-full'>
                      <Loader active inline size='large' />
                    </div>
                    <div className='absolute z-20 text-center w-full bottom-8  items-center justify-center flex space-x-4'>
                      {this.getButton(photo)}
                      <a
                        href={'https://unsplash.com/photos/' + photo.id}
                        target='_blank'
                        className='flex items-center justify-center bg-gray-50 border-gray-300 rounded-md py-2 px-4 w-max hover:bg-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-400 group-hover:shadow-md group'
                      >
                        <span className='mr-2'>Unsplash</span>
                        <ArrowUpRightIcon
                          width={20}
                          height={20}
                          className='text-gray-700 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-400 group-hover:translate-x-1 transition-all duration-200 ease-in-out transform'
                        />
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {!photos && (
            <div className='grid w-full h-screen place-content-center'>
              <div className='flex flex-col items-center justify-center space-y-4'>
                <svg
                  className='h-8 w-8 fill-black dark:fill-white'
                  width='32'
                  height='32'
                  aria-labelledby='unsplash-home'
                  aria-hidden='false'
                  viewBox='0 0 32 32'
                >
                  <path d='M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z' />
                </svg>
                <div className='text-2xl font-sans text-neutral-800 dark:text-neutral-200'>
                  Use the search bar above to find photos from{' '}
                  <a href='https://unsplash.com' target='_blank'>
                    Unsplash
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default App
