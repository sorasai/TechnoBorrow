import React from 'react';
import { Search } from 'lucide-react';

const SearchBar: React.FC = () => {
  return (
    <div className="dashboard-search-wrapper">
      <Search size={18} color="#9CA3AF" className="dashboard-search-icon" />
      <input 
        type="text" 
        placeholder="Search for items..." 
        className="dashboard-search-input"
      />
    </div>
  );
};

export default SearchBar;
