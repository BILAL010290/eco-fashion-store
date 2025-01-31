import React from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ filters, onFilterChange }) => {
  const categories = [
    'Tous', 'Hauts', 'Bas', 'Robes', 'Accessoires'
  ];

  const materials = [
    'Coton Bio', 'Lin', 'Chanvre', 'Matériaux Recyclés', 'Tencel'
  ];

  const sustainabilityCerts = [
    'GOTS', 'Fair Trade', 'OEKO-TEX', 'Recyclé'
  ];

  return (
    <div className="filter-sidebar">
      <div className="filter-section">
        <h3>Catégories</h3>
        <div className="filter-options">
          {categories.map(category => (
            <label key={category} className="filter-option">
              <input
                type="radio"
                name="category"
                value={category.toLowerCase()}
                checked={filters.category === category.toLowerCase()}
                onChange={(e) => onFilterChange({ category: e.target.value })}
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>Prix</h3>
        <div className="price-range">
          <input
            type="range"
            min="0"
            max="500"
            value={filters.priceRange[1]}
            onChange={(e) => onFilterChange({ 
              priceRange: [filters.priceRange[0], parseInt(e.target.value)] 
            })}
          />
          <div className="price-labels">
            <span>0 €</span>
            <span>{filters.priceRange[1]} €</span>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h3>Matériaux</h3>
        <div className="filter-options">
          {materials.map(material => (
            <label key={material} className="filter-option">
              <input
                type="checkbox"
                checked={filters.materials.includes(material)}
                onChange={(e) => {
                  const newMaterials = e.target.checked
                    ? [...filters.materials, material]
                    : filters.materials.filter(m => m !== material);
                  onFilterChange({ materials: newMaterials });
                }}
              />
              {material}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>Certifications</h3>
        <div className="filter-options">
          {sustainabilityCerts.map(cert => (
            <label key={cert} className="filter-option">
              <input
                type="checkbox"
                checked={filters.sustainability.includes(cert)}
                onChange={(e) => {
                  const newCerts = e.target.checked
                    ? [...filters.sustainability, cert]
                    : filters.sustainability.filter(c => c !== cert);
                  onFilterChange({ sustainability: newCerts });
                }}
              />
              {cert}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
