import AllRoutes from './routes/AllRoutes';
import './App.css';
import { useDispatch } from 'react-redux';
import { auth, generateToken } from './configs/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { removeUser, setUser } from './store/userSlice';
import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from './configs/firebase';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      toast.info(`New message from ${payload.notification.title}: ${payload.notification.body}`);
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        dispatch(setUser({
          userState: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          token: token,
        }));
      } else {
        dispatch(removeUser());
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      {/* <SideHeader> */}
      <AllRoutes />
      {/* </SideHeader> */}

    </>
  );
}

export default App;
