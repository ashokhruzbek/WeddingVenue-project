// src/components/common/ImageUpload.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const ImageUpload = ({ onImagesChange, label, maxImages = 5 }) => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > maxImages) {
      alert(`Maksimal ${maxImages} ta rasm yuklashingiz mumkin`);
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);
    onImagesChange(newImages);

    // Preview uchun URL yaratish
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
    onImagesChange(newImages);
  };

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="mb-2"
      />
      <div className="grid grid-cols-3 gap-2">
        {previews.map((preview, index) => (
          <div key={index} className="relative">
            <img src={preview} alt="Preview" className="w-full h-24 object-cover rounded" />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

ImageUpload.propTypes = {
  onImagesChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  maxImages: PropTypes.number,
};

export default ImageUpload;