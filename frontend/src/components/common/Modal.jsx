// src/components/common/Modal.jsx
import PropTypes from 'prop-types';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="mb-6">{children}</div>
        <div className="flex justify-end space-x-2">
          <Button text="Yopish" onClick={onClose} className="bg-gray-500 text-white" />
          {onConfirm && <Button text="Tasdiqlash" onClick={onConfirm} />}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  onConfirm: PropTypes.func,
};

export default Modal;