import React, { useState } from 'react'
import './adduser.css'
import { db } from '../../../../lib/firbase';
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { useuserStore } from '../../../../lib/userstore';

const adduser = () => {
  const [user, setUser] = useState(null);
  const {currentuser} = useuserStore();

  const handelSearch = async (e) => {
    e.preventDefault();
    const formdata=new FormData(e.target);
    const username=formdata.get('username');

    try {
      const userRef=collection(db, 'users');
      const q = query(userRef, where('username', '==', username));  //It fetch only single user so you should validate username at register time like each user have unique username
      const querysnapshot = await getDocs(q);

      if(!querysnapshot.empty){
        setUser(querysnapshot.docs[0].data()); 
      } else {
        setUser(null); // or handle the case when no user is found
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handelAdd = async () => {
    const chatref = collection(db, 'chats');
    const userchatref = collection(db, 'userchats');

    try {
      const newchatref = doc(chatref);

      await setDoc(newchatref,{
        createdat: serverTimestamp(),
        message: [],
      });

      await updateDoc(doc(userchatref, user.id), {
        chats: arrayUnion({
          chatid: newchatref.id,
          lastmessage: "",
          receiverid: currentuser.id,
          updatedat: Date.now(),
        }),
      });

      await updateDoc(doc(userchatref, currentuser.id), {
        chats: arrayUnion({
          chatid: newchatref.id,
          lastmessage: "",
          receiverid: user.id,
          updatedat: Date.now(),
        }),
      });
    } catch (error) {
      console.log(error);
    }
    
  }

  return (
    <div className='adduser'>
      <form onSubmit={handelSearch}>
        <input type="text" placeholder="username" name="username" />
        <button>search</button>
      </form>
      {user && <div className="user">
        <div className="detail">
            <img src={user.image || "./images/avatar.png"} alt="" />
            <span>{user.username}</span>
        </div>
        <button onClick={handelAdd}>Add User</button>
      </div>}
    </div>
  )
}

export default adduser
