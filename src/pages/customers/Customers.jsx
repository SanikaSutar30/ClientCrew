// This is a React component for managing customers in a frontend application. It includes features such as searching, filtering, sorting, pagination, and adding new customers through a modal form. The component uses state to manage the list of customers and the UI interactions.
// The AddCustomer component is a child component that renders a modal form for adding a new customer. It receives props from the Customers component to control its visibility and to pass the new customer data back up when the form is submitted.
// The Customers component also includes action buttons for exporting customer data and navigating to the add customer form, as well as stats cards that display summary information about the customers. The main table displays the list of customers with options to edit, delete, or view details for each customer.
// The component is styled using Tailwind CSS classes and includes support for dark mode based on the `darkMode` prop.
// Note: The actual data management (e.g., fetching from an API, updating, deleting) is not implemented in this code and would need to be added for a fully functional application.
// The code is structured to allow for easy integration with a backend API in the future, where the customer data would be fetched and manipulated through API calls rather than being stored in local state.
// The component also includes pagination logic to handle large lists of customers, allowing users to navigate through pages of customer data. The search and filter functionality allows users to quickly find specific customers based on their name, email, or status.
// Overall, this component provides a comprehensive UI for managing customers in a frontend application, with a focus on usability and functionality.
// The Customers component is the main component for displaying and managing customers. It includes a header with action buttons, stats cards, a search and filter row, a table of customers, and pagination controls. The AddCustomer component is used as a modal form for adding new customers to the list. The component uses state to manage the list of customers, the search term, filters, sort order, pagination, and the visibility of the add customer modal.
// The component is designed to be responsive and supports dark mode styling based on the `darkMode` prop. The customer data is currently stored in local state for demonstration purposes, but it can be easily integrated with a backend API for real data management. The component includes features such as searching, filtering, sorting, and pagination to enhance the user experience when managing a large list of customers.
import { Search, Plus, Download, Eye, Pencil, Trash2 } from "lucide-react";
//
import { useState } from "react";
import AddCustomer from "./AddCustomer";
// 
import { useOutletContext } from "react-router-dom";

// This component is the main page for managing customers. It includes a header with action buttons, stats cards, a search and filter row, a table of customers, and pagination controls. It also manages the state for the list of customers, search term, filters, sort order, pagination, and the visibility of the add customer modal. The AddCustomer component is used as a modal form for adding new customers to the list.
export default function Customers() {
  // Get dark mode setting from context (if using React Router's OutletContext)
  const { darkMode } = useOutletContext();
  // Sample customer data stored in state. In a real application, this would likely come from an API call.
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "+91 9876543210",
      status: "Active",
      joinedDate: "2024-01-12",
    },
    {
      id: 2,
      name: "Amit Patil",
      email: "amit@gmail.com",
      phone: "+91 9123456789",
      status: "Active",
      joinedDate: "2024-02-03",
    },
    {
      id: 3,
      name: "Priya Singh",
      email: "priya@gmail.com",
      phone: "+91 9988776655",
      status: "Pending",
      joinedDate: "2024-03-18",
    },
    {
      id: 4,
      name: "John Doe",
      email: "john@gmail.com",
      phone: "+91 8877655443",
      status: "Inactive",
      joinedDate: "2024-04-02",
    },
    {
      id: 5,
      name: "Neha Verma",
      email: "neha@gmail.com",
      phone: "+91 9284711223",
      status: "Active",
      joinedDate: "2024-04-10",
    },
    {
      id: 6,
      name: "Suresh Reddy",
      email: "suresh@gmail.com",
      phone: "+91 9032144556",
      status: "Active",
      joinedDate: "2024-05-22",
    },
  ]);
  // State for search term, status filter, and sort order
  const [searchTerm, setSearchTerm] = useState("");

  // Status filter can be "All", "Active", "Pending", or "Inactive"
  const [statusFilter, setStatusFilter] = useState("All");

  // Sort order can be "Newest" or "Oldest"
  const [sortOrder, setSortOrder] = useState("Newest");

  // Filter and sort customers based on search term, status filter, and sort order
  const filteredCustomers = customers
    .filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.id.toString().includes(searchTerm);

      // Status filter logic: If the status filter is set to "All", all customers match. Otherwise, only customers whose status matches the selected filter will match.
      const matchesStatus =
        statusFilter === "All" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.joinedDate);
      const dateB = new Date(b.joinedDate);

      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

  // Handler for adding a new customer. This function takes the new customer data, creates a new customer object with a temporary ID, and updates the customers state by adding the new customer to the top of the list. In a real application, you would likely send this data to a backend API and receive an ID in response, rather than generating it on the frontend.
  const handleAddCustomer = (newCustomer) => {
    setCustomers((prev) => [
      {
        id: prev.length + 1, // temporary (backend will handle later)
        ...newCustomer,
      },
      ...prev, // add on top
    ]);
  };

  // Pagination logic
  // currentPage state to track the current page number. itemsPerPage is set to 5, which means each page will display 5 customers. totalPages is calculated based on the length of the filteredCustomers array divided by itemsPerPage. safeCurrentPage ensures that the current page number is always within the valid range (1 to totalPages). paginatedCustomers is a slice of the filteredCustomers array that contains only the customers that should be displayed on the current page.
  const [currentPage, setCurrentPage] = useState(1);

  //  In a real app, itemsPerPage might be a user setting or come from API response
  const itemsPerPage = 5;


  // Calculate total pages based on the number of filtered customers and items per page. This determines how many pages of customers there will be for pagination.
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Ensure currentPage is within valid range after filtering
  const safeCurrentPage =
    totalPages === 0 ? 1 : Math.min(currentPage, totalPages);

  // Calculate the customers to display on the current page
  const paginatedCustomers = filteredCustomers.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage,
  );

  // State to control visibility of the Add Customer modal
  const [showAddModal, setShowAddModal] = useState(false);
  return (
    // The main container for the Customers page. It includes conditional rendering for the AddCustomer modal, a header with action buttons, stats cards, a search and filter row, a table of customers, and pagination controls. The styling adapts to dark mode based on the `darkMode` prop.
    <div className="space-y-6">
      // Conditional rendering of the AddCustomer modal. When `showAddModal` is true, the AddCustomer component is rendered as a modal form. The `darkMode`, `setShowAddModal`, and `handleAddCustomer` props are passed down to the AddCustomer component to control its appearance and functionality.
      {showAddModal && (
        <AddCustomer
          
          // The `darkMode` prop is passed to the AddCustomer component to allow it to adapt its styling based on the current theme. The `setShowAddModal` function is passed down to allow the AddCustomer component to control its own visibility (e.g., to close the modal after adding a customer). The `handleAddCustomer` function is passed down as a callback that the AddCustomer component can call when a new customer is added, allowing the Customers component to update its state with the new customer data.
          darkMode={darkMode}
          // The `setShowAddModal` function is passed down to the AddCustomer component to allow it to control its own visibility. This means that when the form in the AddCustomer component is submitted, it can call `setShowAddModal(false)` to close the modal after adding a new customer.
          setShowAddModal={setShowAddModal}
          // The `handleAddCustomer` function is passed down as a callback to the AddCustomer component. When a new customer is added through the form in the AddCustomer component, it can call this function with the new customer data, allowing the Customers component to update its state and include the new customer in the list.
          onAddCustomer={handleAddCustomer}
        />
      )}


      {/* HEADER */}
      // The header section of the Customers page includes the title "Customers" and a subtitle that describes the purpose of the page. It also contains action buttons for exporting customer data and adding a new customer. The styling of the text adapts to dark mode based on the `darkMode` prop, ensuring that the text is visible and appropriately styled in both light and dark themes.
      <div className="flex items-center justify-between">
        <div>
          // The main title of the page, "Customers", is displayed in a large, bold font. Below the title, there is a subtitle that provides additional context about the page, indicating that it is for managing customers and their information. The text color of the subtitle adapts to dark mode based on the `darkMode` prop, ensuring that it remains readable in both themes.
          <h1 className="text-2xl font-bold">Customers</h1>
          
          // The subtitle provides additional context about the page, indicating that it is for managing customers and their information. The text color of the subtitle adapts to dark mode based on the `darkMode` prop, ensuring that it remains readable in both themes. The subtitle is styled with a smaller font size and a muted color to differentiate it from the main title while still providing useful information to the user.
          <p
            className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}
          >
            Manage your customers and their information
          </p>
        </div>

        {/* ACTION BUTTONS */}
        // The action buttons include an "Export" button with a download icon and an "Add Customer" button with a plus icon. The "Export" button is styled with a background color and text color that adapts to dark mode, and it includes a hover effect for better user interaction. The "Add Customer" button is styled with a distinct background color to make it stand out, and it also includes a hover effect. When the "Add Customer" button is clicked, it sets the `showAddModal` state to true, which triggers the display of the AddCustomer modal form.
        <div className="flex gap-3">

          // The "Export" button includes a download icon from the `lucide-react` library and is styled to adapt to dark mode. It has a hover effect that changes the background color for better user interaction. The button is intended to allow users to export customer data, although the actual export functionality would need to be implemented separately.
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium shadow-sm border cursor-pointer transition ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            // The Download icon from the `lucide-react` library is used to visually represent the export action for customer data. It is placed inside the "Export" button to indicate that clicking the button will trigger an export of the customer data, although the actual export functionality would need to be implemented separately.
            <Download size={16} />
            Export
          </button>

          // The "Add Customer" button includes a plus icon from the `lucide-react` library and is styled with a distinct background color to make it stand out. It has a hover effect that changes the opacity for better user interaction. When this button is clicked, it sets the `showAddModal` state to true, which triggers the display of the AddCustomer modal form where users can enter details for a new customer. The button is designed to be easily noticeable and encourages users to add new customers to the system.
          <button
            // navigate to a customer creation form
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#0f766e] text-white hover:opacity-90 cursor-pointer"
          >
            // The Plus icon from the `lucide-react` library is used to visually represent the action of adding a new customer. It is placed inside the "Add Customer" button to indicate that clicking the button will allow users to add a new customer to the system by opening the AddCustomer modal form.
            <Plus size={16} />
            Add Customer
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      // The stats cards section displays summary information about the customers, such as total customers, active customers, new customers this month, and inactive customers. Each card is styled with a background color and border that adapts to dark mode. The text color also adapts to ensure readability in both themes. The cards are arranged in a responsive grid layout that adjusts based on the screen size, providing a clear and concise overview of key customer metrics at a glance.
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {
          // The stats cards are generated by mapping over an array of objects, where each object contains a title and a value for a specific customer metric. For each item in the array, a card is created with styling that adapts to dark mode. The title is displayed in a smaller font with a muted color, while the value is displayed in a larger, bold font to make it stand out. This allows users to quickly see important customer statistics at a glance.
          [
          { title: "Total Customers", value: "256" },
          { title: "Active Customers", value: "231" },
          { title: "New This Month", value: "12" },
          { title: "Inactive", value: "25" },
        ].map((item, index) => (
          <div
            key={index}
            className={`p-5 rounded-xl shadow-sm ${
              darkMode
                ? "bg-gray-700 border border-gray-600"
                : "bg-white text-black border border-gray-200 "
            }`}
          >
            // The title of the stat card is displayed in a smaller font size with a muted color that adapts to dark mode. This provides context for the value being displayed, indicating what the number represents (e.g., total customers, active customers, etc.). The styling ensures that the title is readable and visually distinct from the value, while still fitting within the overall design of the card.
            <p
              className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-500"}`}
            >
              {item.title}
            </p>

            // The value of the stat card is displayed in a larger, bold font to make it stand out. The text color adapts to dark mode to ensure readability in both themes. This allows users to quickly see important customer statistics at a glance, with the value being the focal point of the card.
            <h2
              className={`text-2xl font-bold mt-2 ${darkMode ? "text-white" : "text-black"}`}
            >
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* MAIN TABLE CARD */}
      // The main table card is a container that holds the search and filter row, the table header, the table body with customer rows, and the pagination controls. The styling of the card adapts to dark mode, with background color and border color changing based on the `darkMode` prop. The card is designed to be visually distinct from the rest of the page, providing a clear area for managing and viewing customer data. The card includes padding and rounded corners for a polished look, and it serves as the main area where users can interact with the customer data through searching, filtering, sorting, and pagination.
      <div
        className={`rounded-xl shadow-sm overflow-hidden ${
          darkMode
            ? "bg-gray-700 border border-gray-600 text-white"
            : "bg-white border border-gray-200 text-black"
        }`}
      >
        {/* SEARCH + FILTER ROW */}
        // The search and filter row is a flex container that includes a search input and filter dropdowns for status and sort order. The search input allows users to search for customers by name, email, or ID, while the filter dropdowns allow users to filter customers by their status (e.g., Active, Pending, Inactive) and sort them by their joined date (Newest or Oldest). The styling of the search input and filter dropdowns adapts to dark mode, ensuring that they are visually consistent with the overall theme of the page. The row is designed to be user-friendly and provides essential tools for managing and navigating through the customer data effectively.
        <div
          className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border-b ${
            darkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          {/* SEARCH */}
          // The search input is a flex container that includes a search icon and an input field. The search icon is from the `lucide-react` library and is styled with a gray color to indicate its purpose. The input field allows users to enter a search term to filter the customer list based on their name, email, or ID. The styling of the input field adapts to dark mode, with background color, text color, and placeholder color changing based on the `darkMode` prop. The input field is designed to be user-friendly and provides a clear visual indication of its purpose through the use of the search icon.
          <div
            className={`flex items-center px-3 py-2 rounded-lg w-full md:w-80 border ${
              darkMode
                ? "bg-gray-600 border-gray-500"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            // The Search icon from the `lucide-react` library is used to visually represent the search functionality for filtering the customer list. It is placed inside the search input container to indicate that users can enter a search term to filter customers by their name, email, or ID. The icon is styled with a gray color to differentiate it from the input text and to provide a clear visual cue for the search functionality.
            <Search size={16} className="text-gray-500" />

            // The input field allows users to enter a search term to filter the customer list based on their name, email, or ID. The value of the input is controlled by the `searchTerm` state, and it updates the state on change. The styling of the input field adapts to dark mode, with background color, text color, and placeholder color changing based on the `darkMode` prop. The input field is designed to be user-friendly and provides a clear visual indication of its purpose through the use of the search icon. When the user types in the search input, it filters the customer list in real-time based on the entered search term.
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);// Update the search term state as the user types in the input field. This allows for real-time filtering of the customer list based on the entered search term.
                setCurrentPage(1); // Reset to first page on new search
              }}
              className={`bg-transparent outline-none ml-2 w-full text-sm ${
                darkMode
                  ? "text-white placeholder:text-gray-300"
                  : "text-gray-700 placeholder:text-gray-400"
              }`}
            />
          </div>

          {/* FILTERS */}
          // The filter section includes two dropdowns: one for filtering customers by their status (All, Active, Pending, Inactive) and another for sorting customers by their joined date (Newest or Oldest). The dropdowns are styled to adapt to dark mode, with background color, border color, and text color changing based on the `darkMode` prop. When the user changes the status filter or sort order, the current page is reset to 1 to ensure that the user sees the first page of results in the new filtered or sorted order. This allows users to easily manage and navigate through the customer data based on their preferences.
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
              
              className={`px-3 py-2 rounded-lg text-sm border  bg-transparent cursor-pointer ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              }`}
            >
              // The status filter dropdown allows users to filter customers based on their status. The options include "All" (which shows all customers regardless of status), "Active", "Pending", and "Inactive". When the user selects a different status from the dropdown, the `statusFilter` state is updated, and the current page is reset to 1 to ensure that the user sees the first page of results in the new filtered order. This provides an easy way for users to manage and view customers based on their status.
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>

            
            // Sorting options for customers based on their joined date. The user can choose to sort by "Newest" or "Oldest". When the sort order is changed, the current page is reset to 1 to ensure that the user sees the first page of results in the new sort order.
            <select
              
              value={sortOrder}

              // When the sort order is changed, the current page is reset to 1 to ensure that the user sees the first page of results in the new sort order.
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1); // Reset to first page on sort change
              }}

              // Sorting options for customers based on their joined date. The user can choose to sort by "Newest" or "Oldest". When the sort order is changed, the current page is reset to 1 to ensure that the user sees the first page of results in the new sort order.
              className={`px-3 py-2 rounded-lg text-sm border cursor-pointer ${
                darkMode
                  ? "bg-gray-700 border-gray-500 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-700"
                   
              }`}
            >
              // Sorting options for customers based on their joined date. The user can choose to sort by "Newest" or "Oldest". When the sort order is changed, the current page is reset to 1 to ensure that the user sees the first page of results in the new sort order.
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* TABLE HEADER */}
        <div className="px-4 pt-3">
          // The table header is a grid layout that defines the columns for the customer data. It includes columns for ID, Customer Name, Email, Phone, Status, Joined Date, and Actions. The header row is styled with a background color and text color that adapts to dark mode based on the `darkMode` prop. The column widths are defined using CSS grid template columns to ensure proper spacing and alignment of the data in the table body.

          <div
            className={`grid grid-cols-[60px_2.2fr_2fr_1.6fr_1fr_1.4fr_1fr] px-4 py-3 text-sm font-semibold rounded-lg ${
              darkMode ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            // Each column header is defined as a span element with appropriate text. The headers include "ID", "Customer Name", "Email", "Phone", "Status", "Joined", and "Actions". The styling of the header row adapts to dark mode based on the `darkMode` prop, ensuring that the text is visible and the background color provides sufficient contrast in both light and dark themes.
    
            <span>ID</span>  
            <span>Customer Name</span>
            <span>Email</span>
            <span>Phone</span>
            <span>Status</span>
            <span>Joined</span>
            <span>Actions</span>
          </div>
        </div>

        // TABLE BODY
        <div className="px-4 pb-4">
          // If there are no customers after filtering, display a message in the center of the table area. The message is styled to be subtle and is centered both vertically and horizontally within the available space. The text color adapts to dark mode based on the `darkMode` prop.
        
          {filteredCustomers.length === 0 ? (
            // If there are no customers after filtering, display a message in the center of the table area. The message is styled to be subtle and is centered both vertically and horizontally within the available space. The text color adapts to dark mode based on the `darkMode` prop.

            <div className="text-center py-6 text-gray-500 text-sm cursor-pointer">
              No customers found
            </div>
          ) : (
              // The customer rows are generated by mapping over the `paginatedCustomers` array, which contains only the customers that should be displayed on the current page after filtering and sorting. Each row displays the customer's information and action buttons for editing, deleting, or viewing details. The styling adapts to dark mode based on the `darkMode` prop.

            paginatedCustomers.map((customer) => (
              <div
                // Each customer row is clickable and displays the customer's information in a grid layout. The row includes the customer's ID, name with an avatar, email, phone number, status with a colored badge, joined date formatted as MM/DD/YYYY, and action buttons for editing, deleting, or viewing details of the customer. The styling changes on hover to indicate that the row is clickable, and it adapts to dark mode based on the `darkMode` prop.
                key={customer.id}
                className={`grid grid-cols-[60px_2.2fr_2fr_1.6fr_1fr_1.4fr_1fr] items-center px-3 py-2 border-b last:border-b-0 hover:bg-gray-100 rounded-xl transition cursor-pointer dark:hover:bg-gray-500 ${
                  darkMode ? "border-gray-600" : "border-gray-100"
                }`}
              >
                // ID
                <span className={darkMode ? "text-white" : "text-black"}>
                  {customer.id}
                </span>

               // Customer Name with Avatar
                <div className="flex items-center gap-3 min-w-0">
                  // Placeholder avatar image
                  <div className="w-10 h-10 bg-gray-300 rounded-full shrink-0"></div>
                  // Customer name with truncation for long names
                  <span
                    className={`font-medium truncate ${darkMode ? "text-white" : "text-black"}`}
                  >
                    {customer.name}
                  </span>
                </div>

                // Email with truncation for long emails
                <span
                  className={`truncate ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {customer.email}
                </span>

                // Phone number
                <span className={darkMode ? "text-gray-300" : "text-gray-500"}>
                  {customer.phone}
                </span>

                // Status with colored badge
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full w-fit ${
                    // Green for Active, Orange for Pending, Red for Inactive
                    customer.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : customer.status === "Pending"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-red-100 text-red-600"
                  }`}
                >
                  {customer.status}
                </span>

                //  Joined date formatted as MM/DD/YYYY
                <span className={darkMode ? "text-gray-300" : "text-gray-500"}>
                  // Format the joined date to a more readable format
                  {new Date(customer.joinedDate).toLocaleDateString()}
                </span>

                // Action buttons (View, Edit, Delete)
                <div className="flex items-center gap-2 justify-start">
                  // Edit button with pencil icon
                  <button className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 cursor-pointer">
                    // The Pencil icon represents the edit action for the customer
                    <Pencil size={16} />
                  </button>

                  // Delete button with trash icon
                  <button className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer">
                    // The Trash2 icon represents the delete action for the customer
                    <Trash2 size={16} />
                  </button>

                  // View button with eye icon
                  <button className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer">
                    // The Eye icon represents the view details action for the customer
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        // PAGINATION CONTROLS
        <div
          className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-4 border-t ${
            darkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          // Showing X to Y of Z customers
          <p
            className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}
          >
            Showing{" "}
            <span className="font-medium">
              // Calculate the starting index of the current page. If there are no customers, show 0.
            
              {filteredCustomers.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            // Calculate the ending index of the current page. It should not exceed the total number of filtered customers.
            <span className="font-medium">
              // If there are no customers, show 0. Otherwise, show the minimum of the last index of the current page and the total number of filtered customers.
            
              {Math.min(currentPage * itemsPerPage, filteredCustomers.length)}
            </span>{" "}
            of <span className="font-medium">
              // Show the total number of customers that match the current search and filter criteria.
              {filteredCustomers.length}</span>{" "}
            customers
          </p>

          
          // Pagination buttons (Previous, page numbers, Next)
          <div className="flex items-center gap-2">
            // Previous button, disabled on the first page
            <button
              // When clicked, it decreases the current page number by 1, but not below 1. It is disabled when the current page is 1 to prevent going to a non-existent page.
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}

              // The button is disabled when the current page is 1, which means the user cannot go to a previous page because they are already on the first page. The styling changes to indicate that the button is disabled (e.g., reduced opacity and cursor not allowed).
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-lg text-sm border transition ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:bg-gray-50"
              } ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white hover:bg-gray-500"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
            >
              Previous
            </button>

            // Page number buttons, highlighted when active
          
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                // Each page number button, when clicked, sets the current page to that number. The button is styled differently if it is the active page (currentPage === page) to indicate which page the user is currently on.
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition cursor-pointer ${
                    // If this page number is the current page, it gets a distinct background and text color to indicate that it is active. Otherwise, it has a default style that changes on hover.
                    currentPage === page
                      ? "bg-[#0f766e] text-white"
                      : darkMode
                        ? "bg-gray-600 text-white hover:bg-gray-500"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            
            // Next button, disabled on the last page or when there are no customers
            <button
              // When clicked, it increases the current page number by 1, but not above the total number of pages. It is disabled when the current page is the last page or when there are no customers to prevent going to a non-existent page.
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))
              }

              // The button is disabled when the current page is the last page (currentPage === totalPages) or when there are no customers (totalPages === 0). This prevents the user from trying to navigate to a next page that does not exist. The styling changes to indicate that the button is disabled (e.g., reduced opacity and cursor not allowed).
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-2 rounded-lg text-sm border transition ${
                currentPage === totalPages || totalPages === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:bg-gray-50"
              } ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white hover:bg-gray-500"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
