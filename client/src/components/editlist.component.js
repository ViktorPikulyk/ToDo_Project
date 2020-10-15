import React, { Component } from 'react';
import { getJwt } from '../helpers/jwt';
import jwt_decode from 'jwt-decode';
import { Redirect } from 'react-router-dom';
import Moment from 'moment';
import { Link } from 'react-router-dom';



export default class EditList extends Component {

    constructor(props) {
      super(props);

      this.fetchTodos = this.fetchTodos.bind(this);
      this.onButtonPress = this.onButtonPress.bind(this);

        this.state = {
          todos: [{}],
          doRefresh: false
        }
      }


    fetchTodos() {
      const jwt = getJwt();
      if(!jwt) {
          this.props.history.push('/login')
      }else{
      const decoded = jwt_decode(jwt)
      fetch(`/users/${decoded.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'headers',
            'Authorization': `bearer ${jwt}`
          }
        }).then(r =>  r.json().then(data => ({status: r.status, body: data})))
        .then(obj => {if(obj.body.todos)this.setState({todos: obj.body.todos});})
        .catch(e => {if (e instanceof SyntaxError){localStorage.removeItem('myjwt'); this.props.history.push('/login')}});
      }
    }

    componentDidMount(){
      this.fetchTodos();
    }

    onButtonPress(e, id){
      e.preventDefault();
      const jwt = getJwt();

      fetch(`/api/todos/${this.state.todos[id].id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${jwt}`,
        }
      }).then(() => this.setState(() => ({
        doRefresh: true
      })))
    }

    onCompleteChange = (e, id) => {

      const jwt = getJwt();

      const decoded = jwt_decode(jwt)
      fetch(`/users/${decoded.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'headers',
            'Authorization': `bearer ${jwt}`
          }
        })     

      const todo = {
          date: this.state.todos[id].date,
          title: this.state.todos[id].title,
          description: this.state.todos[id].description,
          priority: this.state.todos[id].priority,
          isCompleted: !this.state.todos[id].isCompleted
      }

      fetch(`/api/todos/${this.state.todos[id].id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${jwt}`,
          },
          body: JSON.stringify(todo)
      })
      // .then(this.props.history.push('/refresh'))
      .then(this.fetchTodos())

    };
    

    render() {
      if (this.state.doRefresh === true) {
        return <Redirect to='/refresh' />
      }

      let mode = 0;

      if(this.props.location.mode){
        mode = this.props.location.mode
      }

      function compare( a, b ) {
        if ( a.date < b.date ){
          return -1;
        }
        if ( a.date > b.date ){
          return 1;
        }
        return 0;
      }

      var items = ["rgba(63, 131, 191, 0.74)", "rgba(63, 131, 191, 0.54)", "rgba(63, 131, 191, 0.44)", "rgba(63, 131, 191, 0.34)", "rgba(63, 131, 191, 0.24)"];
      var itemsGreen = ["rgba(63, 191, 63, 0.7)", "rgba(63, 191, 63, 0.6)", "rgba(63, 191, 63, 0.5)", "rgba(63, 191, 63, 0.4)", "rgba(63, 191, 63, 0.3)"];
      var itemsRed = ["rgba(193, 66, 66, 0.8)", "rgba(193, 66, 66, 0.7)", "rgba(193, 66, 66, 0.6)", "rgba(193, 66, 66, 0.5)", "rgba(193, 66, 66, 0.4)", "rgba(193, 66, 66, 0.3)"];

      this.state.todos.sort( compare );

      const listItems = this.state.todos.map((obj, i) =>
        <li id="todoItem" className="list-group-item col-12 list-group-item-action" key={i}> 
        <p id="expM">{'!'.repeat(obj.priority)}</p>
        <p data-toggle="tooltip" className="text-truncate" data-placement="right" title={obj.description} id="itemTitleE">{obj.title}</p> 
        <Link id="eButton" value={i} to={{
          pathname: '/edit',
          state: {
            EditID: obj.id
          }
        }}><img id="eButtonI" alt="I" src={process.env.PUBLIC_URL + '/img/pencil-alt-solid.svg'}></img></Link>  
        <button value={i} onClick={e => this.onButtonPress(e, i)} id="xButton"><img alt="X" id="xButtonI" src={process.env.PUBLIC_URL + '/img/trash-alt-solid.svg'}></img></button></li>
      );

      let listHItems = [];
      let today = '';
      let colorI = 0;

      let modeB;
      switch(mode){
        case "0":
          modeB = 0
          break;
        case "1":
          modeB = false
          break;
        case "2":
          modeB = true
          break;
        default:
          modeB = 0
          break;
      }

      for (let i = 0; i < listItems.length; i++) {
        if(this.state.todos[i].isCompleted !== modeB){
        if(today !== Moment(this.state.todos[i].date).format('L')){
          if(modeB === 0){
            listHItems.push(<li key={-1-i} style={{"backgroundColor" : items[colorI % items.length]}} className="list-group-item col-12" id="todoH">{Moment(this.state.todos[i].date).calendar(null,{
              lastDay : '[Вчора]',
              sameDay : '[Сьогодні]',
              nextDay : '[Завтра]',
              lastWeek : 'DD/MM/YYYY',
              nextWeek : 'DD/MM/YYYY',
              sameElse : 'DD/MM/YYYY'
          })}</li>);
            colorI++;
          }else if(modeB === false){
            listHItems.push(<li key={-1-i} style={{"backgroundColor" : itemsGreen[colorI % itemsGreen.length]}} className="list-group-item col-12" id="todoH">{Moment(this.state.todos[i].date).calendar(null,{
              lastDay : '[Вчора]',
              sameDay : '[Сьогодні]',
              nextDay : '[Завтра]',
              lastWeek : 'DD/MM/YYYY',
              nextWeek : 'DD/MM/YYYY',
              sameElse : 'DD/MM/YYYY'
          })}</li>);
            colorI++;
          }else if(modeB === true){
            listHItems.push(<li key={-1-i} style={{"backgroundColor" : itemsRed[colorI % itemsRed.length]}} className="list-group-item col-12" id="todoH">{Moment(this.state.todos[i].date).calendar(null,{
              lastDay : '[Вчора]',
              sameDay : '[Сьогодні]',
              nextDay : '[Завтра]',
              lastWeek : 'DD/MM/YYYY',
              nextWeek : 'DD/MM/YYYY',
              sameElse : 'DD/MM/YYYY'
          })}</li>);
            colorI++;
          }}
        listHItems.push(listItems[i]);
        today = Moment(this.state.todos[i].date).format('L'); 
      }
      }
        return (
            <div id="mainList" className="justify-content-md-center col-12 col-lg-5">
                      <div id="MMM">
                      <ul id="listUl">{listHItems}</ul>
                      </div>
                      
            </div>
        );
    }
}