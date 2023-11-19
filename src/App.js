import "./styles.css";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "./InlineForm.css";

const intiuser = {
  username: "",
  password: ""
};
const App = () => {
  const [loggedIn, setLoggedIn] = useState(true);
  const [id, setId] = useState(4);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [chargeCustomers, setChargeCustomers] = useState(false);
  const [customAmount, setCustomAmount] = useState(100);
  const [regularAmounts, setRegularAmounts] = useState([80, 60, 40, 20]);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [user, setUser] = useState(intiuser);

  useEffect(() => {
    // Fetch data from API when the component mounts
    if (loggedIn && id) {
      axios
        .get(`https://stg.dhunjam.in/account/admin/${id}`)
        .then((response) => {
          console.log(response.data);
          const { data } = response.data;
          setName(data.name);
          setLocation(data.location);
          setChargeCustomers(data.charge_customers);
          setCustomAmount(data.amount.category_6);
          setRegularAmounts([
            data.amount.category_7,
            data.amount.category_8,
            data.amount.category_9,
            data.amount.category_10
          ]);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [loggedIn, id]);

  const handleLogin = () => {
    console.log(user);
    if (user.username === null || user.password === null) {
      console.log(user);
      return null;
    }
    // {
    //   "username": "DJ@4",
    //   "password": "Dhunjam@2023"
    //  }

    axios
      .post("https://stg.dhunjam.in/account/admin/login", {
        username: "DJ@4",
        password: "Dhunjam@2023"
      })
      .then((response) => {
        const { data } = response.data;
        console.log(response);
        console.log(response.data);
        setLoggedIn(true);
        setId(data.id);
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  const handleSave = () => {
    // Perform save logic and update prices
    axios
      .put(`https://stg.dhunjam.in/account/admin/${id}`, {
        amount: {
          category_6: customAmount
        }
      })
      .then((response) => {
        const { data } = response.data;
        setCustomAmount(data.amount.category_6);
        setRegularAmounts([
          data.amount.category_7,
          data.amount.category_8,
          data.amount.category_9,
          data.amount.category_10
        ]);
        setSaveButtonDisabled(true);
      })
      .catch((error) => {
        console.error("Save failed:", error);
      });
  };

  const handleCustomAmountChange = (value) => {
    setCustomAmount(value);
    setSaveButtonDisabled(value <= 99);
  };

  const handleRegularAmountChange = (index, value) => {
    const updatedRegularAmounts = [...regularAmounts];
    updatedRegularAmounts[index] = value;
    setRegularAmounts(updatedRegularAmounts);
    setSaveButtonDisabled(
      updatedRegularAmounts.some((amount) => amount < [79, 59, 39, 19][index])
    );
  };

  const handleNameChange = (username) => {
    setUser((prevUser) => {
      return {
        ...prevUser,
        [username]: event.target.value
      };
    });
  };

  const handlePasswordChange = (password) => {
    setUser((prevUser) => {
      return {
        ...prevUser,
        [password]: event.target.value
      };
    });
  };

  const renderGraph = () => {
    if (!chargeCustomers) {
      return null;
    }
    const chartData = {
      labels: [
        "Custom",
        "Category 1",
        "Category 2",
        "Category 3",
        "Category 4"
      ],
      datasets: [
        {
          label: "Song Requests",
          backgroundColor: "F0C3F1",
          borderColor: "rgba(240,195,241,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(240,195,241,0.8)",
          hoverBorderColor: "rgba(240,195,241,1)",
          outerHeight: "1000px",
          data: [customAmount, ...regularAmounts]
        }
      ]
    };

    const chartOptions = {
      scales: {
        x: {
          type: "category",
          labels: [
            "Custom",
            "Category 1",
            "Category 2",
            "Category 3",
            "Category 4"
          ]
        },
        y: {
          beginAtZero: true
        }
      }
    };

    return (
      <div>
        <Bar data={chartData} options={chartOptions} />
      </div>
    );
  };

  return (
    <>
      <div className="App">
        {!loggedIn ? (
          <form className="inline-form-login">
            <h1 style={{ fontSize: "32px" }}>Login</h1>
            <div className="form-group-login">
              <input
                type="text"
                placeholder="username"
                className="inline-input"
                onChange={() => handleNameChange("username")}
              />
            </div>
            <div className="form-group-login">
              <input
                type="password"
                placeholder="password"
                className="inline-input"
                onChange={() => handlePasswordChange("password")}
              />
            </div>
            <button
              type="submit"
              className="inline-button-login"
              onClick={handleLogin}
            >
              Sign in
            </button>
            <p>New Registration?</p>
          </form>
        ) : (
          <form className="inline-form">
            <h1>
              {name},{location}
            </h1>
            <div className="form-group">
              <label className="inline-label">
                Do you want to charge your customers for requesting songs?
              </label>
              <label>
                <input
                  type="radio"
                  value="true"
                  checked={chargeCustomers}
                  onChange={() => setChargeCustomers(true)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  value="false"
                  checked={!chargeCustomers}
                  onChange={() => setChargeCustomers(false)}
                />
                No
              </label>
            </div>
            {chargeCustomers && (
              <>
                <div className="form-group">
                  <label htmlFor="name" className="inline-label">
                    Custom song request amount
                  </label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="inline-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="inline-label">
                    Regular song request amounts
                  </label>
                  {regularAmounts.map((amount, index) => (
                    <input
                      key={index}
                      type="number"
                      value={amount}
                      onChange={(e) =>
                        handleRegularAmountChange(index, e.target.value)
                      }
                      className="inline-input"
                      style={{ width: "46px" }}
                    />
                  ))}
                </div>
              </>
            )}
            {renderGraph()}
            <button
              type="submit"
              className="inline-button"
              disabled={saveButtonDisabled}
              onClick={handleSave}
            >
              Save
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default App;
