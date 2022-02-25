import React, { Component } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { Button } from "native-base";
import Voice from '@react-native-voice/voice';
import { STOP_RECORDING_COMMAND } from '../models/Commands';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recognized: false,
      started: false,
      results: [],
      startTime: null,
    };
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this)
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
  }

  onSpeechStart = () => {
    this.setState({
      started: true,
    });
  }
  onSpeechRecognized = () => {
    this.setState({
      recognized: true,
      startTime: Date.now(),
    });
  }
  onSpeechResults = (e) => {
    let shortenedString;
    let normalizedLast23Chars;
    if (e.value[0]) {
      shortenedString = e.value[0].substring(e.value[0].length-23, e.value[0].length);
      normalizedLast23Chars = shortenedString.toLowerCase();
    }
    if (normalizedLast23Chars === STOP_RECORDING_COMMAND) {
      // dispatch action to do something
      this.stopRecognition();
    } else {
      this.setState({
        results: e.value,
        startTime: Date.now(),
      });
    }
  }
  onSpeechEnd = (e) => {
    this.setState({
      recognized: false,
      started: false,
      results: [],
    });
  }

  startRecognition = async () => {
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
    this.setState({
      recognized: false,
      started: true,
      results: [],
    });
  }

  stopRecognition = async () => {
    try {
      if (this.state.started) {
        await Voice.stop();
        await Voice.destroy();
      }
    } catch (e) {
      console.error(e);
    }
    this.setState({
      recognized: false,
      started: false,
      results: [],
    });
  }

  isRecognizing = async () => {
    try {
      const res = await Voice.isRecognizing();
      return res;
    } catch (e) {
      return 0;
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 25 }}>
            Meeting Transcription
          </Text>
        </View> 
        <View style={{ flex: 1, marginTop: 16 }}>
          <Text>Output: </Text>
          { this.state.results.map((voice) => (
            <Text>{voice}</Text>
          ))}
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Button  
            onPress={() => this.startRecognition()}
            style={{ marginBottom: 10 }}
          >
            Start Recording
          </Button>
          <Button 
            onPress={() => this.stopRecognition()}
          >
            Stop Recording
          </Button>
        </View>
      </SafeAreaView>
    );
  }
}

export default Home;