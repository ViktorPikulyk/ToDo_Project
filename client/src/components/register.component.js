import React, { Component } from 'react';


export default class Register extends Component {
    constructor(props) {
        super(props);

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            email: '',
            name: '',
            password: '',
            errorName: '',
            errorEmail: '',
            errorPassword: ''
        }
    }

    onChangeEmail(e){
        this.setState({
            email: e.target.value
        });
    }

    onChangeName(e){
        this.setState({
            name: e.target.value
        });
    }

    onChangePassword(e){
        this.setState({
            password: e.target.value
        });
    }

    update(e1, e2, e3){
        this.setState({
            errorName: e1,
            errorEmail: e2,
            errorPassword: e3
        });
    }
    

    onSubmit(e){
        e.preventDefault();

        const user = {
            email: this.state.email,
            name: this.state.name,
            password: this.state.password
        }

        console.log(user);

        fetch('/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
          })
          .then(r =>  r.json().then(data => ({status: r.status, body: data})))
          .then(obj => {console.log(obj); if(obj.status === 200){this.props.history.push('/login')}else{this.update(obj.body.name, obj.body.email, obj.body.password)}})
    }

    render() {
        return (
            <div id="all">
                <h2>Реєстрація</h2>
                <br></br>
            <div id="login_container" className="container col-sm-3">
                <form onSubmit={this.onSubmit}>
                    <br></br>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Ім'я користувача</label>
                        <input className="form-control" value={this.state.name} onChange={this.onChangeName} type="text" placeholder="Введіть ім'я"></input>
                        <p className="formErrors">{this.state.errorName}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Email адреса</label>
                        <input type="email" className="form-control" value={this.state.email} onChange={this.onChangeEmail} id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Введіть email"/>
                        <p className="formErrors">{this.state.errorEmail}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Пароль</label>
                        <input type="password" className="form-control" value={this.state.password} onChange={this.onChangePassword} id="exampleInputPassword1" placeholder="Введіть пароль"/>
                        <p className="formErrors">{this.state.errorPassword}</p>
                    </div>
                    <br></br>
                    <button type="submit" className="btn btn-primary col-12">Зареєструватися</button>
                </form>
                <br></br>
            </div>
            </div>
        );
    }
}