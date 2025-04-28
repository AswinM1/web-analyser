import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";

import Hero from "./components/Hero";
import Home from "./components/Home";

import Navbar from './components/Navbar'
import Suggestions from "./components/Suggestions";
import Dashboard from "./components/Dashboard";


const App = () => {
  return (
    
    <div>
      <Navbar/>
      <Routes>
        <Route path="/signup" element={<Signup />} />
       
        <Route path="/login" element={<Login />} />
       \
        <Route path="/" element={<Hero/>} />
        <Route path="/home" element={<Home/>}></Route>
        <Route path="/suggestions" element={<Suggestions/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        
       
      </Routes>
      </div>
  
  );

};

const Header = () => {
  const { isSignedIn } = useClerk();
  return (
    <header>
      <UserButton />
      <nav>
        <a href="/">Home</a>
        {isSignedIn ? (
          <>
            <a href="/study-scheduler">Study Scheduler</a>
            <a href="/dashboard">Dashboard</a>
          </>
        ) : (
          <>
            <a href="/sign-in">Sign In</a>
            <a href="/sign-up">Sign Up</a>
          </>
        )}
      </nav>
    </header>
  );
};

// PrivateRoute Component
const PrivateRoute = ({ children }) => {
  const { isSignedIn } = useClerk();

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return children;
};

export default App;
