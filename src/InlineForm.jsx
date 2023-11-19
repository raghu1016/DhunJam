import React, { useState } from "react";
import "./InlineForm.css"; // Import a separate CSS file for styling

const InlineForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("male");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic, e.g., send data to the server or update state
    console.log("Form submitted with values:", { name, email, gender });
    // Reset the form fields after submission
    setName("");
    setEmail("");
    setGender("male");
  };

  return (
    <form onSubmit={handleSubmit} className="inline-form">
      <h1>Hello</h1>
      <div className="form-group">
        <label htmlFor="name" className="inline-label">
          Do you want to charge your customers for requesting songs?
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
          className="inline-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="email" className="inline-label">
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          className="inline-input"
        />
      </div>
      <div className="form-group">
        <label className="inline-label">Gender:</label>
        <label>
          <input
            type="radio"
            value="male"
            checked={gender === "male"}
            onChange={handleGenderChange}
          />
          Male
        </label>
        <label>
          <input
            type="radio"
            value="female"
            checked={gender === "female"}
            onChange={handleGenderChange}
          />
          Female
        </label>
      </div>
      <button type="submit" className="inline-button">
        Submit
      </button>
    </form>
  );
};

export default InlineForm;
