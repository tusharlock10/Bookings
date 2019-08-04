import React from "react"
import { StyleSheet, Text, View} from "react-native"
import * as Facebook from 'expo-facebook';
import { Calendar } from 'react-native-calendars'
import { Card, SocialIcon, Divider } from 'react-native-elements';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      signedIn: false,
      name: "",
      id:null,
      selectedDay: "",
      error:''
    }
  }
  signIn = async () => {
    try {
      const {
        type,
        token
      } = await Facebook.logInWithReadPermissionsAsync('2329203993862500', {
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        data = await response.json()

        if (data.error){
          this.setState({error:'Limit reached, Try after 1 hr'})
        }
        else {this.setState({signedIn:true, name: data.name, id: data.id })}

      } else {
        this.setState({error:'SignIn error, please try again' })
        console.log('Not successful')
      }
    } catch ({ message }) {
      console.log('Error: ', message)
    }
  }

  LoggedInPage () {
    console.log('Got state: ', this.state)
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          <Text style={{fontWeight:'100'}}>{'Hi, '}</Text>
        {this.state.name}</Text>
        <Text style={styles.text}>Choose your booking date</Text>
        <Divider style={{ backgroundColor: 'blue' }} />
        <Card containerStyle={{borderRadius:20, elevation:5}}>
          <Calendar
            onDayPress={(day) => {this.setState({selectedDay:day.dateString})}}
            monthFormat={'MMMM yyyy'}
            markedDates={{[this.state.selectedDay]:{selected:true}}}
          />
        </Card>
        <View style={{margin:10,}}>
          <Text style={styles.text}>Customer ID: {this.state.id}</Text>
          {(this.state.selectedDay!=='')?
          <Text style={styles.text}>Date selected for booking: {this.state.selectedDay}</Text>:
          <View/>}
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.signedIn ? (
          this.LoggedInPage()
        ) : (
          <LoginPage signIn={this.signIn} error={this.state.error}/>
        )}
      </View>
    )
  }
}

const LoginPage = props => {
  return (
    <View>
      <Text style={styles.header}>Sign In With Facebook</Text>
      <SocialIcon
        title='Sign In With Facebook'
        button
        type='facebook'
        raised={true}
        onPress={props.signIn}
      />
      {
        (props.error==='')?
        <View/>:
        <Text style={{textAlign:'center', color:'red'}}>{props.error}</Text> 
      }
    </View>
  )
}

const CustomDay = props => {
  return(
    <View style={{borderRadius:10}}>
      {props.day}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    fontSize: 30,
    color:'rgb(30,30,30)',
    fontWeight:'bold'
  },
  text:{
    fontSize:16,
    fontWeight:'100',
    color:'rgb(100,100,100)'
  }
})