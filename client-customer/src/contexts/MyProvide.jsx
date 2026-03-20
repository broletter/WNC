import React, { Component } from 'react';
import MyContext from './MyContext';

class MyProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // global state
      token: '',
      customer: null,
      mycart: [],   // thêm giỏ hàng

      // functions
      setToken: this.setToken,
      setCustomer: this.setCustomer,
      setMycart: this.setMycart   // thêm function
    };
  }

  setToken = (value) => {
    this.setState({ token: value });
  }

  setCustomer = (value) => {
    this.setState({ customer: value });
  }

  // thêm hàm cập nhật giỏ hàng
  setMycart = (value) => {
    this.setState({ mycart: value });
  }

  render() {
    return (
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default MyProvider;