import React, { Component } from 'react';
import { getJwt } from '../helpers/jwt';
import { Redirect } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class CreateToDo extends Component {

    constructor(props) {
        super(props);
            
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangePriority = this.onChangePriority.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
  
  
          this.state = {
            title: '',
            date: Date.now(),
            description: '',
            priority: '',
            toDashboard: false
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
  



    onSubmit(e){
        e.preventDefault();
  
        const todo = {
            date: this.state.date,
            title: this.state.title,
            description: this.state.description,
            priority: this.state.priority
        }
  
        const jwt = getJwt();
  
        fetch('/api/todos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `bearer ${jwt}`,
            },
            body: JSON.stringify(todo)
        }).then(() => this.setState(() => ({
            toDashboard: true
          })))
    }

    render() {
        if (this.state.toDashboard === true) {
            return <Redirect to='/' />
        }
        return (
            <div className="container">
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Завдання:</label>
                        <input className="form-control" value={this.state.title} onChange={this.onChangeTitle} type="text" placeholder="Зустріч з ..."></input>
                    </div>
                    <div className="form-group">
                        <label>Дата:</label>
                        <DatePicker className="form-control" selected={this.state.date} onChange={this.onChangeDate} inline/>
                    </div>
                    <div className="form-group">
                        <label>Опис:</label>
                        <textarea className="form-control" rows="1" value={this.state.description} onChange={this.onChangeDescription}></textarea>
                    </div>
                    
                    <label htmlFor="customRange2">Пріоритет:</label>
                    <input type="range" style={{"marginLeft" : "10px"}} className="custom-range col-3 align-middle" min="0" max="3" step="1" value={this.state.priority} onChange={this.onChangePriority}></input>
                    
                    <button type="submit" className="btn btn-primary col-12">Створити</button>
                    <br></br>
                    <br></br>
                </form>
            </div>
        );
    }
}