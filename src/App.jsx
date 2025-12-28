import AllRoutes from './routes/AllRoutes';
import './App.css';
import { useDispatch } from 'react-redux';
import { auth, generateToken } from './configs/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { removeUser, setUser } from './store/userSlice';
import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from './configs/firebase';
import { useData } from './contexts/DataContext';

function App() {
  const dispatch = useDispatch();
  const {fetchSnapshotData, setNotifications, userProfile} = useData();

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


 useEffect(() => {
  if (!userProfile?.email) return; // Wait for email to be available

  const unsubscribe = fetchSnapshotData({
    path: "conversations",
    onDataChange: (liveData) => {
      // Only show conversations the user is NOT in
      const newNotifications = liveData.filter(
        (c) => c.participants.some((r) => r.email === userProfile.email)
      );

      // Remove duplicates based on conversation ID (assuming c.id exists)
      setNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        const filtered = newNotifications.filter((n) => !existingIds.has(n.id));
        return [...prev, ...filtered];
      });

    }
  });

  return () => unsubscribe();
}, [userProfile?.email]);


  return (
    <>
      <AllRoutes />
    </>
  );
}

export default App;
