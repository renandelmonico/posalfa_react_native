import React, { Component } from 'react';
import {
  Modal,
  View,
  ScrollView,
  Text,
  Button,
  Geolocation,
  TextInput,
  ActivityIndicator,
  Image,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';

const styles = require('./../Styles/Style');
const KEY_GOOGLE = null;
const BASE_URL = 'https://maps.googleapis.com/maps/api/place/';

class Local extends Component {

  state = {
    buscando: false,
    latitude: null,
    longitude: null,
    locais: null,
    exibirModal: false,
    itemModal: null
  }

  componentDidMount = () => {
    const config = { enableHighAccuracy: true };
    navigator.geolocation.getCurrentPosition(this.locationSuccess, this.locationError, config);
  }

  locationSuccess = (position) => {
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    })
  }

  locationError = () => {
    alert('Ocorreu um erro interno. Entre em contato com o fornecedor de software.')
  }

  openModal = (item) => {
    this.setState({
      exibirModal: true,
      itemModal: item
    })
  }

  searchInput = () => {
    return (
      <View>
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <TextInput
            placeholder="Buscar..."
            onChangeText={(text) => this.setState({ text })}
            value={this.state.busca}
            onChangeText={this.onChangebusca}
          />
        </View>
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <Button title="Pesquisar"
            onPress={this.buscar}
          />
        </View>
      </View>
    );
  }

  buscar = () => {
    const { latitude, longitude, busca } = this.state;
    let locais = null;

    this.setState({ buscando: true });

    axios.get(
      BASE_URL + 'textsearch/json?query=' + busca +
      '&location=' + latitude + ',' + longitude + '&key=' + KEY_GOOGLE
    ).then((response) => {
      locais = response.data.results
    })
      .catch((err) => {
        alert('Ocorreu um erro ao buscar. Entre em contato com o fornecedor do software.')
      })
      .finally(() => {
        this.setState({
          buscando: false,
          locais
        });
      });
  }

  onChangebusca = (busca) => {
    this.setState({ busca })
  }

  result = () => {
    if (this.state.buscando) {
      return (
        <ActivityIndicator />
      );
    }

    let content;
    if (this.state.locais) {
      content = this.state.locais.map((item, index) => {
        return (
          <View key={index} style={styles.itens}>
            <TouchableOpacity onPress={() => this.openModal(item)}>
              <View style={styles.picture} >
                {item.photos ? <Image style={styles.local} source={{ uri: BASE_URL + 'photo?maxwidth=100&photoreference=' + item.photos[0].photo_reference + '&key=' + KEY_GOOGLE }} /> : null}
              </View>
              <View>
                <Text>{item.name}</Text>
                <Text>{item.formatted_address}</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      });
    }

    return (
      <View>{content}</View>
    )
  }

  render() {
    const { latitude, longitude, exibirModal } = this.state;

    if (latitude && longitude) {
      return (
        <View>
          <Modal
            visible={this.state.exibirModal}
            transparent={true}
            onRequestClose={() => this.setState({ exibirModal: false })}
          >
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
              <Text style={{ fontSize: 24, padding: 10, textAlign: 'center' }}>{this.state.itemModal ? this.state.itemModal.name : null}</Text>
              <Text style={{ marginTop: 30, textAlign: 'center' }}>{this.state.itemModal ? this.state.itemModal.formatted_address : null}</Text>
              <Button title="Fechar"
                onPress={() => this.setState({ exibirModal: false })} />
            </View>
          </Modal>
          {this.searchInput()}
          <ScrollView automaticallyAdjustContentInsets={false}>
            {this.result()}
          </ScrollView>
        </View>
      );
    }

    return (
      <View>
        <Text></Text>
      </View>
    )
  }
}

export default Local;
