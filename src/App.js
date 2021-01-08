import React from 'react';
import './App.css';
import HeaderBuscador from './components/HeaderBuscador';
import ListadoVuelos from './components/ListadoVuelos';

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
        search: null
    }
}

  handleSearch = (values) => {
    this.setState({search: values});
  }

  render() {
    return (
      <div className="App">
        <HeaderBuscador onSearch={this.handleSearch}/>
        <ListadoVuelos search={this.state.search}/>
      </div>
    ) 
  }
}
