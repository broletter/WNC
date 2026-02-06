import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtPrice: 0,
      cmbCategory: '',
      imgProduct: ''
    };
  }

  render() {
    const cates = this.state.categories.map((cate) => (
      <option key={cate._id} value={cate._id}>
        {cate.name}
      </option>
    ));

    return (
      <div className="float-right">
        <h2 className="text-center">PRODUCT DETAIL</h2>

        <form>
          <table>
            <tbody>
              <tr>
                <td>ID</td>
                <td>
                  <input type="text" value={this.state.txtID} readOnly />
                </td>
              </tr>

              <tr>
                <td>Name</td>
                <td>
                  <input
                    type="text"
                    value={this.state.txtName}
                    onChange={(e) =>
                      this.setState({ txtName: e.target.value })
                    }
                  />
                </td>
              </tr>

              <tr>
                <td>Price</td>
                <td>
                  <input
                    type="text"
                    value={this.state.txtPrice}
                    onChange={(e) =>
                      this.setState({ txtPrice: e.target.value })
                    }
                  />
                </td>
              </tr>

              <tr>
                <td>Image</td>
                <td>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => this.previewImage(e)}
                  />
                </td>
              </tr>

              <tr>
                <td>Category</td>
                <td>
                  <select
                    value={this.state.cmbCategory}
                    onChange={(e) =>
                      this.setState({ cmbCategory: e.target.value })
                    }
                  >
                    <option value="">-- Select category --</option>
                    {cates}
                  </select>
                </td>
              </tr>

              <tr>
                <td></td>
                <td>
                  <input
                    type="submit"
                    value="ADD NEW"
                    onClick={(e) => this.btnAddClick(e)}
                  />
                  <input
                    type="submit"
                    value="UPDATE"
                    onClick={(e) => this.btnUpdateClick(e)}
                  />
                  <input
                    type="submit"
                    value="DELETE"
                    onClick={(e) => this.btnDeleteClick(e)}
                  />
                </td>
              </tr>

              <tr>
                <td colSpan="2">
                  {this.state.imgProduct && (
                    <img
                      src={this.state.imgProduct}
                      width="300"
                      height="300"
                      alt=""
                    />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  componentDidUpdate(prevProps) {
    if (this.props.item && this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name,
        txtPrice: this.props.item.price,
        cmbCategory: this.props.item.category._id,
        imgProduct: 'data:image/jpg;base64,' + this.props.item.image
      });
    }
  }

  // ================= IMAGE PREVIEW =================
  previewImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      this.setState({ imgProduct: evt.target.result });
    };
    reader.readAsDataURL(file);
  }

  // ================= ADD =================
  btnAddClick(e) {
    e.preventDefault();
    const { txtName, txtPrice, cmbCategory, imgProduct } = this.state;
    const price = parseInt(txtPrice);

    if (!imgProduct.startsWith('data:image')) {
      alert('Please choose an image');
      return;
    }

    const image = imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');

    const prod = {
      name: txtName,
      price,
      category: cmbCategory,
      image
    };

    this.apiPostProduct(prod);
  }

  // ================= UPDATE =================
  btnUpdateClick(e) {
    e.preventDefault();
    const { txtID, txtName, txtPrice, cmbCategory, imgProduct } = this.state;
    const price = parseInt(txtPrice);

    let image = imgProduct;
    if (imgProduct.startsWith('data:image')) {
      image = imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');
    }

    if (txtID && txtName && price && cmbCategory) {
      const prod = {
        name: txtName,
        price,
        category: cmbCategory,
        image
      };
      this.apiPutProduct(txtID, prod);
    } else {
      alert('Please input id, name, price and category');
    }
  }

  // ================= DELETE =================
  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm('ARE YOU SURE ?')) {
      if (this.state.txtID) {
        this.apiDeleteProduct(this.state.txtID);
      } else {
        alert('Please input id');
      }
    }
  }

  // ================= APIS =================
  apiGetCategories() {
    axios
      .get('/api/admin/categories', {
        headers: { 'x-access-token': this.context.token }
      })
      .then((res) => {
        this.setState({ categories: res.data });
      });
  }

  apiPostProduct(prod) {
    axios
      .post('/api/admin/products', prod, {
        headers: { 'x-access-token': this.context.token }
      })
      .then(() => {
        alert('ADD OK');
        this.apiGetProducts();
      });
  }

  apiPutProduct(id, prod) {
    axios
      .put(`/api/admin/products/${id}`, prod, {
        headers: { 'x-access-token': this.context.token }
      })
      .then(() => {
        alert('UPDATE OK');
        this.apiGetProducts();
      });
  }

  apiDeleteProduct(id) {
    axios
      .delete(`/api/admin/products/${id}`, {
        headers: { 'x-access-token': this.context.token }
      })
      .then(() => {
        alert('DELETE OK');
        this.setState({
          txtID: '',
          txtName: '',
          txtPrice: 0,
          cmbCategory: '',
          imgProduct: ''
        });
        this.apiGetProducts();
      });
  }

  apiGetProducts() {
    axios
      .get(`/api/admin/products?page=${this.props.curPage}`, {
        headers: { 'x-access-token': this.context.token }
      })
      .then((res) => {
        const result = res.data;
        this.props.updateProducts(result.products, result.noPages);
      });
  }
}

export default ProductDetail;
