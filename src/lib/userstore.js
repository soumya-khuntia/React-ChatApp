import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand'
import { db } from './firbase';

export const useuserStore = create((set) => ({
  currentuser : null,
  isloading : true,
  fetchuserinfo : async (uid) => {
    if (!uid) return set({currentuser: null, isloading: false});
    try{
        const docref = doc(db, 'users', uid);
        const docSnap = await getDoc(docref);
        if (docSnap.exists()) {
            set({currentuser: docSnap.data(), isloading: false});
        } else {
            set({currentuser: null, isloading: false});
        }
        
    } catch (err){
      console.log(err);
      return set({currentuser: null, isloading: false});
    }

  },
}))