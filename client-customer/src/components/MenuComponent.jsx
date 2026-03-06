import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import axios from 'axios';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtKeyword: '',
      categories: []
    };

    this.btnSearchClick = this.btnSearchClick.bind(this);
  }

  render() {

    const cates = this.state.categories.map((item) => {
      return (
        <li key={item._id} className="menu">
          <Link to={'/product/category/' + item._id}>
            {item.name}
          </Link>
        </li>
      );
    });

    return (
      <div className="border-bottom">

        <nav>
          <ul className="menu">

            <li className="menu">
              <Link to="/home">HOME</Link>
            </li>

            {cates}

          </ul>
        </nav>

        <form className="search">
          <input
            type="search"
            placeholder="Enter keyword"
            className="keyword"
            value={this.state.txtKeyword}
            onChange={(e) => {
              this.setState({ txtKeyword: e.target.value });
            }}
          />

          <input
            type="submit"
            value="SEARCH"
            onClick={(e) => this.btnSearchClick(e)}
          />
        </form>

      </div>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  apiGetCategories() {
    axios.get('/api/customer/categories').then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }

  btnSearchClick(e) {
    e.preventDefault();
    this.props.navigate('/product/search/' + this.state.txtKeyword);
  }
}

const MenuWithRouter = withRouter(Menu);
export default MenuWithRouter;