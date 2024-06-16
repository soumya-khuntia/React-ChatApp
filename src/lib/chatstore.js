import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand'
import { db } from './firbase';
import { useuserStore } from './userstore';

export const usechatStore = create((set) => ({
  chatid : null,
  user : null,
  iscurrentuserblocked: false,
  isreciverblocked: false,
  changechat: (chatid, user) => {
    const currentuser = useuserStore.getState().currentuser;

    //If current user is blocked
    if (user.blocked.includes(currentuser.uid)){
        return set({
            chatid,
            user : null,
            iscurrentuserblocked: true,
            isreciverblocked: false,
        });
    }

    //If reciver is blocked
    else if (currentuser.blocked.includes(user.uid)){
        return set({
            chatid,
            user : user,
            iscurrentuserblocked: false,
            isreciverblocked: true,
        });
    }
    else{
        return set({
            chatid,
            user,
            iscurrentuserblocked: false,
            isreciverblocked: false,
        });
    }
    
  },

  changeblock: () =>{
    set(state => ({...state, iscurrentuserblocked: !state.iscurrentuserblocked}));
  },
  
}))