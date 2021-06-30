import React ,{ Component }from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Modal, Pressable,
    RefreshControl,
} from 'react-native';
import firebase from "firebase";
import Note from './note';

const  wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
export default class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            noteArray: [],
            refreshing:false,
            noteText: '',
            temp: [],
            modalVisible: false,
            editText: '',
            getKey: '',
            getVal: '',
            lastRefresh: Date(Date.now()).toString(),
            uniqueValue: 1

        }
    }
 
    componentDidMount() {
        var date = new Date();

        this.setState({ noteArray: this.state.noteArray });

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const userSchedule = firebase
                    .firestore()
                    .collection("todo")
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            console.log(doc.id, "=>", doc.data().todo);
                            this.setState({
                                noteText: doc.data().todo
                            })
                            this.state.noteArray.push({
                                'date': date.getFullYear() +
                                    '/' + (date.getMonth() + 1) +
                                    '/' + date.getDate(),
                                'note': this.state.noteText
                            });

                            console.log('object')
                        });
 
                    })

                console.log('sfas')
            } else {
            }
        });
    }
    refreshScreen() {
      
        {
            window.location.reload(false);
        };
            }
   
      
    onRefresh =() => {
        this.setState({refreshing:true});
        wait(2000).then(() =>  this.setState({refreshing:false}));
        var date = new Date();

        this.setState({ noteArray: this.state.noteArray });

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const userSchedule = firebase
                    .firestore()
                    .collection("todo")
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            console.log(doc.id, "=>", doc.data().todo);
                            this.setState({
                                noteText: doc.data().todo
                            })
                            this.state.noteArray.push({
                                'date': date.getFullYear() +
                                    '/' + (date.getMonth() + 1) +
                                    '/' + date.getDate(),
                                'note': this.state.noteText
                            });

                            console.log('object')
                        });
                    })

                console.log('sfas')
            } else {
            }
        });

      };


    render() {

        let notes = this.state.noteArray.map((val, key) => {
            return <Note key={key} keyval={key} val={val}
                deleteMethod={() => this.deleteNote(key, val)}
                editMethod={() => {
                    this.setState({ modalVisible: true, getKey: key, getVal: val })


                }
                }

            />
        })


        return (
            <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={()=>this.onRefresh()}
                    />
                }
            >
                <Text>Last Refresh: {this.state.lastRefresh}</Text>
               <View >
               <TouchableOpacity style={{height:100,width:100}} onPress={()=>this.refreshScreen()} title="Refresh Screen" >
                    <Text>
                        click
                    </Text>
                </TouchableOpacity>
               </View>

                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>ToDo</Text>
                    </View>


                    <View style={styles.centeredView}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.modalVisible}
                            onRequestClose={() => {
                                Alert.alert("Modal has been closed.");
                                setModalVisible(!this.state.modalVisible);
                            }}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <View style={styles.footer}>
                                        <TextInput
                                            style={styles.textInput}
                                            onChangeText={(editText) => this.setState({ editText: editText })}
                                            // value={this.state.noteText}
                                            placeholder='Task'
                                            placeholderTextColor='white'
                                            underlineColorAndroid='transparent'>
                                        </TextInput>
                                    </View>
                                    <Pressable
                                        style={[styles.button, styles.buttonClose]}
                                        onPress={() => {
                                            this.setState({ modalVisible: !this.state.modalVisible })
                                            this.editNote(this.state.getKey, this.state.getVal)
                                        
                                        }}
                                    >
                                        <Text style={styles.textStyle}>Update</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </Modal>

                    </View>


                    <ScrollView style={styles.scrollContainer}>
                        {notes}
                    </ScrollView>

                    <View style={styles.footer}>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={(noteText) => this.setState({ noteText })}
                            value={this.state.xoteText}
                            placeholder='Task'
                            placeholderTextColor='white'
                            underlineColorAndroid='transparent'>
                        </TextInput>
                    </View>

                    <TouchableOpacity onPress={this.addTask.bind(this)} style={styles.addButton}>
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        );
    }

    addTask() {
        if (this.state.noteText) {
            var date = new Date();

            this.state.noteArray.push({
                'date': date.getFullYear() +
                    '/' + (date.getMonth() + 1) +
                    '/' + date.getDate(),
                'note': this.state.noteText
            });

            this.setState({ noteArray: this.state.noteArray });
            this.setState({ noteText: this.state.noteText });
            firebase.firestore()
                .collection('todo')
                .add({
                    todo: this.state.noteText,
                })
                .then(() => {
                    alert('Thêm thành công!')
                });
        }

    }

    deleteNote(key, val) {

        var date = new Date();

        this.setState({ noteArray: this.state.noteArray });
        // this.setState({noteText:this.state.noteText});

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const userSchedule = firebase
                    .firestore()
                    .collection("todo")
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // this.state.noteArray.forEach((element, index) => {
                            console.log('doc.data().todo====element.note' + doc.data().todo + val.note)
                            if (doc.data().todo === val.note && doc.data().todo != undefined) {
                                console.log('doc.id' + doc.id)
                                firebase.firestore()
                                    .collection('todo')
                                    .doc(doc.id)
                                    .delete()
                                    .then(() => {
                                        console.log('User deleted!');
                                    });

                                alert('Xoá Thành Công')

                            }

                        });
                    })
            } 
        });
  
    }
    editNote(key, val) {

        var date = new Date();

        this.setState({ noteArray: this.state.noteArray });

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const userSchedule = firebase
                    .firestore()
                    .collection("todo")
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            console.log('doc.data().todo====element.note' + doc.data().todo + val.note)
                            if (doc.data().todo === val.note && doc.data().todo != undefined) {
                                console.log('doc.id' + doc.id)
                                firebase.firestore()
                                    .collection('todo')
                                    .doc(doc.id)
                                    .update({
                                        'todo': this.state.editText,
                                    })
                                    .then(() => {
                                        alert('User updated!');
                                    });
                            }
                        });
                    })
            } else {
            }
        });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: '#3933FF',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 10,
        borderBottomColor: '#ddd',
    },
    headerText: {
        color: 'white',
        fontSize: 18,
        padding: 26,
    },
    scrollContainer: {
        flex: 1,
        marginBottom: 100,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    textInput: {
        alignSelf: 'stretch',
        color: '#fff',
        padding: 20,
        backgroundColor: '#252525',
        borderTopWidth: 2,
        borderTopColor: '#ededed',
    },
    addButton: {
        position: 'absolute',
        zIndex: 11,
        right: 20,
        bottom: 90,
        backgroundColor: '#3933FF',
        width: 90,
        height: 90,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 24,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: 200,
        height: 300
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    scrollView: {
        height:800
      },
});
