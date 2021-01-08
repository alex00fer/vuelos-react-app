import React from 'react';
import planeImage from '../assets/airplane.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Bs from "react-bootstrap";
import './HeaderBuscador.css';


export default class HeaderBuscador extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      codigo: '',  origen: '',  destino: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
    this.handleSubmitAll = this.handleSubmitAll.bind(this);
  }

  handleInputChange(event) {
    
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmitSearch(event) {
    event.preventDefault();
    this.props.onSearch(this.state);    
  }

  handleSubmitAll(event) {
    this.setState({
      codigo: '',  origen: '',  destino: ''
    }, () => {
      this.props.onSearch(this.state);
    });
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <header className="Header">
          <img src={planeImage} className="App-logo" alt="logo" />
          <p>
            Panel de administración vuelos
          </p>
          <div className="SearchPanel">
            <Bs.Form onSubmit={this.handleSubmitSearch}>
              <Bs.Form.Row>
                <Bs.Col>
                  <Bs.Form.Control placeholder="Código" name="codigo" value={this.state.codigo} onChange={this.handleInputChange}/>
                </Bs.Col>
                <Bs.Col>
                  <Bs.Form.Control placeholder="Origen" name="origen" value={this.state.origen} onChange={this.handleInputChange}/>
                </Bs.Col>
                <Bs.Col>
                  <Bs.Form.Control placeholder="Destino" name="destino" value={this.state.destino} onChange={this.handleInputChange}/>
                </Bs.Col>
                <Bs.Button variant="primary" type="submit">
                  Buscar
                </Bs.Button>
              </Bs.Form.Row>
            </Bs.Form>
            <hr/>
            <Bs.Form onSubmit={this.handleSubmitAll}>
              <Bs.Form.Row>
                <Bs.Button className="w-100" variant="primary" type="submit">
                  Mostrar todos los vuelos
                </Bs.Button>
              </Bs.Form.Row>
            </Bs.Form>
          </div>
        </header>
      </div>
    );
  }

}
