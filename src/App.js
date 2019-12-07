import logo from './logo.svg';
import './App.css';

import { Modal, Button, Spinner } from 'react-bootstrap';
import React, { Component } from 'react';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      Orders: [],
      Clients: [],
      CurrentStatus: "",
      show_m: false,
      CurrentId: null,
      opt1: {display: 'none'},
      opt2: {display: 'none'}
    }
  }

  componentDidMount() {
      var url = "http://localhost:3000/getOrders";
      fetch(url, {
          headers: {
          'Content-Type': 'application/json'
          },
          method: 'GET', // or 'PUT'
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
          if (response.error) {
            console.error("Error");
          } else {
            console.log(response);
            this.setState({Orders: response.orders, Clients: response.clients})
          }
        });
    }

  findId(data, idToLookFor) {
      var categoryArray = data;
      for (var i = 0; i < categoryArray.length; i++) {
          if (categoryArray[i].id == idToLookFor) {
              return(categoryArray[i]);
          }
      }
  }


  ChangeStatus(status, id, trigger) {
    if (trigger) {
      this.setState({CurrentStatus: status, CurrentId: id});
      this.setState({show_m: !this.state.show_m});
      if (status=="nuevo") {
        this.setState({opt1:{display:'block'}, opt2:{display:'none'}});
      } else if (status=="preparacion") {
        this.setState({opt1:{display:'none'}, opt2:{display:'block'}});
      }
    }
  }

  modalHandler = () => {
    this.setState({show_m: !this.state.show_m});
  }

  sendChange(status) {
    var url = "http://localhost:3000/changeOrderStatus?id=" + this.state.CurrentId + "&status=" + status;
      fetch(url, {
          headers: {
          'Content-Type': 'application/json'
          },
          method: 'POST', // or 'PUT'
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
          console.log(response);
          alert(response.msg);
        });
  }

  renderSwitch(param) {
    console.log(param)
    switch(param) {
      case 'nuevo':
        this.setState({opt1:{display:'block'}, opt2:{display:'none'}});
        return;
        //return '<div><button type="button" class="btn btn-success">anulado</button><button type="button" class="btn btn-success">preparacion</button></div>';
      case 'preparacion':
        this.setState({opt1:{display:'none'}, opt2:{display:'block'}});  
        return;      //return '<div><button type="button" class="btn btn-success">terminado</button></div>';
      default:
        //return 'No puedes cambiar el estado de esta orden';
    }
  }

  render() {
    const {Orders, Clients, show_m, CurrentStatus, opt1, opt2} = this.state;
    return(
      <div className="App">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Codigo de pedido</th>
              <th scope="col">Fecha</th>
              <th scope="col">Hora de preparación</th>
              <th scope="col">Hora de recogida</th>
              <th scope="col">Cliente</th>
              <th scope="col">Modo de entrega</th>
              <th scope="col">Método de pago</th>
              <th scope="col">Subtotal</th>
              <th scope="col">Impuestos</th>
              <th scope="col">Total</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {
              Orders.map(order => {
                return(
                  <tr>
                    <th scope="row">{order.id}</th>
                    <td>{order.code}</td>
                    <td>{order.created_at.slice(0, 10)}</td>
                    <td>{order.start_preparation}</td>
                    <td>{order.delivery_time}</td>
                    <td>{this.findId(Clients, order.client_id).name}</td>     
                    <td>{order.delivery_method}</td>
                    <td>{order.cash_payment ? 'efectivo' : 'digital'}</td>
                    <td>${order.subtotal}</td>
                    <td>${order.taxes}</td>
                    <td>${order.total}</td>
                    <td>{order.status}</td>

                    <td><button type="button" onClick={()=>{this.ChangeStatus(order.status, order.id, true)}}class="btn btn-success">Cambiar estado</button></td>


                  </tr>
                )
              })
            }
          </tbody>
        </table>

        <Modal show={show_m} animation={false}>
          <Modal.Header closeButton onClick={this.modalHandler}>
            <Modal.Title></Modal.Title>
          </Modal.Header>
          <Modal.Body className='modal-body'>
            <div style={opt1}>
              <button type="button" class="btn btn-success" onClick={()=>{this.sendChange('anulado')}}>anulado</button><button type="button" class="btn btn-success" onClick={()=>{this.sendChange('preparacion')}}>preparacion</button>
            </div>
            <div style={opt2}>
              <button type="button" class="btn btn-success" onClick={()=>{this.sendChange('terminado')}}>terminado</button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={this.modalHandler}>Cerrar</button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default App;
