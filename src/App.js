import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PlayPage from './Components/playPage/play-page.components';
import UserDetailContext from './helpers/contexts/user-detail.contexts';
import SignInAndSignUpPage from './Components/userComponents/loginSignup/loginAndSignUp.component';
// import './App.css'

const App = () => {
  const [userDetails, setUserDetails] = useState({})
  const [token, setToken] = useState('');

  const logIn = useCallback((userData, token) => {
    setToken(token);
    setUserDetails(userData);
    localStorage.setItem('userData', JSON.stringify({
      userData,
      token
    }));
  }, []);

  const logOut = useCallback(() => {
    setToken(null);
    localStorage.removeItem('userData');
    setUserDetails(null);
  })


  // checking the localstorage if any token is present on every render
  // useEffect runs after the component render runs
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    // console.log(storedData);
    if (storedData && storedData.token) {
      logIn(storedData.userData, storedData.token);
    }
  }, [logIn]);

  console.log(userDetails);
  
  return (
    <BrowserRouter>
      <Switch>
        <UserDetailContext.Provider value={{
            userDetails,
            logIn,
            logOut
        }}>
          <Route exact path='/' render={() => token ? (<PlayPage userDetails={userDetails}/>) : (<SignInAndSignUpPage/>)}/>
        </UserDetailContext.Provider>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
