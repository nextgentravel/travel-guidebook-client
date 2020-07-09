/* src/components/search-form.js */
import React, { useState, useRef } from "react"
import { navigate } from "@reach/router"
import { FaSearch } from 'react-icons/fa';

const SearchForm = ({ initialQuery = "" }) => {
  // Create a piece of state, and initialize it to initialQuery
  // query will hold the current value of the state,
  // and setQuery will let us change it
  const [query, setQuery] = useState(initialQuery)
  
  // We need to get reference to the search input element
  const inputEl = useRef(null)

  // On input change use the current value of the input field (e.target.value)
  // to update the state's query value
  const handleChange = e => {
    setQuery(e.target.value)
  }
  
  // When the form is submitted navigate to /search
  // with a query q paramenter equal to the value within the input search
  const handleSubmit = e => {
    e.preventDefault()
    // `inputEl.current` points to the mounted search input element
    const q = inputEl.current.value
    navigate(`/search?q=${q}`)
  }
  return (
    <form role="search" onSubmit={handleSubmit} className="search-form">
      <label htmlFor="search-input" className="sr-only">
        Search for:
      </label>
      <div className="input-group">
        <input
          className="form-control"
          ref={inputEl}
          id="search-input"
          type="search"
          value={query}
          placeholder="Search"
          onChange={handleChange}
        />
        <div className="input-group-append">
          <button type="submit" className="btn btn-primary"><FaSearch /></button>
        </div>
      </div>
      <span className="search-form-addon"></span>
    </form>
  )
}
export default SearchForm