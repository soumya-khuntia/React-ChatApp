import React from 'react'
import { ToastContainer } from 'react-toastify'
import'react-toastify/dist/ReactToastify.css'

const notification = () => {
  return (
    <div>
      <ToastContainer position='bottom-right' />
    </div>
  )
}

export default notification
