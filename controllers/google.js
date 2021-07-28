const axios = require('axios')

const CORS = 'https://sams-cors-anywhere.herokuapp.com/'
const BASE_URL = "https://maps.googleapis.com/maps/api/place/"
const key = process.env.REACT_APP_GOOGLE_API_KEY

module.exports = {
  search,
  getRestaurantDetails,
  getRestaurantPhoto,
}

function search(req, res) {
  if (req.params.location === 'anywhere') {
    axios.get(`${CORS}${BASE_URL}textsearch/json?query=restaurant+${req.params.term}&key=${key}`, {
      headers: {"X-Requested-With": "XMLHttpRequest"}
    })
    .then(restaurants => res.json(restaurants.data.results))
    .catch(err => {console.log(err)})
  } else {
    axios.get(`${CORS}${BASE_URL}textsearch/json?query=restaurant+${req.params.term}+in+${req.params.location}&key=${key}`, {
      headers: {"X-Requested-With": "XMLHttpRequest"}
    })
    .then(restaurants => res.json(restaurants.data.results))
    .catch(err => {console.log(err)})
  }
}

function getRestaurantDetails(req, res) {
  return axios.get(`${CORS}${BASE_URL}details/json?place_id=${req.params.id}&key=${key}`, {
    headers: {"X-Requested-With": "XMLHttpRequest"}
  })
  .then(restaurant => res.json(restaurant.data.result))
  .catch(err => {console.log(err)})
}

function getRestaurantPhoto(req, res) {
  return axios.get(`${CORS}${BASE_URL}photo?maxwidth=400&photoreference=${ref}&key=${key}`)
}