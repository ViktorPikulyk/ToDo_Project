import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Login extends Component {

        constructor(props) {
            super(props);
    
            this.onChangeEmail = this.onChangeEmail.bind(this);
            this.onChangePassword = this.onChangePassword.bind(this);
            this.onSubmit = this.onSubmit.bind(this);
    
            this.state = {
                email: '',
                password: '',
                errorEmail: '',
                errorPassword: ''
            }
        }
    
        onChangeEmail(e){
            this.setState({
                email: e.target.value
            });
        }
    
        onChangePassword(e){
            this.setState({
                password: e.target.value
            });
        }

        update(e1, e2){
            this.setState({
                errorEmail: e1,
                errorPassword: e2
            });
        }

        onSubmit(e){
            e.preventDefault();

            const user = {
                email: this.state.email,
                password: this.state.password
            }
            console.log(user);

            fetch('/users/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
              })
              .then(r =>  r.json().then(data => ({status: r.status, body: data})))
              .then(obj => {console.log(obj); if(obj.body.token){localStorage.setItem('myjwt' , obj.body.token); this.props.history.push('/'); document.location.reload(true)}else{this.update(obj.body.email, obj.body.password)}})
        }

    render() {
        return (
            <div id="all">
                <h2>Вхід в ToDo</h2>
                <br></br>
            <div id="login_container" className="container col-sm-3">
                <form onSubmit={this.onSubmit}>
                    <br></br>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Email адреса</label>
                        <input type="email" className="form-control" value={this.state.email} onChange={this.onChangeEmail} id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Введіть Email"/>
                        <p className="formErrors">{this.state.errorEmail}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Пароль</label>
                        <input type="password" className="form-control" value={this.state.password} onChange={this.onChangePassword} id="exampleInputPassword1" placeholder="Введіть пароль"/>
                        <p className="formErrors">{this.state.errorPassword}</p>
                    </div>
                    <br></br>
                    <button type="submit" className="btn btn-primary col-12">Увійти</button>
                </form>
                <br></br>
            </div>
            <br></br>
            Вперше на ToDo? <Link to="/register"> Створити профіль</Link>
            </div>
        );
    }
}