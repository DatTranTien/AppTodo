import React from 'react';
import { registerRootComponent } from 'expo';
import firebase from 'firebase';
import {firebaseConfig} from './config';
import AddScreen from './screens/AddScreen';

firebase.initializeApp(firebaseConfig); 

export default class App extends React.Component {
  render(){
    return (
      <AddScreen/>
    );
  }
  
}
registerRootComponent(App);
