import React,{useState,useRef} from "react";
import "./App.css";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyDnmDXD0zfAevTn-wGp9TZ7mHDx5KDkzCM",
  authDomain: "superchat-f44b3.firebaseapp.com",
  projectId: "superchat-f44b3",
  storageBucket: "superchat-f44b3.appspot.com",
  messagingSenderId: "130454773138",
  appId: "1:130454773138:web:bbfca2cab266ce1e53f54b",
  measurementId: "G-KS70BMV94T",
});
const auth = firebase.auth();
const firestore = firebase.firestore();

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
      <h1>⚛️🔥💬</h1>
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
};

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>SignOut</button>
  );
}

function ChatRoom() {
  const messageRef = firestore.collection("messages");
  const query = messageRef.orderBy("createdAt").limit(25);
  const [messages] = useCollectionData(query, { idField: "id" });
  const[formValue,setFormValue] = useState('')
  const dummy = useRef()

  const sendMessage= async(e)=>{
         e.preventDefault()
         const {uid,photoURL}=auth.currentUser;

         await messageRef.add({
           text:formValue,
           createdAt:firebase.firestore.FieldValue.serverTimestamp(),
           uid,
           photoURL

         });
         setFormValue('');
  dummy.current.scrollIntoView({behavior:'smooth'});
        }

  

  return (
    <>
    <main>
      {
        messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
      }

      <div ref={dummy}></div>
    </main>
    <form onSubmit={sendMessage}>
    <input value={formValue} onChange={e=>setFormValue(e.target.value)}/>
    <button type="submit">🕊️</button>
    </form>
  </>
    );
}

function ChatMessage({ key, message }) {
  const { text, uid,photoURL } = message;

  const messageClass= uid===auth.currentUser.uid?'sent':'received'

  return (
    <div className={`message ${messageClass}`}>
    <img src={photoURL}/>
    <p>{text}</p>
    </div>
  );
}

export default App;
