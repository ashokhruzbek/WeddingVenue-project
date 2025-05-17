// src/components/common/Navbar.jsx
import PropTypes from 'prop-types';
 import Button from './Button';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="text-xl font-bold">To‘yxona Bronlash</div>
      {user && (
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">
            {user.role === 'admin' ? 'Admin' : user.role === 'owner' ? 'Egasi' : 'Foydalanuvchi'}: {user.name}
          </span>
          <Button
            text="Chiqish"
            onClick={onLogout}
            className="bg-red-500 text-white"
          />
        </div>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
  }),
  onLogout: PropTypes.func.isRequired,
};

export default Navbar;