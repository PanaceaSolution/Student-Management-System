
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const NoticeForm = ({ notice, onSubmit, onClose }) => {
  const { register, handleSubmit, reset } = useForm();
  useEffect(() => {
    if (notice) {
      reset({
        title: notice.title,
        description: notice.description,
      });
    }
  }, [notice, reset]);

  // API call to create a new notice
  const createNotice = async (data) => {
    // call api
    
  };

  // API call to update an existing notice
  const updateNotice = async (data) => {
//    call api
  };

  // Form submit handler
  const onFormSubmit = (data) => {
    if (notice) {
        updateNotice(data)
     console.log("update",data)
    } else {
      
  // Create a new notice    
  console.log("create",data)
      createNotice(data); 
    }
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center z-50 items-center">
      <div className="bg-white p-4 rounded-lg shadow-md w-1/2 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 transition duration-300"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-lg font-bold mb-4">{notice ? 'Edit Notice' : 'Create Notice'}</h2>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
            />
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            {notice ? 'Update Notice' : 'Create Notice'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NoticeForm;
