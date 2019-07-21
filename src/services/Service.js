import axios from 'axios';
import {BASE_URL} from "../config/constants.json"
const env = process.env.REACT_APP_ENV || 'development';

export default class ToDoService {

    getToDos() {
      return  axios.get(BASE_URL[env] + '/todos');
    }

    newToDo(todo) {
       return axios.post(BASE_URL[env] + '/todos',todo);
    }

    updateStatus(id,todo){

        return axios.put(BASE_URL[env]+ `/todos/${id}`,todo);
    }

    deleteToDo(id){
        return axios.delete(BASE_URL[env]+`/todos/${id}`);
    }
};


