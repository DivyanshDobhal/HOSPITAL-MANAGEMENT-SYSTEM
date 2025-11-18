import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaTimes } from 'react-icons/fa'
import './SearchBar.css'

const SearchBar = ({ 
  placeholder = 'Search...', 
  onSearch, 
  debounceMs = 300,
  filters = [],
  onFilterChange 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({})
  const debounceTimer = useRef(null)

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm, selectedFilters)
      }
    }, debounceMs)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [searchTerm, selectedFilters, debounceMs, onSearch])

  const handleFilterChange = (filterKey, value) => {
    const newFilters = {
      ...selectedFilters,
      [filterKey]: value || undefined,
    }
    // Remove undefined values
    Object.keys(newFilters).forEach(key => 
      newFilters[key] === undefined && delete newFilters[key]
    )
    setSelectedFilters(newFilters)
    if (onFilterChange) {
      onFilterChange(newFilters)
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSelectedFilters({})
  }

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="search-clear"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}
      </div>

      <AnimatePresence>
        {filters.length > 0 && (
          <motion.div
            className="search-filters"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {filters.map((filter) => (
              <select
                key={filter.key}
                className="filter-select"
                value={selectedFilters[filter.key] || ''}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              >
                <option value="">All {filter.label}</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar

