import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";

function Profile() {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { notifications, setNotifications } = useStateContext();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosClient.get("/user1");
        setPhotoPreview(data.avatar);
        setName(data.name);
        setEmail(data.email);
        setNotifications(["Bienvenue"]);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(file);
        setPhotoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!photo) {
      console.error("No avatar selected");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", photo);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await axiosClient.post("/user/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        const responseData = response.data;
        setPhotoPreview(responseData.avatar);
        console.log("Avatar uploaded successfully!");
        window.location.reload();
      } else {
        console.error("Failed to upload avatar");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordError(
        "Password must be at least 8 characters long, contain at least one uppercase letter, and one symbol."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleCancel = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="px-4 h-screen  py-2">
      <form
        onSubmit={handleFormSubmit}
        className="profile-form w-96 rounded-lg shadow-md overflow-hidden"
      >
        <div className="profile-header dark:bg-slate-900 dark:bg-opacity-30 bg-gray-100 bg-opacity-70 p-6 flex items-center">
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Profile Picture"
              className="profile-picture h-20 w-20 rounded-full mr-4 object-cover"
            />
          )}
          <div className="flex-grow">
            <h2 className="text-xl font-semibold dark:text-white text-gray-800 mb-2">
              Profile Information
            </h2>
          </div>
        </div>
        <div className="profile-body px-6 py-2">
          <div className="mb-3">
            <div className="p-6">
              <div>
                <label
                  htmlFor="photo"
                  className="block text-sm dark:text-gray-300 font-medium text-gray-700"
                >
                  Photo
                </label>
                <div className="flex items-center mt-1">
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Profile"
                      className="h-12 w-12 rounded-full"
                    />
                  )}
                  <label className="ml-4 cursor-pointer bg-white py-2 px-4 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Upload
                    <input
                      id="file-upload"
                      name="avatar"
                      type="file"
                      className="sr-only"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="mb-3 mx-6">
              <label
                htmlFor="name"
                className="block text-sm dark:text-gray-300 font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 px-2 font-thin py-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={name}
                placeholder="Change new name"
                onChange={handleNameChange}
              />
            </div>
            <div className="mb-3 mx-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium dark:text-gray-300 text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 px-2 py-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={email}
                placeholder="change new email"
                onChange={handleEmailChange}
              />
            </div>
            <div className="mb-6 mx-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium dark:text-gray-300 text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 px-2 py-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={password}
                placeholder="change new password"
                onChange={handlePasswordChange}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
            <div className="border-t pt-6">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-white py-2 px-4 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 py-2 px-4 text-center text-white rounded-md shadow-sm sm:text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:offset-2 focus:ring-indigo-500"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Profile;
