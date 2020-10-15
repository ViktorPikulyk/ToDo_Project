import React, { Component } from 'react';
import { getJwt } from '../helpers/jwt';
import jwt_decode from 'jwt-decode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Moment from 'moment';


export default class Profile extends Component {

    constructor(props) {
        super(props);
  
        this.fetchData = this.fetchData.bind(this);
        this.createPDF = this.createPDF.bind(this);
  
          this.state = {
            name: '',
            email: '',
            todos: [{}],
            report: false
          }
        }

    fetchData(){
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
          .then(obj => {if(obj.body)this.setState({todos: obj.body.todos, name:obj.body.name, email:obj.body.email});})
          //.catch(e => {if (e instanceof SyntaxError){localStorage.removeItem('myjwt'); this.props.history.push('/login')}});
        }
    }

    componentDidMount(){
        this.fetchData();
    }

    generateReport(){
        this.setState({report: !this.state.report})
    }

    createPDF(){
        window.scrollTo(0,0); 
        html2canvas(document.getElementById('report'), {
            scale:1
          }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 0, 0);
            pdf.save("report.pdf");  
        });
    }

    render() {
        let all = 0;
        let completed = 0;
        let uncompleted = 0;
        let isDisplayed = this.state.report ? "block" : "none";

        for (let i = 0; i < this.state.todos.length; i++) {
            if(this.state.todos[i].isCompleted === true){
                completed++;
            }else uncompleted++;
            all++;
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

          this.state.todos.sort( compare );

        const reportRow = this.state.todos.map((obj, i) => 
            <tr key={i}><td>{obj.title}</td><td>{obj.description}</td><td>{obj.priority}</td><td>{Moment(obj.date).format("DD/MM/YYYY")}</td></tr>
        );

        return (
            <div id="profile-container" className="container col-12 col-lg-6">
                <br></br>
                <h1>Ім'я</h1>
                <h2>
                    {this.state.name}
                </h2>
                <br></br>
                <h1>Email</h1>
                <h2>
                    {this.state.email}
                </h2>
                <br></br>
                <h1>Завдання <span style={{"opacity": "0.4", "fontSize":"20px"}}>(Всі:Виконані|Не виконані)</span></h1>
                <h2>
                    {`${all} : ${completed} | ${uncompleted}`}
                </h2>
                <br></br>
                <button className="btn btn-link" onClick={this.generateReport.bind(this)}>Створити звіт</button>
                <br></br>
                <br></br>
                <div id="report" style={{"display": isDisplayed, "padding" : "15px"}}>
                    <br></br>
                    {`Ім'я: ${this.state.name}`}
                    <br></br>
                    {`Email: ${this.state.email}`}
                    <button style={{"float" : "right", "marginTop":"-20px"}} onClick={this.createPDF}>Друк</button>
                    <table border="2" style={{"fontSize": "15px"}}>
                    <tbody>
                    <tr><td>Завдання</td><td>Опис</td><td>Пріоритет</td><td>Дата</td></tr>
                        {reportRow}
                    </tbody>
                    </table>
                    <br></br>
                </div>
            </div>
        );
    }
}