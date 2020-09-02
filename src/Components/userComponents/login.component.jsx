import React, { useState, useContext } from "react"
import FormInput from "../../helpers/form-input/form-input.component"
import CustomButton from "../../helpers/custom-button/custom-button.component"
import UserDetailContext from "../../helpers/contexts/user-detail.contexts"
import "./loginSignup/loginAndSignUp.styles.css"

function LoginPage() {
  const { logIn } = useContext(UserDetailContext)
  const [errorMessage, seterrorMessage] = useState('')
  const [error, setError] = useState(false)
  const [userCredentials, setCredentials] = useState({
    email: "",
    password: "",
  })
  const { email, password } = userCredentials;
  // console.log(email, password)
  const handleChange = (event) => {
    const { value, name } = event.target
    setCredentials({ ...userCredentials, [name]: value })
  }
  const loginHandler = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch(
        "https://stock-raid-basic-server.herokuapp.com/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )
      const responseData = await response.json()
      if (responseData.message) {
        setError(true)
        seterrorMessage(responseData.message)
        return;
      }
      // console.log(responseData)
      logIn(responseData.user, responseData.token);
    } catch (error) {
      const err = new Error("Can not log you in, try again later", 500)
      return err
    }
  }

  return (
    <div className="sign-in">
      <div className='login-title'>Login</div>
      <form onSubmit={loginHandler}>
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
        <CustomButton type="submit" disabled={error}>LOG IN</CustomButton>
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

export default LoginPage
