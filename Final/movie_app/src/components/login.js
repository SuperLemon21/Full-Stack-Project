import React, { Component } from "react";
import { NavLink } from 'react-router-dom';
import "../App.css";
import Header from "./header";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accounts: [],
      username: "",
      password: "",
      redirect: false,
    };

    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);

    this.handleSignIn = this.handleSignIn.bind(this);
  }

  componentDidMount = () => {
    fetch("http://localhost:3001/", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((result) =>
        this.setState({ accounts: result }, () => {
          // Adds all the reviews to a session variable
          let list = [];
          this.state.accounts.forEach((account) => {
            if (account.reviews.length > 0) {
              account.reviews.forEach(review => {
                review.username = account.username;
                list.push(review);
              });
            }
          });
          sessionStorage.setItem("reviews", JSON.stringify(list));
        })
      )
      .catch((e) => console.log(e));
  };

  updateUsername = (evt) => {
    this.setState({ username: evt.target.value });
  };
  updatePassword = (evt) => {
    this.setState({ password: evt.target.value });
  };

  handleSignIn = () => {
    let data = {
      username: `${this.state.username}`,
      password: `${this.state.password}`,
    };

    fetch("http://localhost:3001/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status) {
          this.setState({ redirect: true }, () => {
            sessionStorage.setItem("user", JSON.stringify(result.account));
            this.setState({ redirect: true });
          });
        } else {
          console.log("Incorrect Credentials.");
        }
      });
  };

  render() {
    let afterLoggedIn;
    let beforeLoggedIn = (
      <div>
        <label htmlFor="username">Username </label>
        <input type="text" name="username" onChange={this.updateUsername} />
        <br />
        <label htmlFor="password">Password </label>
        <input type="password" name="password" onChange={this.updatePassword} />
        <br />
        <input type="submit" value="Submit" onClick={this.handleSignIn} />
      </div>
    );

    if (this.state.redirect || sessionStorage.getItem("user")) {
      beforeLoggedIn = <p></p>;
      afterLoggedIn = <a href="/movies">Visit Movie Page!</a>;
    }

    return (
      <>
        <Header />
        <br />
        <div className="login-container">
          <div className="login-form">
            {beforeLoggedIn}
            {afterLoggedIn}
            <p>agustind</p>
            <p>UoNt-Kvx2</p>
            <div className='personality-container'>
              <h1>
                This website is for all shapes and sizes! Male and females as well as anything 
                in between are welcome to view our website!
              </h1>
              <h1>
                Handmade by the Grunts at Neumont
              </h1>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Login;
