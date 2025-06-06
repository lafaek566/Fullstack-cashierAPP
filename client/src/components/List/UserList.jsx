import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    role: "",
    password: "",
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5002/users");
      // Format the created_at field
      const formattedUsers = response.data.map((user) => ({
        ...user,
        created_at: new Date(user.created_at).toLocaleString(), // Format the date
      }));
      setUsers(formattedUsers);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users on initial render

    const intervalId = setInterval(fetchUsers, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setFormData({ username: user.username, role: user.role, password: "" });
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5002/users/${id}`);
        setUsers(users.filter((user) => user.id !== id));
      } catch (err) {
        setError("Failed to delete user.");
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update existing user
        const updatedUser = {
          username: formData.username,
          role: formData.role,
        };

        if (formData.password) {
          updatedUser.password = formData.password;
        }

        const response = await axios.put(
          `http://localhost:5002/users/${editingUser}`,
          updatedUser
        );

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === editingUser ? { ...user, ...response.data } : user
          )
        );
      } else {
        // Add new user
        const newUser = {
          username: formData.username,
          role: formData.role,
          password: formData.password,
        };

        const response = await axios.post(
          "http://localhost:5002/users",
          newUser
        );
        setUsers((prevUsers) => [
          ...prevUsers,
          { ...response.data, created_at: new Date().toLocaleString() },
        ]); // Add new user to the list with formatted date
      }

      setEditingUser(null);
      setFormData({ username: "", role: "", password: "" });
    } catch (err) {
      setError("Failed to save user.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>User List</h1>

      {/* User Form */}
      <form onSubmit={handleSubmit}>
        <h2>{editingUser ? "Edit User" : "Add User"}</h2>
        <div>
          <h3>Username:</h3>
          <input
            type="text"
            name="username"
            placeholder="enter name"
            value={formData.username}
            onChange={handleFormChange}
            required
          />
        </div>
        <div>
          <h3>Role:</h3>
          <select
            name="role"
            value={formData.role}
            onChange={handleFormChange}
            required
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Kasir">Kasir</option>
          </select>
        </div>
        <div>
          <h3>Password:</h3>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleFormChange}
            placeholder="enter password"
          />
        </div>
        <h3>Add New User</h3>
        <button className="mt-10" type="submit">
          {editingUser ? "Update User" : "Add User"}
        </button>
        {editingUser && (
          <button type="button" onClick={() => setEditingUser(null)}>
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{user.created_at}</td>
              <td>
                <button onClick={() => handleEditClick(user)}>Edit</button>
                <button onClick={() => handleDeleteClick(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
