import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class Refresh extends Component {
    render() {
        return <Redirect to='/' />
    }
}