import React from "react"

import "./form-input.styles.scss"

const FormInput = ({ handleChange, label, type, ...otherProps }) => (
  <div className="group">
    <input className="form-input" type={type} onChange={handleChange} {...otherProps} />
    {label ? (
      <label
        className={`${
          otherProps.value.length ? "shrink" : ""
        } form-input-label`}
      >
        {label}
      </label>
    ) : null}
  </div>
)

export default FormInput
