import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import { useNavigate } from "react-router-dom";
import { Card, Typography } from "@material-tailwind/react";

import { useSpring, animated } from "react-spring";
function AuthorizedUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const fadeAnim = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  const getUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/users");
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteClick = async (user) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosClient.delete(`/users/${user.id}`);
        setNotification("User was successfully deleted");
        getUsers();
        navigate(".", { replace: true });
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    let error = {};

    if (!formData.name) {
      error.name = "Name is required";
    } else if (typeof formData.name !== "string") {
      error.name = "Name must be a string";
    }

    if (!formData.email) {
      error.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      error.email = "Invalid email format";
    }

    setErrors(error);
    return Object.keys(error).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        await axiosClient.post("/users", formData);
        setNotification("User created successfully!");
        setFormData({ name: "", email: "", department: "", role: "" });
        setErrors({});
        setShowForm(false);

        // Fetch the updated list of users after adding a new user
        getUsers();

        alert("User added successfully!");
      } catch (error) {
        console.error("Error creating user:", error);
        alert("Error creating user. Please try again.");
      }
    }
  };

  const handleAddClick = () => {
    setShowForm(!showForm);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <div className="flex flex-col  md:flex-row justify-between items-center mb-5">
        <h1 className="text-2xl pl-4 font-bold mt-2">Authorized users</h1>
        <button
          className="btn-add mb-3 md:mb-0 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={handleAddClick}
        >
          {showForm ? "Close Form" : "Add new"}
        </button>
      </div>

      {showForm && (
        <div className=" rounded mb-8 p-4 shadow-md w-full ">
          <p className="text-red-500 text-xs font-bold mb-2">
            **Attention :** L'ajout d'un utilisateur confère des droits d'accès
            au système.
          </p>{" "}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col md:flex-row md:space-x-6 mb-4 w-3/5">
              <div className="flex flex-col mb-4 md:w-1/2">
                <label
                  htmlFor="name"
                  className="dark:text-gray-300 font-bold mb-2"
                >
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`border border-gray-300 text-gray-900 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div className="flex flex-col mb-4 md:w-1/2">
                <label
                  htmlFor="email"
                  className="dark:text-gray-300 font-bold mb-2"
                >
                  Email:
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`border border-gray-300 text-gray-900 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:space-x-6 mb-4 w-3/5">
              <div className="flex flex-col mb-4 md:w-1/2">
                <label
                  htmlFor="department"
                  className="dark:text-gray-300 font-bold mb-2"
                >
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="px-4 py-2 mt-2 text-gray-900 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  required
                >
                  <option value="" disabled defaultValue>
                    Select department
                  </option>
                  <option value="web">Web</option>
                  <option value="mobile">Mobile</option>
                  <option value="security">Security</option>
                </select>
              </div>
              <div className="flex flex-col mb-4 md:w-1/2">
                <label
                  htmlFor="role"
                  className="dark:text-gray-300 font-bold mb-2"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="px-4 py-2 mt-2 text-gray-900 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  required
                >
                  <option value="" disabled defaultValue>
                    Select role
                  </option>
                  <option value="chef">Chef</option>
                  <option value="member">Member</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add Authorized user
            </button>
          </form>
        </div>
      )}

      <div className="user-table  card animated fadeInDown">
        <Card className="h-full w-full bg-white bg-opacity-35 ">
          <table className="w-full  min-w-max table-auto text-left">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Name
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Email
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Department
                  </Typography>
                </th>

                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Create Date
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Actions
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="text-center">
                  <td colSpan="7">Loading...</td>
                </tr>
              ) : (
                users.map((u) => (
                  <animated.tr
                    key={u.id}
                    style={fadeAnim}
                    className="even:bg-blue-gray-50/50"
                  >
                    <td className="p-4">{u.name}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">{u.department}</td>
                    <td className="p-4">{u.created_at}</td>
                    <td className="p-4">
                      <button
                        className="btn-delete bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded ml-2"
                        onClick={() => onDeleteClick(u)}
                      >
                        Delete
                      </button>
                    </td>
                  </animated.tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

export default AuthorizedUser;
