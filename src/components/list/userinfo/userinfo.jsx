import React from 'react'
import './userinfo.css'
import { useuserStore } from '../../../lib/userstore'

const userinfo = () => {

  const {currentuser} = useuserStore()

  return (
    <div className='userinfo'>
      <div className="user">
        <img src={currentuser.image || "./images/avatar.png"} alt="" />
        <h2>{currentuser.username}</h2>
      </div>
      <div className="icons">
        <img src="./images/more.png" alt="" />
        <img src="./images/video.png" alt="" />
        <img src="./images/edit.png" alt="" />
      </div>
    </div>
  )
}

export default userinfo
