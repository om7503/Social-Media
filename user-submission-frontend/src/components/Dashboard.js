import React, { useEffect, useState } from 'react';
import './styles.css'; // Import the CSS

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch data from the backend API
    // Replace with actual API call
    setUsers([
      { name: 'John Doe', handle: '@john_doe', images: ['/path/to/img1.jpg', '/path/to/img2.jpg'] },
      { name: 'Jane Smith', handle: '@jane_smith', images: ['/path/to/img3.jpg'] },
    ]);
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      {users.map((user, index) => (
        <div className="user-item" key={index}>
          <div className="user-info">
            <h3>{user.name}</h3>
            <p>{user.handle}</p>
          </div>
          <div className="user-images">
            {user.images.map((image, idx) => (
              <img
                key={idx}
                src={image}
                alt={`Uploaded by ${user.name}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
