import React, { useState } from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PlayPage from './Components/stockComponents/play-page.components';
import UserDetailContext from './helpers/contexts/user-detail.contexts';
import SignInAndSignUpPage from './Components/userComponents/loginAndSignUp.component';
import './App.css'

const App = () => {
  const [userDetails, setUserDetails] = useState({})
  const userLogger = (userCredentials) => setUserDetails(userCredentials);
  console.log(userDetails);
  return (
    <>
    <div className='grid-container'>
    <BrowserRouter>
    <Switch>
    <UserDetailContext.Provider value={{
        userDetails,
        userLogger,
        setUserDetails
    }}>
        <Route
              exact
              path='/'
              render={() =>
                userDetails.hasOwnProperty('email') ? (
                    <PlayPage logOut={setUserDetails}/>
                ) : (
                  <SignInAndSignUpPage/>
                )
              }
              />
      </UserDetailContext.Provider>
      </Switch>
      </BrowserRouter>
    </div>
    </>
  );
};

export default App;
