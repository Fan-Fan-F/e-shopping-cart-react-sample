import React, {Component} from "react";
import Table from "react-bootstrap/Table";
import {Button, Alert} from "react-bootstrap";
import {loadCart, clearCart, cartTotal} from "../cartStorage";

class CartShow extends Component {
    constructor() {
        super();
        this.state = {
            cart: loadCart(),
            message: ''
        }
    }

    clickHandler = () => {
        clearCart()
        this.setState({
            cart: [],
            message: 'you paid successfully'
        })
    }

    render() {
        let alert = this.state.message != '' ? <Alert variant="success">{this.state.message}</Alert> : ''
        let total = this.state.cart.length > 0 ? this.state.cart.map((item) =>
            <tr key={item.id}>

                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{(item.price * item.quantity).toFixed(2)} €</td>
                <td><img src={item.image} style={{height: '40px'}} alt={item.name}/></td>

            </tr>
        ) : null

        return (
            <>
                <Table striped bordered hover>
                    <thead>
                    <tr>

                        <th>Name</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Image</th>
                    </tr>
                    </thead>

                    <tbody>

                    {total}
                    <tr>
                        <td style={{color: 'red', fontWeight: 'bold'}}>total</td>
                        <td colSpan={3}>{cartTotal(this.state.cart).toFixed(2)} €</td>

                    </tr>
                    </tbody>
                </Table>
                {alert}
                <Button variant="info" onClick={this.clickHandler}>Payment</Button>
            </>
        );
    }
}


export default CartShow;