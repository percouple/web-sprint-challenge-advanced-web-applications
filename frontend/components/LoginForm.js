import React, { useState, useEffect } from 'react'
import PT from 'prop-types'

const initialFormValues = {
  username: '',
  password: '',
}
export default function LoginForm(props) {
  const [values, setValues] = useState(initialFormValues)
  const [disabled, setDisabled] = useState(true)
  // ✨ where are my props? Destructure them here
  
  const { login } = props

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = evt => {
    evt.preventDefault()
    // ✨ implement
    login( values ) 
  }

  
  const isDisabled = () => {
    // ✨ implement
    // Trimmed username must be >= 3, and
    const username = values.username.trim().length;
    // trimmed password must be >= 8 for
    const password = values.password.trim().length;
    if (username >= 3 && password >= 8) {
      // the button to become enabled
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }

  useEffect(() => {
    isDisabled()
  }, [values])

  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input
        maxLength={20}
        value={values.username}
        onChange={onChange}
        placeholder="Enter username"
        id="username"
      />
      <input
        maxLength={20}
        value={values.password}
        onChange={onChange}
        placeholder="Enter password"
        id="password"
      />
      <button disabled={disabled} id="submitCredentials">Submit credentials</button>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
LoginForm.propTypes = {
  login: PT.func.isRequired,
}
