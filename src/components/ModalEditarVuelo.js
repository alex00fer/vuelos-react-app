import React from 'react';
import * as Bs from "react-bootstrap";

export default class ModalEditarVuelo extends React.Component {
  constructor(props) {
    super(props);
    //this.onInsertClicked = this.onInsertClicked.bind(this);
    this.state = {
      isOpen: false, codigo: '', nuevo_codigo: '',  origen: '',  destino: '', fecha: (new Date()).toISOString().split('T')[0], hora: '', plazas: '', plazas_libres: ''
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

    this.editarVuelo(this.state);
  }

  setIsOpen(b, v) {
    if (v) {
      this.setState({
        isOpen: b, codigo: v.codigo, nuevo_codigo: v.codigo,  origen: v.origen,  destino: v.destino, fecha: v.fecha, hora: v.hora, plazas: v.plazas, plazas_libres: v.plazasLibres
      });
    } else {
      this.setState({
        isOpen: b
      });
    }
  }

  editarVuelo(stt) {
    var myHeaders = new Headers();
    const vuelo = stt;
    vuelo.fecha = new Date(vuelo.fecha).getTime();
    delete vuelo.isOpen;
    var myInit = { method: 'PUT',
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
            this.props.onEdited(vuelo);    
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
            <Bs.Modal.Title>Editar vuelo</Bs.Modal.Title>
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

        <Bs.Form.Group as={Bs.Row}>
          <Bs.Form.Label column sm="2">
            Nuevo codigo
          </Bs.Form.Label>
          <Bs.Col sm="10">
            <Bs.Form.Control name="nuevo_codigo" value={this.state.nuevo_codigo} onChange={this.handleInputChange} required />
          </Bs.Col>
        </Bs.Form.Group>

        <Bs.Form.Group as={Bs.Row}>
          <Bs.Form.Label column sm="2">
            Origen
          </Bs.Form.Label>
          <Bs.Col sm="10">
            <Bs.Form.Control name="origen" value={this.state.origen} onChange={this.handleInputChange} required />
          </Bs.Col>
        </Bs.Form.Group>


        <Bs.Form.Group as={Bs.Row}>
          <Bs.Form.Label column sm="2">
            Destino
          </Bs.Form.Label>
          <Bs.Col sm="10">
            <Bs.Form.Control name="destino" value={this.state.destino} onChange={this.handleInputChange} required />
          </Bs.Col>
        </Bs.Form.Group>


        <Bs.Form.Group as={Bs.Row}>
          <Bs.Form.Label column sm="2">
            Fecha
          </Bs.Form.Label>
          <Bs.Col sm="10">
            <Bs.Form.Control name="fecha" value={this.state.fecha} onChange={this.handleInputChange} type="date" required />
          </Bs.Col>
        </Bs.Form.Group>

        <Bs.Form.Group as={Bs.Row}>
          <Bs.Form.Label column sm="2">
            Hora
          </Bs.Form.Label>
          <Bs.Col sm="10">
            <Bs.Form.Control name="hora" value={this.state.hora} onChange={this.handleInputChange} required />
          </Bs.Col>
        </Bs.Form.Group>

        <Bs.Form.Group as={Bs.Row}>
          <Bs.Form.Label column sm="2">
            Plazas
          </Bs.Form.Label>
          <Bs.Col sm="10">
            <Bs.Form.Control name="plazas" value={this.state.plazas} onChange={this.handleInputChange} type="number" required />
          </Bs.Col>
        </Bs.Form.Group>

        <Bs.Form.Group as={Bs.Row}>
          <Bs.Form.Label column sm="2">
            Plazas libres
          </Bs.Form.Label>
          <Bs.Col sm="10">
            <Bs.Form.Control name="plazas_libres" value={this.state.plazas_libres} onChange={this.handleInputChange} type="number" required />
          </Bs.Col>
        </Bs.Form.Group>

        <Bs.Form.Row>
          <Bs.Button className="w-100" variant="warning" type="submit">
            Editar
          </Bs.Button>
        </Bs.Form.Row>


      </Bs.Form>
    )
  }
}
