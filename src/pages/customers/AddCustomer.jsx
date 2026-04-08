// This component is the modal form for adding a new customer. It receives props from the Customers.jsx parent component to control its visibility and to pass the new customer data back up when the form is submitted.

import { useState } from "react";

export default function AddCustomer({
  darkMode,
  setShowAddModal,
  onAddCustomer,
}) {
  // Form state to hold the input values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active",
    joinedDate: "",
  });

  // State to hold validation errors
  const[errors,setErrors]=useState({})

  // Handle input changes and update form state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

// Validate form inputs before submission
  const validateForm = () => {
    // Create a new object to hold any validation errors
    const newErrors = {};

    // Validate name - it should not be empty
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Validate email - it should not be empty and should be in a valid format
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      // Simple regex to check for basic email format 
      newErrors.email = "Invalid email format";
    }

    // Validate phone - it should not be empty
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    // Validate joined date - it should not be empty
    if (!formData.joinedDate) {
      newErrors.joinedDate = "Joined date is required";
    }

    // Update the errors state with any validation errors found
    setErrors(newErrors);

    // Return true if there are no errors, otherwise return false to indicate validation failed
    return Object.keys(newErrors).length === 0;
  };


  // Handle form submission
  const handleSubmit = (e) => {
    // Prevent default form submission behavior
    e.preventDefault();

    // Log the form data to verify it's being captured correctly
    console.log("Customer Data:", formData);

    // Validate the form inputs before proceeding
    if (!validateForm()) {
      return; // If validation fails, do not proceed with submission
    } 
    
    //send data to parent component to add to customer list
    onAddCustomer(formData);
    // later -> Spring Boot API call here
    // After successful submission, close the modal
    setShowAddModal(false);
  };

  return (
    // Modal backdrop and container
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] px-4">
      {/* // Modal content container with conditional styling based on dark mode */}
      <div
        className={`w-full max-w-4xl rounded-2xl p-8 shadow-xl ${
          darkMode
            ? "bg-gray-800 border border-gray-600"
            : "bg-white border border-gray-200"
        }`}
      >
        {/* Header 
        // The header of the modal contains the title "Add Customer" and a brief description. It also includes a close button (represented by an "X") that allows users to close the modal without submitting the form. The header is styled to adapt to the dark mode setting, ensuring it fits well with the overall theme of the application. The title is displayed in a larger font size with a bold weight, while the description is displayed in a smaller font size with a lighter color for better readability. The close button is positioned on the right side of the header and changes color on hover to provide visual feedback to the user. This header provides clear context for users about the purpose of the modal and how to exit it if they choose not to add a customer. */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Add Customer</h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter customer details to create a new record
            </p>
          </div>

       {/* // Close button to exit the modal without saving */}
          <button
            type="button"
            onClick={() => setShowAddModal(false)}
            className="text-gray-500 hover:text-red-500 text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form 
        // The form contains input fields for the customer's full name, email address, phone number, status, and joined date. Each input field is controlled by the formData state, and changes to the inputs update this state accordingly. The form also includes validation error messages that are displayed below each input field if there are any validation errors. The submit button is disabled until the required fields (name and email) are filled out, ensuring that users cannot submit incomplete data. The form is styled to adapt to the dark mode setting, with appropriate background colors, border colors, and text colors for better visibility and user experience. When the form is submitted successfully, the new customer data is sent back to the parent component through the onAddCustomer callback function, allowing it to be added to the customer list. After submission, the modal is closed automatically. */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className={`w-full px-4 py-3 rounded-xl border outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    : "bg-gray-50 border-gray-200 text-black placeholder:text-gray-400"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            {/* // The email input field allows users to enter the customer's email address. It is a required field and must be in a valid email format. The input is controlled by the formData state, and any changes to the input update this state accordingly. If there are any validation errors related to the email (e.g., if it's empty or in an invalid format), an error message is displayed below the input field in red text. The styling of the input adapts to the dark mode setting, ensuring it remains visually consistent with the overall theme of the application. This input field is crucial for capturing contact information for the customer, which can be used for communication and reference when managing customer data. */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className={`w-full px-4 py-3 rounded-xl border outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    : "bg-gray-50 border-gray-200 text-black placeholder:text-gray-400"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
              {/* // The phone number input field allows users to enter the customer's contact number. It is a required field and must not be empty. The input is controlled by the formData state, and any changes to the input update this state accordingly. If there are any validation errors related to the phone number (e.g., if it's empty), an error message is displayed below the input field in red text. The styling of the input adapts to the dark mode setting, ensuring it remains visually consistent with the overall theme of the application. This input field is important for capturing additional contact information for the customer, which can be useful for communication and reference when managing customer data. */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={`w-full px-4 py-3 rounded-xl border outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    : "bg-gray-50 border-gray-200 text-black placeholder:text-gray-400"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Status */}
            {/* // The status dropdown allows users to select the customer's current status from predefined options (Active, Pending, Inactive). The selected status is controlled by the formData state, and any changes to the dropdown update this state accordingly. The dropdown is styled to adapt to the dark mode setting, ensuring it remains visually consistent with the overall theme of the application. This input field is important for categorizing customers based on their current relationship with the business, which can be useful for managing customer interactions and prioritizing actions based on their status. */}
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border outline-none cursor-pointer ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-black"
                }`}
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Joined Date */}
            {/* // The joined date input field allows users to select the date when the customer joined. It is a required field and must not be empty. The input is controlled by the formData state, and any changes to the input update this state accordingly. If there are any validation errors related to the joined date (e.g., if it's empty), an error message is displayed below the input field in red text. The styling of the input adapts to the dark mode setting, ensuring it remains visually consistent with the overall theme of the application. This input field is important for capturing historical information about the customer, which can be useful for tracking customer history and understanding their relationship with the business. */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Joined Date
              </label>
              <input
                type="date"
                name="joinedDate"
                value={formData.joinedDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-black"
                }`}
              />
              {errors.joinedDate && (
                <p className="text-red-500 text-xs mt-1">{errors.joinedDate}</p>
              )}
            </div>
          </div>

          {/* Actions 
          // The action buttons for the form are displayed at the bottom of the modal, allowing users to either cancel the operation or save the new customer. The "Cancel" button allows users to close the modal without saving any changes, while the "Save Customer" button submits the form and saves the new customer data. The "Save Customer" button is disabled until the required fields (name and email) are filled out, ensuring that users cannot submit incomplete data. Both buttons are styled to adapt to the dark mode setting, with appropriate background colors, text colors, and hover effects for better visibility and user experience. This provides users with clear options for how to proceed after filling out the form, making it easy to either save their changes or exit without saving. */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className={`px-5 py-2.5 rounded-xl cursor-pointer ${
                darkMode
                  ? "bg-gray-600 text-white hover:bg-gray-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancel
            </button>

            

            {/*  The "Save Customer" button is responsible for submitting the form and saving the new customer data. It is disabled until the required fields (name and email) are filled out, ensuring that users cannot submit incomplete data. The button is styled to adapt to the dark mode setting, with a background color that stands out and text color that ensures readability. On hover, the button changes opacity to provide visual feedback to the user, indicating that it is clickable. This button plays a crucial role in allowing users to save their changes and add new customers to the system, making it an essential part of the form's functionality. */}
            <button
              type="submit"
              disabled={!formData.name || !formData.email}
              className={`px-5 py-2.5 rounded-xl text-white cursor-pointer ${
                !formData.name || !formData.email
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0f766e] hover:opacity-90 cursor-pointer"
              }`}
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
