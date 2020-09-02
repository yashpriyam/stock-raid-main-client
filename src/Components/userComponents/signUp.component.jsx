import React, { useState, useContext } from "react"
import FormInput from "../../helpers/form-input/form-input.component"
import CustomButton from "../../helpers/custom-button/custom-button.component"
import UserDetailContext from "../../helpers/contexts/user-detail.contexts"

import "./loginSignup/loginAndSignUp.styles.css"

function SignUpPage() {
  const { logIn } = useContext(UserDetailContext)
  const [errorMessage, seterrorMessage] = useState('')
  const [error, setError] = useState(false)
  const [userCredentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  })
  const { username, email, password } = userCredentials;

  const handleChange = (event) => {
    const { value, name } = event.target
    setCredentials({ ...userCredentials, [name]: value })
  }

  const signUpHandler = async (event) => {
    event.preventDefault()
    try {
      const signUpResponse = await fetch(
        "https://stock-raid-basic-server.herokuapp.com/api/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      )
      const signUpResponseJson = await signUpResponse.json()
      // console.log(signUpResponseJson)
      if (signUpResponseJson.message) {
        setError(true)
        seterrorMessage(signUpResponseJson.message)
        return;
      }
      logIn(signUpResponseJson.user, signUpResponseJson.token)
    } catch (error) {
      const err = new Error("Not able to sign up, try again later", 500)
      return err
    }
  }
  return (
    <div className="sign-up">
      <div className='login-title'>Sign Up</div>
      <form onSubmit={signUpHandler}>
        <FormInput
          name="username"
          type="text"
          label="Name"
          value={username}
          onChange={handleChange}
          disabled={error}
        />
        <FormInput
          name="email"
          type="email"
          label="Email"
          value={email}
          onChange={handleChange}
          disabled={error}
        />
        <FormInput
          name="password"
          type="password"
          label="Password"
          value={password}
          onChange={handleChange}
          disabled={error}
        />
        <CustomButton type="submit" disabled={error}>SIGN UP</CustomButton>
        {error && (
          <div className='error-container'>
            <div className='error-msg'>{errorMessage}</div>
            <CustomButton onClick={() => setError(false)}>Try Again</CustomButton>
          </div>
        )}
      </form>
    </div>
  )
}

export default SignUpPage
