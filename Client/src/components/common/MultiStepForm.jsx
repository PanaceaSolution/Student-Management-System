// src/MultiStepForm.js

import React, { useState } from "react";

const steps = ["Personal Info", "Account Info", "Confirmation"];

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(JSON.stringify(formData, null, 2));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Multi-Step Form</h1>
      <div className="relative flex items-center justify-center mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`step w-10 h-10 flex items-center justify-center rounded-full text-white ${
                index === currentStep ? "bg-purple-600" : "bg-gray-400"
              }`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`line h-1 w-20 bg-gray-300 ${
                  index < currentStep ? "bg-purple-600" : ""
                }`}
              ></div>
            )}
            <div className="text-center mt-1">{step}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 0 && (
          <div>
            <label className="block mb-2">
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded p-2"
                required
              />
            </label>
          </div>
        )}
        {currentStep === 1 && (
          <div>
            <label className="block mb-2">
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded p-2"
                required
              />
            </label>
            <label className="block mb-2">
              Password:
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded p-2"
                required
              />
            </label>
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <h2 className="text-lg font-bold">Confirmation</h2>
            <p>Name: {formData.name}</p>
            <p>Email: {formData.email}</p>
            <p>Password: {formData.password}</p>
          </div>
        )}

        <div className="button-group mt-4 flex justify-between">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-300 text-black rounded p-2"
            >
              Back
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-purple-600 text-white rounded p-2"
            >
              Next
            </button>
          ) : (
            <button type="submit" className="bg-green-600 text-white rounded p-2">
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;
