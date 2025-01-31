import React, { useState } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ onImagesUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    
    // Vérifier les fichiers
    const invalidFiles = files.filter(
      file => !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024
    );

    if (invalidFiles.length > 0) {
      setError('Certains fichiers ne sont pas valides. Les images doivent faire moins de 5MB.');
      return;
    }

    // Créer les aperçus
    const previews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPreviewImages(previews);
    setError(null);
  };

  const handleUpload = async () => {
    if (previewImages.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    previewImages.forEach(preview => {
      formData.append('images', preview.file);
    });

    try {
      const response = await fetch('/api/upload/product', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Erreur lors du téléchargement');

      const data = await response.json();
      onImagesUploaded(data.imageUrls);
      
      // Nettoyer les aperçus
      previewImages.forEach(preview => URL.revokeObjectURL(preview.preview));
      setPreviewImages([]);
    } catch (error) {
      setError('Erreur lors du téléchargement des images');
    } finally {
      setUploading(false);
    }
  };

  const removePreview = (index) => {
    URL.revokeObjectURL(previewImages[index].preview);
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="image-upload">
      <div className="upload-zone">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          id="image-input"
          className="file-input"
        />
        <label htmlFor="image-input" className="upload-label">
          <i className="fas fa-cloud-upload-alt"></i>
          <span>Glissez vos images ici ou cliquez pour sélectionner</span>
          <small>JPG, PNG • Max 5MB par image</small>
        </label>
      </div>

      {error && <div className="upload-error">{error}</div>}

      {previewImages.length > 0 && (
        <div className="preview-container">
          {previewImages.map((preview, index) => (
            <div key={preview.preview} className="preview-item">
              <img src={preview.preview} alt={`Preview ${index + 1}`} />
              <button
                onClick={() => removePreview(index)}
                className="remove-preview"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      {previewImages.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="upload-button"
        >
          {uploading ? 'Téléchargement...' : 'Télécharger les images'}
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
