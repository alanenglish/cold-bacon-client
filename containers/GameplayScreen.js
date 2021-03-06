import React, { Component } from 'react';
import { Text, Image, View } from 'react-native';
import styles from './styles/GameplayScreenStyle';
import ClickableImage from '../components/ClickableImage';
import clickableStyles from '../components/styles/ClickableImageStyle';
import { StackNagivator } from 'react-navigation';
import GameStart from './GameStart';
import GeneralButton from '../components/GeneralButton';
import buttonStyles from '../components/styles/ButtonStyle';
import LaunchScreen from './LaunchScreen';
import * as Animatable from 'react-native-animatable';
import StaticImage from '../components/StaticImage';
import staticStyles from '../components/styles/StaticImageStyle'
import DropdownAlert from 'react-native-dropdownalert';


export default class GameplayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    }
  }

  componentDidMount() {
    return fetch(serverBaseUrl+'/games/'+this.props.navigation.state.params.game_id+'/paths', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        traceable_type: this.props.navigation.state.params.traceable_type,
        traceable_id: this.props.navigation.state.params.traceable_id,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        pathInfo: responseJson,
        modalVisible: false,
      })
      console.log(this.state.pathInfo);
    })
    .catch((error) => {
      console.error(error)
    })
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loadingView}>
          <Animatable.Text animation="flash" style={styles.loadingText} duration={5000} iterationCount={3}>Loading...</Animatable.Text>
        </View>
      )
    }

    const { navigate } = this.props.navigation;
    let responseObject = this.state.pathInfo;
    let modalVisible = false;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.startingActorView}>
          <View>
            <StaticImage imageSource={{uri: 'https://image.tmdb.org/t/p/w185/'+responseObject.current_traceable.traceable.image_url}} onLongPress={() => this.showAlert('custom', '', responseObject.current_traceable.traceable.name)} imageStyle={[staticStyles.actor_image, (!responseObject.is_movie) && staticStyles.movieImage]} />
          </View>
        </View>
        <View style={styles.pathsView}>
          <View style={styles.path}>
            {
              responseObject.possible_paths.map(function(possible_path, index) {
                if ((possible_path.traceable.id === responseObject.ending_traceable.traceable.id) && (possible_path.traceable_type === responseObject.ending_traceable.traceable_type)) {
                  return (
                    <Animatable.Image key={index} animation="pulse" iterationCount="infinite" style={styles.pulse_image}>
                      <ClickableImage imageSource={{uri: 'https://image.tmdb.org/t/p/w185/'+possible_path.traceable.image_url}} imageStyle={clickableStyles.finalPathImage} touchStyle={clickableStyles.pathTouchable} onPress={() => navigate('ResultsScreen', { game_id: responseObject.game_id, traceable_id: possible_path.traceable.id, traceable_type: possible_path.traceable_type } )} />
                    </Animatable.Image>
                  )
                  }
                else {
                  return (
                    <View key={index}>
                    <ClickableImage key={index} imageSource={{uri: 'https://image.tmdb.org/t/p/w185/'+possible_path.traceable.image_url}} imageStyle={[clickableStyles.pathImage, (responseObject.is_movie) && clickableStyles.moviePath]} touchStyle={clickableStyles.pathTouchable} onPress={() => navigate('GameplayScreen', { game_id: responseObject.game_id, traceable_id: possible_path.traceable.id, traceable_type: possible_path.traceable_type} )} onLongPress={() => this.showAlert('custom', '', possible_path.traceable.name)} />
                    </View>
                  )
                }
              }, this)
            }
          </View>
        </View>
        <View style={styles.endingActorView}>
          <View>
            <StaticImage imageSource={{uri: 'https://image.tmdb.org/t/p/w185/'+responseObject.ending_traceable.traceable.image_url}}onLongPress={() => this.showAlert('custom', '', responseObject.ending_traceable.traceable.name)} imageStyle={staticStyles.actor_image} />
          </View>
        </View>
        <View style={styles.buttonView}>
          <Text></Text>
          <GeneralButton text='Give Up' textStyle={buttonStyles.endGameText} touchStyle={buttonStyles.endGameButton} onPress={() => navigate('LaunchScreen')} />
        </View>
          <DropdownAlert
          ref={(ref) => this.dropdown = ref}
          onClose={(data) => this.onClose(data)}
          closeInterval={1500}
          containerStyle={{backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 0, justifyContent: 'center'}}
          messageStyle={{color: 'black', textAlign: 'center', paddingBottom: 10}}
          titleNumOfLines={0}
          messageNumOfLines={1} />
      </View>
    )
  }

  showAlert(alertType, title, message) {
    this.dropdown.alertWithType(alertType, title, message)
  }

  onClose(data) {
    console.log(data);
  }
}
