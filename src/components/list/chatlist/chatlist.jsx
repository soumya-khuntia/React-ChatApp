import { useEffect, useState } from "react";
import "./chatlist.css";
import Adduser from "./adduser/adduser";
import { useuserStore } from "../../../lib/userstore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firbase";
import { usechatStore } from "../../../lib/chatstore";

const chatlist = () => {
  const [chats, setChats] = useState([]);
  const [addmode, setAddmode] = useState(false);
  const [input, setinput] = useState("");

  const { currentuser } = useuserStore();
  const {chatid, changechat, iscurrentuserblocked, isreciverblocked} = usechatStore();

  useEffect(() => {
    const onsub = onSnapshot(doc(db, "userchats", currentuser.id),async (res) => {
        const items = res.data().chats;
        const promises = items.map(async(item) => {
          const userdocref = doc(db, "users", item.receiverid);
          const userdocsnap = await getDoc(userdocref);
          const user = userdocsnap.data();
          return {...item, user};
        });

        const chatdata = await Promise.all(promises);
        setChats(chatdata.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      onsub();
    };
  }, [currentuser.id]);

  const handelselect = async(chat) => {

    const userchats = chats.map((item) => {
      const {user, ...rest} = item;
      return rest;
    });

    const chatindex = userchats.findIndex((item) => item.chatid === chat.chatid);
    userchats[chatindex].isseen = true;

    const userchatref = doc(db, "userchats", currentuser.id);
    try {
      await updateDoc(userchatref, {
        chats: userchats,
      });
      changechat(chat.chatid, chat.user);
    } catch (error) {
      console.log(error);
    }

  }

  const filterchats = chats.filter((chat) => chat.user.username.toLowerCase().includes(input.toLowerCase()));
  

  return (
    <div className="chatlist">
      <div className="search">
        <div className="searchbar">
          <img src="./images/search.png" alt="" />
          <input type="text" placeholder="Search" onChange={(e) => setinput(e.target.value)} />
        </div>
        <img
          src={addmode ? "./images/minus.png" : "./images/plus.png"}
          alt=""
          className="add"
          onClick={() => setAddmode(!addmode)}
        />
      </div>
      {filterchats.map((chat) => (
        <div className="item" key={chat.chatid} onClick={()=>handelselect(chat)} style={{backgroundColor: chat?.isseen ? "transparent" : "rgb(30, 148, 233)",}}>
          <img src={(iscurrentuserblocked || isreciverblocked) ? "./images/avatar.png" : chat.user.image || "./images/avatar.png"} alt="" />
          <div className="texts">
            <span>{(iscurrentuserblocked || isreciverblocked) ? "User" : chat.user.username}</span>
            <p>{chat.lastmessage}</p>
          </div>
        </div>
      ))}

      {addmode && <Adduser />}
    </div>
  );
};

export default chatlist;
