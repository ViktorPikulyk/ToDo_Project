import React, { Component } from 'react';
import { getJwt } from '../helpers/jwt';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default class EditToDo extends Component {

    constructor(props) {
        super(props);
            
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangePriority = this.onChangePriority.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
  
  
          this.state = {
            title: '',
            date: '',
            description: '',
            priority: '',
            isCompleted: ''
          }
    }

    onChangeTitle(e){
        this.setState({
            title: e.target.value
        });
      }

    onChangeDate(e){
      this.setState({
          date: e
      });
    }

    onChangeDescription(e){
      this.setState({
          description: e.target.value
      });
    }

    onChangePriority(e){
      this.setState({
          priority: e.target.value
      });
    }

    componentDidMount () {
        const { EditID } = this.props.location.state

        const jwt = getJwt();
        
  
        fetch(`/api/todos/${EditID}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `bearer ${jwt}`,
            }
        }).then(r =>  r.json().then(data => ({status: r.status, body: data})))
          .then(obj => {this.setState({title: obj.body.title, date: obj.body.date, description: obj.body.description, priority: obj.body.priority, isCompleted: obj.body.isCompleted});});
      }

    onSubmit(e){
        e.preventDefault();
        const { EditID } = this.props.location.state
        const jwt = getJwt();

        const todo = {
            date: this.state.date,
            title: this.state.title,
            description: this.state.description,
            priority: this.state.priority,
            isCompleted: this.state.isCompleted
        }
  
        fetch(`/api/todos/${EditID}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `bearer ${jwt}`,
            },
            body: JSON.stringify(todo)
        }).then(this.props.history.push('/'))
    }
    
    render() {
        return (
            <div className="container">
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Завдання:</label>
                        <input className="form-control" value={this.state.title} onChange={this.onChangeTitle} type="text" placeholder="Зустріч з ..."></input>
                    </div>
                    <div className="form-group">
                        <label>Дата:</label>
                        <DatePicker className="form-control" selected={Date.parse(this.state.date)} onChange={this.onChangeDate} inline/>
                    </div>
                    <div className="form-group">
                        <label>Опис:</label>
                        <textarea className="form-control" rows="1" value={this.state.description} onChange={this.onChangeDescription}></textarea>
                    </div>
                    
                    <label htmlFor="customRange2">Пріоритет:</label>
                    <input type="range" style={{"marginLeft" : "10px"}} className="custom-range col-3 align-middle" min="0" max="3" step="1" value={this.state.priority} onChange={this.onChangePriority}></input>
                    
                    <button type="submit" className="btn btn-primary col-12">Змінити</button>
                    <br></br>
                    <br></br>
                </form>
            </div>
        );
    }
}