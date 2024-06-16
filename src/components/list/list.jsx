import React from 'react'
import './list.css'
import Userinfo from './userinfo/userinfo'
import Chatlist from './chatlist/chatlist'

const list = () => {
  return (
    <div className='list'>
      <Userinfo/>
      <Chatlist/>
    </div>
  )
}

export default list
