import React, { useState, useContext } from "react"
import FormInput from "../../helpers/form-input/form-input.component"
import CustomButton from "../../helpers/custom-button/custom-button.component"
import UserDetailContext from "../../helpers/contexts/user-detail.contexts"
import "./loginAndSignUp.styles.css"

function LoginPage() {
  const { userLogger } = useContext(UserDetailContext)
  const [userCredentials, setCredentials] = useState({
    email: "",
    password: "",
  })
  const { email, password } = userCredentials;
  console.log(email, password)
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
      console.log(responseData)
      userLogger(responseData.user)
    } catch (error) {
      const err = new Error("Can not log you in, try again later", 500)
      return err
    }
  }

  return (
    <div className="sign-in-and-sign-up">
      <h3>Login</h3>
      <form onSubmit={loginHandler}>
        <FormInput
          name="email"
          type="email"
          label="Email"
          value={email}
          onChange={handleChange}
        />
        <FormInput
          name="password"
          type="password"
          label="Password"
          value={password}
          onChange={handleChange}
        />
        <CustomButton type="submit">LOG IN</CustomButton>
      </form>
      </div>
  )
}

export default LoginPage
