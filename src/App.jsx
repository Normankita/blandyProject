import AllRoutes from './routes/AllRoutes';
import './App.css';
import SideHeader from './components/layout/SideHeader';
import { useDispatch } from 'react-redux';
import { auth } from './configs/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { removeUser, setUser } from './store/userSlice';
import { useEffect } from 'react';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    
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
