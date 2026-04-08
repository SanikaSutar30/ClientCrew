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

import { useState } from "react";
// Importing icons from lucide-react for use in the UI
import { Search, Plus, Download, Eye, Pencil, Trash2 } from "lucide-react";
// useOutletContext is used to access the context provided by the parent layout, which includes the dark mode setting.
import { useOutletContext } from "react-router-dom";
// Importing the AddCustomer component which is used as a modal form for adding new customers.
import AddCustomer from "./AddCustomer";

export default function Customers() {

  // Get dark mode value from layout outlet context
  const { darkMode } = useOutletContext();

  // Customer list stored in local state for now.
  // Later this can come from Spring Boot API response.
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

  // Table control states
  // These states are used to manage the search term, status filter, sort order, and current page for pagination.
  const [searchTerm, setSearchTerm] = useState("");
  // Status filter state with default value "All"
  const [statusFilter, setStatusFilter] = useState("All");
  // Sort order state with default value "Newest"
  const [sortOrder, setSortOrder] = useState("Newest");
  // Current page state for pagination with default value 1
  const [currentPage, setCurrentPage] = useState(1);

  // Modal visibility state
  const [showAddModal, setShowAddModal] = useState(false);

  // Fixed page size for now.
  // Later backend pagination can control this.
  const itemsPerPage = 5;

  // Add new customer to top of table.
  // Later this logic can be replaced by POST API call.
  const handleAddCustomer = (newCustomer) => {
    setCustomers((prev) => [
      {
        id: prev.length + 1,
        ...newCustomer,
      },
      ...prev,
    ]);
    setCurrentPage(1);
  };

  // Filter + sort customers
  // This logic filters the customers based on the search term and status filter, and then sorts them by joined date according to the selected sort order. The filtered and sorted list is then used for pagination and display in the table.
  const filteredCustomers = customers
    .filter((customer) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        customer.id.toString().includes(searchTerm) ||
        customer.name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search) ||
        customer.phone.includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.joinedDate);
      const dateB = new Date(b.joinedDate);

      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

  // Pagination calculations
  // This logic calculates the total number of pages based on the length of the filtered customers and the number of items per page. It also ensures that the current page is within valid bounds, especially when filters are applied that may reduce the number of customers. The paginatedCustomers variable then slices the filtered list to get only the customers that should be displayed on the current page.
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  // Ensure current page is within valid bounds after filtering
  const safeCurrentPage =
    totalPages === 0 ? 1 : Math.min(currentPage, totalPages);

  // Get customers for current page based on pagination
  const paginatedCustomers = filteredCustomers.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage,
  );

  // Utility function to return badge color by status
  // This function takes a customer status as input and returns the appropriate Tailwind CSS classes for the background and text color of the status badge. It uses a switch statement to determine the classes based on the status value (e.g., "Active", "Pending", "Inactive") and provides a default case for any unrecognized status.
  const getStatusClasses = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600";
      case "Pending":
        return "bg-orange-100 text-orange-600";
      case "Inactive":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };


  return (
    // Main container with vertical spacing between sections
    <div className="space-y-6">
      {/* Add Customer modal */}
      {showAddModal && (
        <AddCustomer
          darkMode={darkMode}
          setShowAddModal={setShowAddModal}
          onAddCustomer={handleAddCustomer}
        />
      )}

      {/* Page header */}
      {/* The header section includes the page title, a description, and action buttons for exporting data and adding a new customer. The export button is styled with an icon and changes appearance on hover, while the add customer button opens the modal form when clicked. */}
      <div className="flex items-center justify-between">

        {/* // Page title and description */}
        <div>
          {/* // The page title "Customers" is displayed prominently, with a smaller description below it that provides context about managing customers and their information. The text color of the description changes based on the dark mode setting to ensure readability. */}
          <h1 className="text-2xl font-bold">Customers</h1>
          
          {/* // The description text provides additional context about the page's purpose, which is to manage customers and their information. The text color adapts to the dark mode setting for better visibility. */}
          <p
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            Manage your customers and their information
          </p>
        </div>

        {/* Header action buttons */}
        {/* // The action buttons include an export button and an add customer button. The export button is styled with a download icon and changes appearance on hover, while the add customer button is styled with a plus icon and opens the add customer modal when clicked. Both buttons adapt their styles based on the dark mode setting for consistency with the overall theme of the application. */}
        <div className="flex gap-3">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium shadow-sm border cursor-pointer transition ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {/* // The export button includes a download icon from the lucide-react library and is styled to provide visual feedback on hover. The button's appearance changes based on the dark mode setting to ensure it fits well with the overall theme of the application. When clicked, this button would typically trigger a function to export the customer data, although that functionality is not implemented in this code snippet. */}
            <Download size={16} />
            Export
          </button>

          
          {/* // The add customer button includes a plus icon and is styled to stand out as a primary action. When clicked, it sets the `showAddModal` state to true, which triggers the rendering of the AddCustomer component as a modal form for adding a new customer. The button's styles also adapt to the dark mode setting to maintain visual consistency across the application. */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#0f766e] text-white hover:opacity-90 cursor-pointer"
          >
{/* // The add customer button includes a plus icon from the lucide-react library and is styled to be visually distinct as a primary action. When clicked, it sets the `showAddModal` state to true, which triggers the rendering of the AddCustomer component as a modal form for adding a new customer. The button's appearance is designed to fit well with both light and dark themes, ensuring it remains prominent and easy to find for users who want to add new customers to the list. */}
            <Plus size={16} />
            Add Customer
          </button>
        </div>
      </div>

      {/* Top stats cards */}
      {/* // The stats cards section displays summary information about the customers, such as total customers, active customers, new customers this month, and inactive customers. Each card is styled with a background color and border that adapts to the dark mode setting. The cards are arranged in a responsive grid layout that adjusts based on the screen size, ensuring they look good on both desktop and mobile devices. The text colors also adapt to the dark mode setting for better readability. This section provides users with a quick overview of their customer base at a glance. */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Customers", value: "256" },
          { title: "Active Customers", value: "231" },
          { title: "New This Month", value: "12" },
          { title: "Inactive", value: "25" },
        ].map((item) => (
          <div
            key={item.title}
            className={`p-5 rounded-xl shadow-sm ${
              darkMode
                ? "bg-gray-700 border border-gray-600"
                : "bg-white border border-gray-200 text-black"
            }`}
          >
            {/* // The title of each stats card is displayed in a smaller font size with a medium weight, and the text color adapts to the dark mode setting for better visibility. The value of each stat is displayed prominently in a larger font size with a bold weight, and its color also changes based on the dark mode setting to ensure it stands out against the card's background. This design allows users to quickly identify and understand the key metrics related to their customers. */}
            <p
              className={`text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              {item.title}
            </p>

            {/*// The value of each stat is displayed prominently in a larger font size with a bold weight, and its color also changes based on the dark mode setting to ensure it stands out against the card's background. This design allows users to quickly identify and understand the key metrics related to their customers. The values are currently hardcoded for demonstration purposes, but in a real application, they would be dynamically calculated based on the customer data. */}
            <h2
              className={`text-2xl font-bold mt-2 ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Main table card */}
      {/* // The main table card is a container that holds the search and filter row, the table of customers, and the pagination controls. It is styled with a background color and border that adapt to the dark mode setting, and it has rounded corners and a shadow for visual separation from the background. The card is designed to be responsive, with padding that adjusts based on the screen size to ensure a good user experience on both desktop and mobile devices. This section serves as the primary interface for users to view and manage their customers, providing tools for searching, filtering, sorting, and navigating through the customer data. */}
      <div
        className={`rounded-xl shadow-sm overflow-hidden ${
          darkMode
            ? "bg-gray-700 border border-gray-600 text-white"
            : "bg-white border border-gray-200 text-black"
        }`}
      >
        {/* Search and filter row */}
        {/* // The search and filter row allows users to search for customers by name, email, or phone number, and to filter customers based on their status (e.g., Active, Pending, Inactive). It also includes a dropdown for sorting the customers by their joined date. The search box and filter dropdowns are styled to adapt to the dark mode setting, ensuring they remain visually consistent with the overall theme of the application. This row provides users with powerful tools to quickly find and organize their customer data according to their needs. */}
        <div
          className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border-b ${
            darkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          {/* Search box */}
          <div
            className={`flex items-center px-3 py-2 rounded-lg w-full md:w-80 border ${
              darkMode
                ? "bg-gray-600 border-gray-500"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            {/*// The search box includes a search icon from the lucide-react library and an input field for entering the search term. The input field is styled to be transparent with no outline, allowing it to blend seamlessly with the background of the search box. The text color and placeholder color adapt to the dark mode setting for better visibility. When the user types in the search box, it updates the `searchTerm` state, which is used to filter the list of customers displayed in the table below. This allows users to quickly find specific customers based on their name, email, or phone number. */}
            <Search size={16} className="text-gray-500" />
            
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={`bg-transparent outline-none ml-2 w-full text-sm ${
                darkMode
                  ? "text-white placeholder:text-gray-300"
                  : "text-gray-700 placeholder:text-gray-400"
              }`}
            />
          </div>

          {/* Filter dropdowns */}
         {/* // The filter dropdowns include a status filter and a sort order dropdown. The status filter allows users to filter customers based on their status (e.g., Active, Pending, Inactive), while the sort order dropdown allows users to sort customers by their joined date (e.g., Newest, Oldest). Both dropdowns are styled to adapt to the dark mode setting, ensuring they fit well with the overall theme of the application. When a user selects an option from either dropdown, it updates the corresponding state (`statusFilter` or `sortOrder`), which is then used to filter and sort the list of customers displayed in the table below. This provides users with powerful tools to organize their customer data according to their preferences. */}
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={`px-3 py-2 rounded-lg text-sm bg-transparent border cursor-pointer ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              }`}
            >
             {/*/ The status filter dropdown includes options for filtering customers based on their status. The "All" option allows users to see all customers regardless of their status, while the "Active", "Pending", and "Inactive" options allow users to filter the list to show only customers with the selected status. The dropdown is styled to fit well with both light and dark themes, ensuring it remains visually consistent with the overall design of the application. When a user selects an option from this dropdown, it updates the `statusFilter` state, which is then used to filter the list of customers displayed in the table below. This allows users to quickly narrow down their customer list based on specific criteria. */}
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>

            
            {/*// The sort order dropdown includes options for sorting customers by their joined date. The "Newest" option sorts customers from the most recently joined to the oldest, while the "Oldest" option sorts customers from the oldest to the most recently joined. This allows users to quickly organize their customer list based on when customers joined. The dropdown is styled to fit well with both light and dark themes, ensuring it remains visually consistent with the overall design of the application. When a user selects an option from this dropdown, it updates the `sortOrder` state, which is then used to sort the list of customers displayed in the table below. This provides users with an easy way to view their customers in a preferred order. */}
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              className={`px-3 py-2 rounded-lg text-sm border cursor-pointer ${
                darkMode
                  ? "bg-gray-700 border-gray-500 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              }`}
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* Table header */}
        {/* // The table header defines the columns for the customer data, including ID, Customer Name, Email, Phone, Status, Joined Date, and Actions. The header row is styled with a background color and text color that adapt to the dark mode setting, and it has padding and rounded corners for visual separation from the table body. The column titles are displayed in a smaller font size with a bold weight to distinguish them from the customer data that will be displayed in the rows below. This header provides a clear structure for the customer data and helps users understand what information is being presented in each column of the table. */}
        <div className="px-4 pt-3">
          <div
            className={`grid grid-cols-[60px_2.2fr_2fr_1.6fr_1fr_1.4fr_1fr] px-4 py-3 text-sm font-semibold rounded-lg ${
              darkMode ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            <span>ID</span>
            <span>Customer Name</span>
            <span>Email</span>
            <span>Phone</span>
            <span>Status</span>
            <span>Joined</span>
            <span>Actions</span>
          </div>
        </div>

        {/* Table body */}
        {/* // The table body displays the list of customers based on the current search, filter, and sort settings. Each row represents a customer and includes their ID, name, email, phone number, status (displayed as a badge), joined date, and action buttons for editing, deleting, or viewing details. The rows are styled to have a border at the bottom and change background color on hover for better interactivity. The text colors adapt to the dark mode setting to ensure readability. This section allows users to easily view and manage their customers, with clear options for taking actions on each customer directly from the table. */}
        <div className="px-4 pb-4">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-6 text-gray-500 text-sm">
              No customers found
            </div>
          ) : (
            paginatedCustomers.map((customer) => (
              <div
                key={customer.id}
                className={`grid grid-cols-[60px_2.2fr_2fr_1.6fr_1fr_1.4fr_1fr] items-center px-3 py-2 border-b last:border-b-0 hover:bg-gray-100 rounded-xl transition cursor-pointer ${
                  darkMode
                    ? "border-gray-600 hover:bg-gray-500"
                    : "border-gray-100"
                }`}
              >
                {/* ID */}
              
                {/*  The customer ID is displayed in the first column of the table row. The text color adapts to the dark mode setting to ensure it remains visible against the background. This ID serves as a unique identifier for each customer and can be used for reference when managing customer data or performing actions such as editing or deleting a customer. */}
                <span className={darkMode ? "text-white" : "text-black"}>
                  {customer.id}
                </span>

                {/* Name with avatar */}
                {/* // The customer name is displayed in the second column of the table row, accompanied by a placeholder avatar (a gray circle) to the left of the name. The name is styled with a medium font weight and is truncated if it exceeds the available space to ensure it fits well within the column. The text color adapts to the dark mode setting for better visibility. This design allows users to quickly identify customers by their name while also providing a visual cue with the avatar, which can be replaced with actual profile pictures in a real application. */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-gray-300 rounded-full shrink-0"></div>
                  <span
                    className={`font-medium truncate ${
                      darkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {customer.name}
                  </span>
                </div>

                {/* Email */}
                {/* // The customer's email address is displayed in the third column of the table row. The text is styled to be truncated if it exceeds the available space, ensuring it fits well within the column. The text color adapts to the dark mode setting for better visibility. This allows users to quickly see the email address associated with each customer, which can be useful for communication or reference when managing customer data. */}
                <span
                  className={`truncate ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {customer.email}
                </span>

                {/* Phone */}
                {/* // The customer's phone number is displayed in the fourth column of the table row. The text color adapts to the dark mode setting for better visibility. This allows users to quickly see the contact information for each customer, which can be useful for communication or reference when managing customer data. The phone number is displayed in a standard format, making it easy for users to recognize and use when needed. */}
                <span className={darkMode ? "text-gray-300" : "text-gray-500"}>
                  {customer.phone}
                </span>

                {/* Status badge */}
                {/* // The customer's status is displayed in the fifth column of the table row as a badge. The badge is styled with a background color and text color that correspond to the customer's status (e.g., green for Active, orange for Pending, red for Inactive). The text is displayed in a smaller font size with a bold weight, and the badge has padding and rounded corners for better visual appeal. This allows users to quickly identify the status of each customer at a glance, which can be helpful for managing customer relationships and prioritizing actions based on their status. The getStatusClasses function is used to determine the appropriate styles for the badge based on the customer's status. */}
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full w-fit ${getStatusClasses(
                    customer.status,
                  )}`}
                >
                  {customer.status}
                </span>

                {/* Joined date */}
                {/* // The date when the customer joined is displayed in the sixth column of the table row. The date is formatted to a more readable format using the `toLocaleDateString` method, which converts the date string into a localized date format. The text color adapts to the dark mode setting for better visibility. This allows users to quickly see when each customer joined, which can be useful for tracking customer history and understanding their relationship with the business. The joined date provides context about how long a customer has been associated with the company, which can be helpful for making informed decisions when managing customer data. */}
                <span className={darkMode ? "text-gray-300" : "text-gray-500"}>
                  {new Date(customer.joinedDate).toLocaleDateString()}
                </span>

                {/* Row action buttons */}
                {/* // The action buttons for each customer are displayed in the last column of the table row. These buttons include options for editing, deleting, and viewing details of the customer. Each button is styled with a background color and text color that correspond to its function (e.g., green for edit, red for delete, blue for view). The buttons have padding and rounded corners for better visual appeal, and they change appearance on hover to provide visual feedback to the user. This allows users to quickly take actions on each customer directly from the table, making it easier to manage customer data efficiently. The icons used in the buttons are from the lucide-react library, providing a clear visual representation of each action. */}
                <div className="flex items-center gap-2 justify-start">
                  <button className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 cursor-pointer">
                    <Pencil size={16} />
                  </button>
                  <button className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                  <button className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {/* // The pagination controls are displayed at the bottom of the table card, allowing users to navigate through multiple pages of customer data. The controls include a display of the current range of customers being shown (e.g., "Showing 1 to 5 of 256 customers") and buttons for navigating to the previous and next pages, as well as buttons for directly accessing specific pages. The buttons are styled to adapt to the dark mode setting and provide visual feedback on hover. The previous and next buttons are disabled when the user is on the first or last page, respectively, to prevent invalid navigation. This pagination system helps users manage large lists of customers by breaking them into manageable chunks and providing easy navigation between them. */}
        <div
          className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-4 border-t ${
            darkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          <p
            className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}
          >
            Showing{" "}
            <span className="font-medium">
              {filteredCustomers.length === 0
                ? 0
                : (safeCurrentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                safeCurrentPage * itemsPerPage,
                filteredCustomers.length,
              )}
            </span>{" "}
            of <span className="font-medium">{filteredCustomers.length}</span>{" "}
            customers
          </p>

          
          {/* // The pagination buttons include "Previous" and "Next" buttons for navigating between pages, as well as buttons for directly accessing specific pages. The "Previous" button is disabled when the user is on the first page, and the "Next" button is disabled when the user is on the last page or when there are no customers to display. The page number buttons are generated dynamically based on the total number of pages, and the current page is highlighted to indicate which page the user is currently viewing. The buttons are styled to adapt to the dark mode setting and provide visual feedback on hover, making it easy for users to navigate through their customer data efficiently. */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={safeCurrentPage === 1}
              className={`px-3 py-2 rounded-lg text-sm border transition ${
                safeCurrentPage === 1
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

            
            {/* // The page number buttons are generated dynamically based on the total number of pages calculated from the filtered customer list. Each button displays the page number and allows users to jump directly to that page when clicked. The current page is highlighted with a different background color and text color to indicate which page the user is currently viewing. The buttons are styled to adapt to the dark mode setting, ensuring they fit well with the overall theme of the application. This dynamic generation of page buttons provides users with an easy way to navigate through their customer data, especially when dealing with a large number of customers that span multiple pages. */}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition cursor-pointer ${
                    safeCurrentPage === page
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

            {/* Next button */}
           {/* // The "Next" button allows users to navigate to the next page of customer data. It is disabled when the user is on the last page or when there are no customers to display, preventing invalid navigation. The button is styled to adapt to the dark mode setting and provides visual feedback on hover, making it easy for users to continue navigating through their customer data efficiently. This button, along with the "Previous" button and page number buttons, forms a complete pagination system that helps users manage large lists of customers effectively. */}
            <button
              // Disable next button if we're on the last page or if there are no customers
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))
              }
              disabled={safeCurrentPage === totalPages || totalPages === 0}
              className={`px-3 py-2 rounded-lg text-sm border transition ${
                safeCurrentPage === totalPages || totalPages === 0
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
