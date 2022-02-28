import React, { Component } from 'react';
import { Text, View } from 'react-native';
import ConnectService from './ConnectService';
import NewConnectService from './NewConnectService';
/**
 * See https://reactnative.dev/docs/getting-started
 */
class HelloWorldApp extends Component {

  async componentDidMount() {
    const source = "HelloWorldApp.componentDidMount useNew: " + this.props?.useNew;
    try {
        const data = this.props?.useNew ?
            await NewConnectService.updateUser2(null, null, source) :
            await ConnectService.updateUser2(null, null, source);
        console.log("Calling updateUser2 from " + source + " " + JSON.stringify(data));
    } catch (e) {
        console.error("Calling updateUser2 from " + source + " error: " + e);
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
        }}>Hello World!</Text>
      </View>
    );
  }
}

export default HelloWorldApp;