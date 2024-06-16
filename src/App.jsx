import { useState,useEffect } from 'react'
import Chat from './components/chat/chat'
import Detail from './components/detail/detail'
import List from './components/list/list'
import Login from './components/login/login'
import Notification from './components/notification/notification' 
import './App.css'
import { onAuthStateChanged } from 'firebase/auth/cordova'
import { auth } from './lib/firbase'
import { useuserStore } from './lib/userstore'
import { usechatStore } from './lib/chatstore'

function App() {
  const [toggle, settoggle] = useState(false)
  const {currentuser,isloading,fetchuserinfo} = useuserStore()
  const {chatid} = usechatStore()

  try {
    useEffect(() => {
      const onsub = onAuthStateChanged(auth, (user) => {
        if (user) {
          fetchuserinfo(user.uid);
        } else {
          fetchuserinfo(null);
        }
      });
    
      return () => {
        onsub();
      }
    }, [fetchuserinfo])
  } catch (error) {
    console.log(error);
  }
  
  
  if (isloading) return <div className='loading'>Loading...</div>

  return (
    <div className="container">
      { currentuser ? (
        <>  
        <List />
        {chatid && <Chat toggle= {toggle} settoggle={settoggle}/>}
        {toggle && <Detail />}
        </>
      ) : (<Login />) }
      <Notification/>
    </div>
  )
}

export default App
