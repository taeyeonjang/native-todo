import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { theme } from './colors';


const STORAGE_KEY="@ToDoList"

export default function App() {

  const [Working, setWorking] = useState(true);
  const [TextValue, setTextValue] = useState("");
  const [ToDoList, setToDoList] = useState({});
  const [Completed, setCompleted] = useState(false)
  const [Scissors, setScissors] = useState(false)
  const [NewTextValue, setNewTextValue] = useState("");
  const [Id, setId] = useState("")


  useEffect(() => {
    loadToDoList();
    loadDisplay();
  }, [])

  const scissorsBtn = (id) => {
    setScissors(!Scissors)
    setId(id)
  }

  const addTwo = async(id) => {
    const newToDoList = {...ToDoList}
    newToDoList[id].TextValue = NewTextValue;
    setToDoList(newToDoList);
    saveToDoList(newToDoList);
    setNewTextValue("");
  }

  const CheckPress = (id) => {
    const newToDoList = {...ToDoList}
    newToDoList[id].Completed = !(newToDoList[id].Completed)
    setToDoList(newToDoList);
    saveToDoList(newToDoList);
  }
  
  const saveDisplay = async (display) => {
    await AsyncStorage.setItem('@Working', JSON.stringify(display))

  }
  
  const loadDisplay = async() => {
    const s = await AsyncStorage.getItem('@Working')
    if(s){
    setWorking(JSON.parse(s))
    }
  }

  const travel = () => {
    setWorking(false)
    saveDisplay(false)
  };
  const work = () => {
    setWorking(true)
    saveDisplay(true)
  };
  const onChange = (e) => setTextValue(e)
  const onNewChange = (e) => setNewTextValue(e)

  const saveToDoList = async(ToDoSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ToDoSave))

  }


  const loadToDoList = async() => {
    const s = await AsyncStorage.getItem(STORAGE_KEY)
    setToDoList(JSON.parse(s))
  }


  const addToDo = async () => {
    let str = TextValue.trim()
    if(TextValue =="" || str == ""){
      alert("공백입니다")
    } else {
      const newToDoList = {
      ...ToDoList,
      [Date.now()]: { TextValue, Working, Completed }
    };
      setToDoList(newToDoList);
      await saveToDoList(newToDoList)
      alert(Working ? 'Work 등록완료' : 'Travel 등록완료')
      setTextValue("");
    }
  }

  const deleteBtn =  (id) => {
    Alert.alert('Delete','are you sure?', [
      { text: 'Cancel'},
      { text: 'OK',
        style: "destructive",
      onPress: () => {
      const newTodoList = {...ToDoList};
      delete newTodoList[id];
      setToDoList(newTodoList);
      saveToDoList(newTodoList);
    }},
    ]);
  }



  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
        <View style={styles.header}>
          <TouchableOpacity onPress={work}>
            <Text style={{...styles.btnText, color: Working ? theme.white : theme.grey}}>Work</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={travel}>
            <Text style={{...styles.btnText, color: !Working ? theme.white : theme.grey}}>Travel</Text>
          </TouchableOpacity>
        </View>
        {Scissors ? 
         <TextInput
         onSubmitEditing={()=>addTwo(Id)} 
         style={styles.inputScissors}
         returnKeyType='done'
         value={NewTextValue}
         placeholder='수정해주세요'
         onChangeText={onNewChange}
         ></TextInput>
          : 
         <TextInput
         onSubmitEditing={addToDo}
         returnKeyType='done'
         value={TextValue}
         onChangeText={onChange} 
         placeholder={Working ? "Add a to do" : "Where do you want to go?"}style={styles.input}>
         </TextInput>
          }
         

         <ScrollView>
           {Object.keys(ToDoList).map(key => (
          ToDoList[key].Working === Working ? 
           <View style={styles.todo} key={key}>
             <Text style={styles.checkbox}>
               <TouchableOpacity onPress={()=>CheckPress(key)}>
                <Fontisto name={ToDoList[key].Completed ? "checkbox-active" : "checkbox-passive" } size={20} color={ToDoList[key].Completed ? 'grey' : 'white'}/>
               </TouchableOpacity>
            </Text>
             <Text style={{...styles.todoText, textDecorationLine: ToDoList[key].Completed ? 'line-through' : null,  opacity: ToDoList[key].Completed ? 0.2 : null }}>
               {ToDoList[key].TextValue}</Text>

               <TouchableOpacity onPress={() => scissorsBtn(key)}>
                <Fontisto style={styles.scissors} name="scissors" size={20} color="white" />
              </TouchableOpacity>
              
             <TouchableOpacity onPress={() => deleteBtn(key)}>
              <Text><Fontisto name="trash" size={18} color="black" /></Text>
            </TouchableOpacity>
           </View> : null
            ))}
         </ScrollView>
         

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 30,
  },
  header: {
    flexDirection:'row',
    justifyContent:'space-between',
  },
  btnText: {
    color:theme.white,
    marginTop:100,
    fontSize:45,
    fontWeight:'600',
  },
  inputScissors: {
    backgroundColor:'grey',
    marginVertical: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    fontSize: 15,
  },
  input: {
    backgroundColor:'white',
    marginVertical: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    fontSize: 18,
  },
  todo:{
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 15,
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'space-between'
  },
  todoText:{
    color:theme.white,
    fontSize: 16,
    fontWeight: '500'
  },
  checkbox:{
    marginTop:5
  },
});
