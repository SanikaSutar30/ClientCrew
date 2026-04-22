let users = JSON.parse(localStorage.getItem("users")) || [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "+91 9876543210",
    role: "Admin",
    status: "Active",
    joinedDate: "2026-01-12",
    image: "../assets/Profile.jpg",
  },
  {
    id: 2,
    name: "Priya Singh",
    email: "priya@gmail.com",
    phone: "+91 9123456780",
    role: "Manager",
    status: "Active",
    joinedDate: "2026-02-04",
    image: "../assets/Profile2.jpg",
  },
];

const saveToStorage = () => {
  localStorage.setItem("users", JSON.stringify(users));
};

export const getAllUsers = () => {
  return [...users];
};

export const getUserById = (id) => {
  const user = users.find((user) => user.id === id);
  return user ? { ...user } : null;
};

export const addUser = (newUser) => {
  const userWithId = {
    ...newUser,
    id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
  };

  users = [userWithId, ...users];
  saveToStorage();
  return userWithId;
};

export const updateUser = (updatedUser) => {
  let updated = false;

  users = users.map((user) => {
    if (user.id === updatedUser.id) {
      updated = true;
      return updatedUser;
    }
    return user;
  });

  if (updated) {
    saveToStorage();
    return updatedUser;
  }

  return null;
};

export const deleteUser = (id) => {
  const initialLength = users.length;

  users = users.filter((user) => user.id !== id);

  if (users.length < initialLength) {
    saveToStorage();
    return true;
  }

  return false;
};
