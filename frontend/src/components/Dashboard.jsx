import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    password: '',
    credits: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch('http://localhost:5000/userProfile');
      const data = await response.json();
      setProfile(data);
      setFormValues({
        name: data.name,
        email: data.email,
        password: data.password,
      });
    };

    fetchProfile();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    const response = await fetch('http://localhost:5000/userProfile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formValues),
    });

    const updatedProfile = await response.json();
    setProfile(updatedProfile);
    setIsEditing(false); // Exit edit mode
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">User Dashboard</h1>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              className="border p-2 rounded w-full"
              value={formValues.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="border p-2 rounded w-full"
              value={formValues.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="border p-2 rounded w-full"
              value={formValues.password}
              onChange={handleInputChange}
            />
          </div>
          <button
            onClick={handleUpdateProfile}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Password:</strong> {profile.password}</p>
          <p><strong>Credits:</strong> {profile.credits}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-500 text-white py-2 px-4 rounded"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
