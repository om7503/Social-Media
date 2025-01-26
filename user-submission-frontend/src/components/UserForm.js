import React, { useState } from "react";
import axios from "axios";
import "./styles.css"; // Import the CSS

const UserForm = () => {
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("handle", handle);

    // Append each image to FormData
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      // Send formData to the backend
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data); // Show success message
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h2>User Submission Form</h2>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
          // After handling the submit, let the form refresh the page
        }}
      >
        <input
          type="text"
          className="input-field"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="input-field"
          placeholder="Enter your social media handle"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        />
        <input
          type="file"
          className="input-field"
          multiple
          onChange={handleImageUpload}
        />
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserForm;
