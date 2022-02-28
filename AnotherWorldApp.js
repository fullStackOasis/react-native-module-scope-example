import React, { Component } from 'react';
import { Text, View } from 'react-native';
import ConnectService from './ConnectService';
import NewConnectService from './NewConnectService';
/**
 * See https://reactnative.dev/docs/getting-started
 */
class AnotherWorldApp extends Component {
  constructor(props) {
    console.log("props " + props);
    super(props);
  }

  async componentDidMount() {
    const source = "AnotherWorldApp.componentDidMount useNew: " + this.props?.useNew;
    try {
        const data = this.props?.useNew ?
            await NewConnectService.updateUser(null, null, source) :
            await ConnectService.updateUser(null, null, source);
        console.log("Calling updateUser from " + source + " " + JSON.stringify(data));
    } catch (e) {
        console.error("Calling updateUser from " + source + " error: " + e);
    }
  }

  render() {
    return (
      <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          fontSize: 24,
        }}>
        <Text style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          fontSize: 24,
        }}>Another World</Text>
      </View>
    );
  }
}

export default AnotherWorldApp;