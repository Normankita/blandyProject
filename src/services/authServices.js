import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../configs/firebase";

export const registerUser = async (email, password) => {
    try{
        const registeredResponse = await createUserWithEmailAndPassword(auth, email, password);
        const user = registeredResponse.user;
        const token = await user.getIdToken();

    }catch(error){
        console.error("Error creating user", error)
    }
    return {user, token};
}

export const loginUser = async (email, password) => {
    try{
        const loginResponse = await signInWithEmailAndPassword(auth, email, password);
        const user = loginResponse.user;
        const token = await user.getIdToken();
    }catch(error){
        console.error("Error logging in user", error)
    }
    return {user, token};
}

export const logOutUser = async()=>{
    try{
        const resp= await signOut(auth);
    }catch(error){
        console.error("Error logging out user", error)
    }
    return resp;
}

export const getCurrentUser = () => {
    return auth.currentUser;
}
export const getCurrentUserToken = async () => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        return token;
    }
    return null;
}