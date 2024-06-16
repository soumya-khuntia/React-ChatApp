import React from 'react'
import { useState } from 'react'
import './detail.css'
import { auth, db } from '../../lib/firbase'
import { usechatStore } from '../../lib/chatstore'
import { useuserStore } from '../../lib/userstore'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'

const detail = () => {
  const [addmode, setAddmode] = useState(false);
  const [addmode1, setAddmode1] = useState(false);
  const [addmode2, setAddmode2] = useState(false);
  const [addmode3, setAddmode3] = useState(false);
  const {chatid, user, iscurrentuserblocked, isreciverblocked, changeblock} = usechatStore();
  const {currentuser} = useuserStore();

  const handelblock =async()=>{
    if(!user) return;

    const userdocref = doc(db, "users", currentuser.id);

    try {
      await updateDoc(userdocref, {
        blocked: isreciverblocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeblock();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='detail'>
      <div className="user">
        <img src={(iscurrentuserblocked || isreciverblocked) ? "./images/avatar.png" : user?.image || "./images/avatar.png"} alt="" />
        <h2>{user.username}</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Setting</span>
            <img src={addmode ? "./images/arrowDown.png" : "./images/arrowUp.png"} alt="" onClick={() => setAddmode(!addmode)} />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src={addmode1 ? "./images/arrowDown.png" : "./images/arrowUp.png"} alt="" onClick={() => setAddmode1(!addmode1)} />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src={addmode2 ? "./images/arrowDown.png" : "./images/arrowUp.png"} alt="" onClick={() => setAddmode2(!addmode2)} />
          </div>
          {addmode2 ?
            <div className="photos">
              <div className="photoitem">
                <div className="photodetails">
                  <img src="./images/pixel.jpg" alt="" />
                  <span>photo_2024.jpg</span>
                </div>
                <img src="./images/download.png" alt="" className='icon' />
              </div>
              <div className="photoitem">
                <div className="photodetails">
                  <img src="./images/pixel.jpg" alt="" />
                  <span>photo_2024.jpg</span>
                </div>
                <img src="./images/download.png" alt="" className='icon' />
              </div>
              <div className="photoitem">
                <div className="photodetails">
                  <img src="./images/pixel.jpg" alt="" />
                  <span>photo_2024.jpg</span>
                </div>
                <img src="./images/download.png" alt="" className='icon' />
              </div>
              <div className="photoitem">
                <div className="photodetails">
                  <img src="./images/pixel.jpg" alt="" />
                  <span>photo_2024.jpg</span>
                </div>
                <img src="./images/download.png" alt="" className='icon' />
              </div>
            </div>
            : ""}
        </div>

        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src={addmode3 ? "./images/arrowDown.png" : "./images/arrowUp.png"} alt="" onClick={() => setAddmode3(!addmode3)} />
          </div>
        </div>
      </div>
      <div className="action">
        <button onClick={handelblock}>{iscurrentuserblocked ? "User blocked" : isreciverblocked ? "You are blocked!" : "Block user"}</button>
        <button className='logout' onClick={() => auth.signOut()}>Logout user</button>
      </div>
    </div>
  )
}

export default detail
