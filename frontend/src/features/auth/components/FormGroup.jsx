import React from 'react'

const FormGroup = ({label , placeholder , value , onChange, type = "text"}) => {
  return (
    <div className='form-group'>
      <label htmlFor={label}>{label}</label>
      <input type={type}
      value={value}
      onChange={onChange}
      id={label} 
      name={label} 
      required
      placeholder={placeholder} />
    </div>
  )
}

export default FormGroup
