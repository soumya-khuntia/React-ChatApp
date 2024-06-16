import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import "./chat.css";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firbase";
import { usechatStore } from "../../lib/chatstore";
import { useuserStore } from "../../lib/userstore";
import upload from "../../lib/upload";

const chat = ({ toggle, settoggle }) => {
  const [chat, setchat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setimg] = useState({
    file: null,
    url: "",
  });

  const endref = useRef(null);

  const { currentuser } = useuserStore();
  const { chatid, user, iscurrentuserblocked, isreciverblocked } = usechatStore();

  useEffect(() => {
    endref.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", chatid), (res) => {
      setchat(res.data());
    });

    return () => {
      unsub();
    };
  }, [chatid]);

  const handleemoji = (e) => {
    setText(text + e.emoji);
    setOpen(false);
  };

  const handleimg = (e) => {
    if (e.target.files[0]) {
      setimg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handelsend = async () => {
    if (text === "") return;

    let imgurl = null;

    try {
      if(img.file){
        imgurl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatid), {
        messages: arrayUnion({
          senderid: currentuser.id,
          text,
          createdat: new Date(),
          ...(imgurl && { img: imgurl }),
        }),
      });

      const userids = [currentuser.id, user.id];

      userids.forEach(async (id) => {
        const userchatref = doc(db, "userchats", id);
        const userchatsnapshot = await getDoc(userchatref);

        if (userchatsnapshot.exists()) {
          const userchatdata = userchatsnapshot.data();
          const chatindex = userchatdata.chats.findIndex(
            (chat) => chat.chatid === chatid
          );
          userchatdata.chats[chatindex].lastmessage = text;
          userchatdata.chats[chatindex].isseen =
            id === currentuser.id ? true : false;
          userchatdata.chats[chatindex].updatedat = Date.now();
          console.log(userchatdata.chats[chatindex].lastmessage);
          await updateDoc(userchatref, {
            chats: userchatdata.chats,
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
    setimg({
      file: null,
      url: "",
    });

    setText("");
  };

  return (
    <div className={toggle ? "chat" : "chat toggle"}>
      <div className="top">
        <div className="user" onClick={() => settoggle(!toggle)}>
          <img src={(iscurrentuserblocked || isreciverblocked) ? "./images/avatar.png" : user?.image || "./images/avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>Hello welcome here.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./images/phone.png" alt="" />
          <img src="./images/video.png" alt="" />
          <img
            src="./images/info.png"
            alt=""
            onClick={() => settoggle(!toggle)}
          />
        </div>
      </div>

      <div className="center">
        {chat?.messages?.map((message) => (
          <div
            className={message.senderid === currentuser?.id ? toggle ? "message own" : "message own full" : toggle ? "message" : "message full"}   //{toggle ? "message own" : "message own full"}
            key={message?.createdat}
          >
            <div className="texts">
              {message.img && <img src={message.img} alt="image" />}
              <p>{message.text}</p>
              <span>1 min ago</span>
            </div>
          </div>
        ))}

        {img.url && <div className={toggle ? "message own" : "message own full"}>
          <div className="texts">
            <img src={img.url} alt="" />
          </div>
        </div>}

        <div ref={endref}></div>
      </div>

      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./images/img.png" alt="" />
          </label>
          <input type="file" id="file" style={{ display: "none" }} onChange={handleimg} />
          <img src="./images/camera.png" alt="" />
          <img src="./images/mic.png" alt="" />
        </div>
        <input
          type="text"
          placeholder={(iscurrentuserblocked || isreciverblocked) ? "You cannot send message!" : "Typed message..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={iscurrentuserblocked || isreciverblocked}
        />
        <div className="emoji">
          <img src="./images/emoji.png" alt="" onClick={() => setOpen(!open)} />
          <div className={toggle ? "picker" : "picker full"}>
            <EmojiPicker open={open} onEmojiClick={handleemoji} />
          </div>
        </div>
        <button className="sendbutton" onClick={handelsend} disabled={iscurrentuserblocked || isreciverblocked}>
          send
        </button>
      </div>
    </div>
  );
};

export default chat;
