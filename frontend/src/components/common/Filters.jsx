// src/components/common/Filters.jsx
import PropTypes from 'prop-types';
import Input from './Input';
import Select from './Select';
import Button from './Button';

const Filters = ({ filters, onFilterChange, onReset, filterOptions }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Filtrlar</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          name="search"
          value={filters.search || ''}
          onChange={handleChange}
          placeholder="Qidirish..."
          label="Qidiruv"
        />
        {filterOptions.district && (
          <Select
            name="district"
            value={filters.district || ''}
            onChange={handleChange}
            options={filterOptions.district}
            label="Rayon"
          />
        )}
        {filterOptions.sort && (
          <Select
            name="sort"
            value={filters.sort || ''}
            onChange={handleChange}
            options={filterOptions.sort}
            label="Tartiblash"
          />
        )}
        <div className="flex items-end">
          <Button text="Tozalash" onClick={onReset} className="bg-gray-500 text-white w-full" />
        </div>
      </div>
    </div>
  );
};

Filters.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  filterOptions: PropTypes.shape({
    district: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      })
    ),
    sort: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export default Filters;