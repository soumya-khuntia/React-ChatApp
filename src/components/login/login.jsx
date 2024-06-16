import React, { useState } from 'react'
import "./login.css"
import { toast } from 'react-toastify'
import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth'
import { auth,db } from '../../lib/firbase'
import { doc,setDoc } from 'firebase/firestore'
import upload from '../../lib/upload'

const login = () => {
    const [avatar, setAvatar]=useState({
        file:null,
        url:""
    })
    const [loading, setloading] = useState(false)

    const handleavatar = (e) =>{
      if(e.target.files[0]){
        setAvatar({
          file: e.target.files[0],
          url: URL.createObjectURL(e.target.files[0])
        })
      }
    };

    const handelregister = async(e) => {
      e.preventDefault();
      setloading(true);
      const formdata=new FormData(e.target);
      const {username,email,password}=Object.fromEntries(formdata);

      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);

        const imgurl = await upload(avatar.file);

        await setDoc(doc(db, 'users', res.user.uid), {
          username,
          email,
          image: imgurl,
          id: res.user.uid,
          blocked: []
        });

        await setDoc(doc(db, 'userchats', res.user.uid), {
          chats: [],
        });
        toast.success("Account created successfully");
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      } finally {
        setloading(false);
      }
    };

    const handellogin = async(e) => {
      e.preventDefault();
      setloading(true);

      const formdata=new FormData(e.target);
      const {email,password}=Object.fromEntries(formdata);

      try{
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in successfully");
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      } finally{
        setloading(false);
      }
    };

  return (
    <div className='login'>
      <div className="item">
        <h2>Welcome back</h2>
        <form onSubmit={handellogin}>
            <input type="text" placeholder="Email" name="email" />
            <input type="password" placeholder="password" name="password" />
            <button type='submit' disabled={loading}>{loading ? "Loading..." : "Sign In"}</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form onSubmit={handelregister}>
            <label htmlFor="file">
              <img src={avatar.url || "./images/avatar.png"} alt="" />
              Upload an image</label>
            <input type="file" id='file' style={{display:"none"}} onChange={handleavatar} />
            <input type="text" placeholder="username" name="username" />
            <input type="text" placeholder="Email" name="email" />
            <input type="password" placeholder="password" name="password" />
            <button disabled={loading}>{loading ? "Loading..." : "Sign Up"}</button>
        </form>
      </div>
    </div>
  )
}

export default login
