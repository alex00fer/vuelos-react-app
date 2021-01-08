import React from 'react';
import * as Bs from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHashtag, faPlane, faClock, faAddressBook } from '@fortawesome/free-solid-svg-icons'
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'
import './ListadoVuelos.css';
import ModalInsertVuelo from './ModalInsertVuelo';
import ModalDeleteVuelo from './ModalBorrarVuelo';
import ModalEditVuelo from './ModalEditarVuelo';

export default class ListadoVuelos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isEmpty: true,
      isLoaded: false,
      items: []
    };
    this.onInsertClicked = this.onInsertClicked.bind(this);
    this.onEditClicked = this.onEditClicked.bind(this);
    this.onDeleteClicked = this.onDeleteClicked.bind(this);
    this.onVueloInserted = this.onVueloInserted.bind(this);
    this.onVueloDeleted = this.onVueloDeleted.bind(this);
    this.onVueloEdited = this.onVueloEdited.bind(this);
    this.showError = this.showError.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchVuelos(nextProps);
  }

  fetchVuelos(props) {
    console.log ("Fetching...");
    var myHeaders = new Headers();

    var myInit = { method: 'GET',
                  headers: myHeaders,
                  mode: 'cors',
                  cache: 'default'
                };

    var myRequest;                
    if (props && props.search) {
      var searchJson = JSON.stringify(props.search);
      myRequest = new Request('http://localhost/vuelosapi/?search='+ encodeURIComponent(searchJson), myInit);
    }
    else
      myRequest = new Request('http://localhost/vuelosapi/', myInit);

    fetch(myRequest)
      .then(res => res.json())
      .then(
        (result) => {
          if (result.success)
            this.setState({
              isLoaded: true,
              isEmpty: false,
              vuelos: result.vuelos,
              error: null
            });
          else 
            this.setState({
              isLoaded: true,
              isEmpty: false,
              error: "El servidor respondió con un código de error. " + result.error
            });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            isEmpty: false,
            error: "No se pudo contactar con el servidor http://localhost/vuelosapi/. " + error.message
          });
        }
      )
  }

  onVueloInserted(vuelo) {
    vuelo.plazasLibres = vuelo.plazas_libres;
    vuelo.fecha = new Date(vuelo.fecha).toISOString().split('T')[0];
    const newVuelos = this.state.vuelos;
    newVuelos.push(vuelo);
    this.setState({
      info: `Vuelo ${vuelo.codigo} insertado correctamente`,
      vuelos: newVuelos
    });
  }

  onVueloDeleted(vuelo) {
    const newVuelos = this.state.vuelos.filter(v => v.codigo !== vuelo.codigo);
    this.setState({
      info: `Vuelo ${vuelo.codigo} borrado correctamente`,
      vuelos: newVuelos
    });
  }

  onVueloEdited(vuelo) {
    vuelo.plazasLibres = vuelo.plazas_libres;
    vuelo.fecha = new Date(vuelo.fecha).toISOString().split('T')[0];
    const newVuelos = this.state.vuelos;
    let index = [newVuelos.findIndex(v => v.codigo === vuelo.codigo)];
    vuelo.codigo = vuelo.nuevo_codigo;
    newVuelos[index] = vuelo;
    this.setState({
      info: `Vuelo ${vuelo.codigo} editado correctamente`,
      vuelos: newVuelos
    });
  }

  showError(msg) {
    this.setState({
      info: msg
    });
  }

  onInsertClicked(){
    this.refs.insertModal.setIsOpen(true);
  }

  onDeleteClicked(vuelo){
    this.refs.deleteModal.setIsOpen(true, vuelo.codigo);
  }

  onEditClicked(vuelo){
    this.refs.editModal.setIsOpen(true, vuelo);
  }

  render() {
    const { error, isEmpty, isLoaded, vuelos, info } = this.state;

    let dialogInfo;
    if (info) {
      dialogInfo = <Bs.Alert className="w-100 text-center mt-3" variant="secondary">{info}</Bs.Alert>;
    }

    if (isEmpty) {
      return <></>;
    } else if (error) {
      return <Bs.Alert className="w-100 text-center mt-3" variant="danger">{error.message || error}</Bs.Alert>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    }else if (vuelos == null) {
      return <Bs.Alert className="w-100 text-center mt-3" variant="warning">No se han encontrado vuelos</Bs.Alert>;
    } else {
      return (
        <Bs.Container>
          <ModalInsertVuelo ref="insertModal" onAdded={this.onVueloInserted}   onError={this.showError} />
          <ModalDeleteVuelo ref="deleteModal" onDeleted={this.onVueloDeleted}  onError={this.showError} />
          <ModalEditVuelo ref="editModal" onEdited={this.onVueloEdited}  onError={this.showError} />
          <Bs.Button onClick={this.onInsertClicked} variant="primary" className="mt-3"><FontAwesomeIcon icon={faPlus} /> Insertar vuelo</Bs.Button>
          <Bs.Row>{dialogInfo}</Bs.Row>
          <Bs.Row>
            {vuelos?.map(item => (
              <Bs.Col md={6} lg={4} key={item.codigo}>
                <div className="Flight">
                  <p className="Codigo"><FontAwesomeIcon icon={faHashtag} />{item.codigo}</p>
                  <p className="Destino">{item.origen} <FontAwesomeIcon icon={faPlane} /> {item.destino}</p>
                  <p className="Hora">{item.fecha} <FontAwesomeIcon icon={faClock} /> {item.hora}</p>
                  <p className="Plazas">{item.plazas} plazas <FontAwesomeIcon icon={faAddressBook} /> {item.plazasLibres} disponibles</p>
                  <Bs.Row>
                    <Bs.Col><Bs.Button onClick={e => this.onEditClicked(item)}   variant="primary"><FontAwesomeIcon icon={faEdit} /> Editar</Bs.Button></Bs.Col>
                    <Bs.Col><Bs.Button onClick={e => this.onDeleteClicked(item)} variant="danger"><FontAwesomeIcon icon={faTrash} /> Borrar</Bs.Button></Bs.Col>
                  </Bs.Row>
                </div>
              </Bs.Col>
            ))}
          </Bs.Row>
        </Bs.Container>
      );
    }
  }
}
