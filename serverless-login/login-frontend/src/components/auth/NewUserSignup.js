import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'

export const NewUserSignup = () => {
  const history = useHistory()
  const [ newUser, setNewUser ] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: ''
  })

  const handleChange = e => {
    setNewUser({
      ...newUser,
      [ e.target.name ]: e.target.value,
    });
  }

  const handleSubmit = e => {
    e.preventDefault();
    //add new user
    fetch(`${ process.env.REACT_APP_API_URL }`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: newUser.password,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      })
    }).then( res => res.json() )
    .catch( e => {
      console.log(e)
    })
    history.push("/login")
  }

  return (
    <div className="new-user-signup-div">
      <h1>Sign Up</h1>
      <form onSubmit={ handleSubmit }>
        <input 
          name="firstName" 
          placeholder="First Name"
          className="signup-input"
          value={ newUser.firstName }
          onChange={ e => handleChange(e) }
        />
        <br />
        <input 
          name="lastName" 
          placeholder="Last Name"
          className="signup-input"
          value={ newUser.lastName }
          onChange={ e => handleChange(e) }
        />
        <br />
        <input 
          name="email" 
          placeholder="Email"
          className="signup-input"
          value={ newUser.email }
          onChange={ e => handleChange(e) }
        />
        <br />
        <input 
          name="username" 
          placeholder="Username"
          className="signup-input"
          value={ newUser.username }
          onChange={ e => handleChange(e) }
          required
        />
        <br />
        <input 
          name="password" 
          type="password"
          placeholder="Password"
          className="signup-input"
          value={ newUser.password }
          onChange={ e => handleChange(e) }
          required
        />
        <br />
        <input 
          name="confirmPassword" 
          type="password"
          placeholder="Confirm Password"
          className="signup-input"
          value={ newUser.confirmPassword }
          onChange={ e => handleChange(e) }
          required
        />
        <button className="signup-submit">
          Submit
        </button>
      </form>
    </div>
  )
}