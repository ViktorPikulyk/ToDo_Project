import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { getJwt } from '../helpers/jwt';
import jwt_decode from 'jwt-decode';

export default class Navbar extends Component {

  constructor(props) {
    super(props);
    this.changeMode = this.changeMode.bind(this);

    this.state = {
      signStatus: false,
      redirect: false,
      setMode: 0
    }
  }

  signOut = (e) => {
    e.preventDefault();

    localStorage.clear();
    document.location.reload(true);
  }

  handleOnClick = () => {
    this.setState({
      redirect: true
    })
  }

  changeMode = (e) => {
    e.preventDefault();
    this.setState({
      setMode: e.target.value
    })
    this.handleOnClick();
  }

  render() {
    let redirector;
    if (this.state.redirect) {
      redirector =  <Redirect to={{
        pathname: '/',
        mode: this.state.setMode
      }} />
      this.setState({
        redirect: false
      })
    } 

    let logButton;
    let logName;
    let plusButton;
    let editButton;
    let ranger;
    if(getJwt()){
    logName = `${jwt_decode(getJwt()).name}`
    logButton = <Link to="/" id="logButton" onClick={this.signOut} className="btn btn-light my-2 my-sm-0">Вийти</Link>
    plusButton = <Link to="/create" id="plusButton" className="navbar-brand">+</Link>
    editButton = <Link to="/editlist" id="editButton" className="navbar-brand"><img id="eButtonI" alt="I" src={process.env.PUBLIC_URL + '/img/pencil-alt-solid.svg'}></img></Link>
    ranger = <div className="text-center">
                <input type="range" style={{"marginTop":"20px"}} defaultValue={0} onChange={this.changeMode} className="custom-range" min="0" max="2" id="customRange2"/>
             </div>
    }else logButton = <Link to="/" id="logButtonI" className="btn btn-light my-2 my-sm-0">Увійти</Link>
    return (
      <nav id="navnav" className="navbar navbar-dark navbar-expand-lg">
        <Link to="/" id="brand" className="navbar-brand">
        <img src={require("../logo.png")} style={{"marginTop":"-10px"}} width="54" height="44" alt=""/>
          ToDo
        </Link>
        {plusButton}
        {editButton}
        <div className="collpase navbar-collapse">
        {ranger}
        <ul className="navbar-nav ml-auto">
          <Link to="/profile" id="namer" className="navbar-text mr-sm-4">{logName}</Link>
          <li className="navbar-item">
            {logButton}
          </li>
        </ul>
        </div>
        {redirector}
      </nav>
    );
  }
}