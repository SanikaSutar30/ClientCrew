let customers = JSON.parse(localStorage.getItem("customers")) || [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "+91 9876543210",
    status: "Active",
    joinedDate: "2024-01-12",
    image: "../assets/Profile.jpg",
  },
  {
    id: 2,
    name: "Amit Patil",
    email: "amit@gmail.com",
    phone: "+91 9123456789",
    status: "Active",
    joinedDate: "2024-02-03",
    image: "../assets/Profile2.jpg",
  },
  {
    id: 3,
    name: "Priya Singh",
    email: "priya@gmail.com",
    phone: "+91 9988776655",
    status: "Pending",
    joinedDate: "2024-03-18",
    image: "../assets/Profile3.jpg",
  },
  {
    id: 4,
    name: "John Doe",
    email: "john@gmail.com",
    phone: "+91 8877655443",
    status: "Inactive",
    joinedDate: "2024-04-02",
    image: "../assets/Profile4.jpg",
  },
  {
    id: 5,
    name: "Neha Verma",
    email: "neha@gmail.com",
    phone: "+91 9284711223",
    status: "Active",
    joinedDate: "2024-04-10",
    image: "../assets/Profile5.jpg",
  },
  {
    id: 6,
    name: "Suresh Reddy",
    email: "suresh@gmail.com",
    phone: "+91 9032144556",
    status: "Active",
    joinedDate: "2024-05-22",
    image: "../assets/Profile6.jpg",
  },
];

const saveToStorage = () => {
  localStorage.setItem("customers", JSON.stringify(customers));
};

export const getAllCustomers = () => {
  return [...customers];
};

export const getCustomerById = (id) => {
  const customer = customers.find((customer) => customer.id === id);
  return customer ? { ...customer } : null;
};

export const addCustomer = (newCustomer) => {
  const customerWithId = {
    ...newCustomer,
    id: customers.length ? Math.max(...customers.map((c) => c.id)) + 1 : 1,
  };

  customers = [customerWithId, ...customers];
  saveToStorage();
  return customerWithId;
};

export const updateCustomer = (updatedCustomer) => {
  let updated = false;

  customers = customers.map((customer) => {
    if (customer.id === updatedCustomer.id) {
      updated = true;
      return updatedCustomer;
    }
    return customer;
  });

  if (updated) {
    saveToStorage();
    return updatedCustomer;
  }

  return null;
};

export const deleteCustomer = (id) => {
  const initialLength = customers.length;

  customers = customers.filter((customer) => customer.id !== id);

  if (customers.length < initialLength) {
    saveToStorage();
    return true;
  }

  return false;
};
