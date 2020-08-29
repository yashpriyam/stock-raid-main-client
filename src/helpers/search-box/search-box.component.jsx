import React from "react"
import FormInput from "../form-input/form-input.component"
import "./search-box.styles.css"

const SearchBox = (props) => {
  const { label, value, onSearchChange } = props
  return (
    <FormInput
      className="search-box"
      type="search"
      label={label}
      onChange={onSearchChange}
      value={value}
    />
  )
}

export default SearchBox
