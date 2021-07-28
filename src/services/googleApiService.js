const BASE_URL = '/api/google/';

export function search(searchTerm, locationSearchTerm) {
    return fetch(`${BASE_URL}search/${searchTerm}/${locationSearchTerm ? locationSearchTerm : 'anywhere'}`, {
        headers: new Headers({'Content-Type': 'application/json'}),
    })
    .then(res => res.json())
    .catch(err => {console.log(err)})
}

export function getRestaurantDetails(placeId) {
    return fetch(`${BASE_URL}details/${placeId}`, {
        headers: new Headers({'Content-Type': 'application/json'}),
    })
    .then(res => res.json())
    .catch(err => {console.log(err)})
}

// export function getRestaurantPhoto(ref) {
    // return axios.get(`${CORS}${BASE_URL}photo?maxwidth=400&photoreference=${ref}&key=${key}`)
    // .then(res => res.json())
    // .catch((err) => console.log(err));
// }