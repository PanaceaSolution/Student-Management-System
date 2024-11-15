import { useState } from "react";
import { Upload, Trash } from "lucide-react";

const ImageUploader = ({
  register,
  errors,
  defaultImage,
  clearErrors,
  name,
}) => {
  const [image, setImage] = useState(defaultImage || null); 
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [showRemove, setShowRemove] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleUpload(file);
  };

  const handleUpload = (file) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result); 
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setImage(null); 
    setShowRemove(false); 
  };

  const handleMouseOver = () => {
    setShowRemove(true); 
  };

  const handleMouseOut = () => {
    setShowRemove(false); 
  };

  return (
    <>
      <p className="text-gray-900 font-semibold:">Uploade {name}:</p>
      <div
        className={`relative w-full  h-52 border-2 border-dashed rounded-sm border-black ${
          dragging ? "bg-blue-100" : "bg-gray-300"
        } flex justify-center items-center`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
      
        {loading ? (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-white" />
          </div>
        ) : image ? (
          <div
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${image})`, objectFit: "cover" }}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            {showRemove && (
              <div
                className="absolute top-2 right-2 bg-red-500 p-2 rounded-full cursor-pointer"
                onClick={handleRemove}
              >
                <Trash className="text-white" />
              </div>
            )}
          </div>
        ) : (
          <div className="text-primary flex space-y-4 flex-col items-center text-black">
            <Upload className="w-8 h-8 mb-2 " />
            Drag and drop or click to upload
            <label
              htmlFor="file"
              className="bg-primary text-white py-2 px-4 rounded cursor-pointer"
            >
              Browse files
            </label>
            <input
              id="file"
              type="file"
              {...register(name, {
                required: `${name} is required`,
                onChange: (e) => {
                  clearErrors(name);
                  const file = e.target.files[0];
                  if (file) {
                    handleUpload(file);
                  }
                },
              })}
              className="hidden"
            />
          </div>
        )}
      
      </div>
      {errors && (
        <p className="text-red-500 text-sm">{errors[name]?.message}</p>
      )}
    </>
  );
};

export default ImageUploader;
