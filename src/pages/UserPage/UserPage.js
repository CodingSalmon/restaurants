import React, { useEffect, useState } from 'react'
import {useParams, Link} from 'react-router-dom'

import userService from '../../services/userService'
import * as googleAPI from '../../services/googleApiService'

import './UserPage.css'

const UserPage = ({loggedInUser}) => {
    const {id} = useParams()
    const [user, setUser] = useState(null)

    useEffect(() => {
        (async () => {
            let currentUser = await userService.getUserFromId(id)
            currentUser.favorites = await Promise.all(currentUser.favorites.map(async placeId => {
                const fav = await googleAPI.getRestaurantDetails(placeId)
                return fav.data.result
            }))
            setUser(currentUser)
        })()
    }, [id])

    const follow = async () => {
        await userService.follow(loggedInUser._id, user._id)
        setUser({...user, followers:[...user.followers, loggedInUser]})
    }

    const unfollow = async () => {
        await userService.unfollow(loggedInUser._id, user._id)
        setUser({...user, followers:user.followers.filter(f => f._id !== loggedInUser._id)})
    }

    return (
        <div className='UserPage'>
            {user ?
                <>
                    <h3>{user.name}</h3>
                    <br></br>
                    <p>Email: {user.email}</p>
                    {loggedInUser ? 
                        loggedInUser._id === user._id ?
                            ''
                        : user.followers.some(follower => follower._id === loggedInUser._id) ?
                        <div className='btn blue' onClick={unfollow}>Unfollow</div>
                        :<div className='btn blue' onClick={follow}>Follow</div>
                    :''}
                    <div className='follow-area'>
                        <div>{user.following.length} Following</div>
                        <div>{user.followers.length} Followers</div>
                    </div>
                    <h4>Favorites</h4>
                    <div id='restuarants'>
                        {user.favorites.length ? 
                            user.favorites.map(result => 
                                <div className='restaurant card grey lighten-2' key={result.place_id}>
                                    <div>Name: {result.name}</div>
                                    <div>Address: {result.formatted_address}</div>
                                    <div className='user-button-area'>
                                        <Link to={`/restaurant/${result.place_id}`} className='btn grey darken-2'>Details</Link>
                                    </div>
                                </div> 
                            )
                        :''}
                    </div>
                </>
            :''}
        </div>  
    )
}

export default UserPage;