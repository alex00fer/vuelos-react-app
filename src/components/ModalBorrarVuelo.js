import React from 'react';
import * as Bs from "react-bootstrap";
import './ListadoVuelos.css';

export default class ModalBorrarVuelo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false, codigo: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.borrarVuelo(this.state);
  }

  setIsOpen(b, codigo) {
    if (codigo) {
      this.setState({
        isOpen: b,
        codigo: codigo
      });
    }
    else {
      this.setState({
        isOpen: b
      });
    }
  }

  borrarVuelo(stt) {
    var myHeaders = new Headers();
    const vuelo = stt;
    delete vuelo.isOpen;
    var myInit = { method: 'DELETE',
                  headers: myHeaders,
                  mode: 'cors',
                  cache: 'default',
                  body: JSON.stringify(vuelo)
                };
    

    var myRequest = new Request('http://localhost/vuelosapi/', myInit);

    fetch(myRequest)
      .then(res => res.json())
      .then(
        (result) => {
          if (result.success) {
            this.props.onDeleted(vuelo);    
          }
          else {
            this.props.onError("El servidor respondió con un error: " + result.error);    
          }
          this.setState({
            isOpen: false
          });
        },
        (error) => {
          this.props.onError("Se produjo un error al conectar con el servidor: " + error);  
          this.setState({
            isOpen: false,
            error
          });
        }
      )
  }

  render() {
    const { isOpen } = this.state;

    //const showModal = () => {
    //  this.setIsOpen(true);
    //};
  
    const hideModal = () => {
      this.setIsOpen(false);
    };

      return (
        <Bs.Modal show={isOpen} onHide={hideModal}>
          <Bs.Modal.Header closeButton>
            <Bs.Modal.Title>Borrar vuelo</Bs.Modal.Title>
          </Bs.Modal.Header>
          <Bs.Modal.Body>
            {this.formJSX()}
          </Bs.Modal.Body>
        </Bs.Modal>
      );
  }

  formJSX() {
    return (
      <Bs.Form onSubmit={this.handleSubmit}>
        <Bs.Form.Group as={Bs.Row}>
          <Bs.Form.Label column sm="2">
            Codigo
          </Bs.Form.Label>
          <Bs.Col sm="10">
            <Bs.Form.Control name="codigo" value={this.state.codigo} onChange={this.handleInputChange} required />
          </Bs.Col>
        </Bs.Form.Group>

        <Bs.Form.Row>
          <Bs.Button className="w-100" variant="danger" type="submit">
            Borrar
          </Bs.Button>
        </Bs.Form.Row>


      </Bs.Form>
    )
  }
}
