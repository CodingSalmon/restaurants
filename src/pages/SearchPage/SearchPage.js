import React, {useState} from 'react';
import {Link} from 'react-router-dom'

import SearchLocationInput from '../../components/SearchLocationInput/SearchLocationInput';

import * as googleAPI from '../../services/googleApiService'

import './SearchPage.css'

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [citySearchTerm, setCitySearchTerm] = useState('')
    const [restaurants, setRestaurants] = useState([])
    const [isLoading, setIsLoading] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const results = await googleAPI.search(searchTerm, citySearchTerm)
        results.filter(res => res.business_status === 'OPERATIONAL').sort((a, b) => b.rating - a.rating)
        setRestaurants(results)
        setIsLoading(false)
    }
    return (
        <div className="SearchPage">
            <form
                className='search'
                onSubmit={handleSubmit}
            >
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type="search"
                    placeholder="Search for a restaurant..."
                    spellCheck='true'
                    required
                    autoFocus
                />
                <SearchLocationInput 
                    citySearchTerm={citySearchTerm}
                    setCitySearchTerm={setCitySearchTerm}
                />
                <button type="submit" className="btn blue">
                    Search
                    <i className="material-icons right">
                        search
                    </i>
                </button>
            </form>
            {isLoading !== null ? 
                isLoading ? 
                    <img className='loading' src='https://i.imgur.com/LLUyl4B.gif'></img>
                :<div id='restaurants'>
                    {restaurants.length ? 
                        restaurants.map(restaurant => 
                            <div className='restaurant card grey lighten-2' key={restaurant.place_id}>
                                <div>Name: {restaurant.name}</div>
                                <div>Address: {restaurant.formatted_address}</div>
                                <div className='user-button-area'>
                                    <Link to={`/restaurant/${restaurant.place_id}`} className='btn grey darken-2'>Details</Link>
                                </div>
                            </div>
                        )
                    :<h2>No Results</h2>}
                </div>
            :''}
        </div>
    )
}
