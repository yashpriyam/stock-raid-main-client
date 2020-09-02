import React from "react"
import LoginPage from "../login.component"
import SignUpPage from "../signUp.component"
import "./loginAndSignUp.styles.css"

const SignInAndSignUpPage = () => (
  <div className='auth-container'>
  <div className='title'>STOCK RAID</div>
  <div className='subtitle'>Trade FAST. Win BIG</div>
  <div className='login-signup'>
    
    <LoginPage />
    <SignUpPage />
  </div>
  </div>
)

export default SignInAndSignUpPage
