import React, { useState, useContext } from 'react';
import FormInput from '../../helpers/form-input/form-input.component';
import CustomButton from '../../helpers/custom-button/custom-button.component';
import UserDetailContext from '../../helpers/contexts/user-detail.contexts';

import './loginAndSignUp.styles.css';

function SignUpPage() {
    const { userLogger } = useContext(UserDetailContext);
    const [ userCredentials, setCredentials ] = useState({username: '',email: '',password: ''})
    const { username, email, password } = userCredentials;

    const handleChange = event => {
      const { value, name } = event.target;
      setCredentials({...userCredentials, [name]: value });
    };

    const signUpHandler = async (event) => {
        event.preventDefault();
        try {
            const signUpResponse = await fetch('https://stock-raid-basic-server.herokuapp.com/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });
            const signUpResponseJson = await signUpResponse.json();
            console.log(signUpResponseJson);
            userLogger(signUpResponseJson.user)
            
        } catch (error) {
            const err = new Error('Not able to sign up, try again later', 500);
            return err;
        }
    }
    return (
        <div className='sign-in-and-sign-up'>
        <h3>Sign Up</h3>
        <form onSubmit={signUpHandler}>
            <FormInput name='username' type='text' label='Name' value={username} onChange={handleChange}/>
            <FormInput name='email' type='email' label='Email' value={email} onChange={handleChange}/>
            <FormInput name='password' type='password' label='Password' value={password} onChange={handleChange}/>
            <CustomButton type='submit'>SIGN UP</CustomButton>
        </form>
        </div>
    )
}

export default SignUpPage;