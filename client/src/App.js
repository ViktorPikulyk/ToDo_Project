import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"

import Navbar from "./components/navbar.component"
import ToDoList from "./components/todolist.component"
import Profile from "./components/profile.component"
import Login from "./components/login.component"
import CreateToDo from "./components/create.component"
import EditToDo from "./components/edit.component"
import Register from "./components/register.component"
import Refresh from "./components/refresh.component"
import EditList from "./components/editlist.component"

function App() {
  return (
    <Router>
      <Navbar />
      <br/>
      <Route path="/" mode = {0} exact component={ToDoList}/>
      <Route path="/editlist" mode = {0} exact component={EditList}/>
      <Route path="/login" exact component={Login}/>
      <Route path="/register" exact component={Register}/>
      <Route path="/profile" exact component={Profile}/>
      <Route path="/create" exact component={CreateToDo}/>
      <Route path="/edit" EditID = {0} exact component={EditToDo}/>
      <Route path="/refresh" exact component={Refresh}/>
    </Router>
  );
}

export default App;
