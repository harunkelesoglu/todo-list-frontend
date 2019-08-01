import React, { Component } from "react";
import Service from './services/Service';
import "./App.css"

const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const todoService = new Service();
/*eslint no-unused-expressions: ["error", { "allowShortCircuit": true }]*/
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      tasks: null,
      task: null
    }
  }

  componentWillMount() {
    todoService.getToDos()
    .then((res) => {
      const tasks = res.data.data;
      this.setState({ tasks })
    })
    .catch(err => {
      console.error(err);
    })
  }

  addTask() {
    const { task } = this.state;
    if (task && task.trim()) {
      todoService.newToDo({name:task})
      .then( res => {
        const {data} = res.data
        const tasks = Object.assign([],this.state.tasks);
        tasks.push(data);
        this.setState({tasks});
        this.setState({task:''});
      })
      .catch( err => {
        console.error(err);
      })
    }
  }

  handleChange(e){
    this.setState({[e.target.name]:e.target.value})
  }

  closeModal() {
    const modal = document.getElementById('newToDo');
    modal.style.display = 'none';
  }

  deleteTask(index,e){
    const { id } = e.target.parentNode;
    todoService.deleteToDo(id)
    .then( res => {
      const tasks = Object.assign([],this.state.tasks);
      tasks.splice(index,1);
      this.setState({tasks})
    })
    .catch(err => {
      console.log(err);
    })
  }

  checkTask(index,e) {
    const taskElement = e.target.parentNode;
    const id = taskElement.id;
    let status = taskElement.dataset.status;
    if(status === 'incompleted'){
      status = 'completed';
    }else if(status === 'completed'){
      status = 'incompleted';
    }

      todoService.updateStatus(id,{status})
      .then(res => {
        const {data} = res.data;
       const tasks = Object.assign([],this.state.tasks);
       tasks[index] = data;
       this.setState({tasks});
      })
      .catch( err => {
        console.error(err);
      })
  }
  render() {
    const { date, tasks, task } = this.state;
    return (
      <div id="app">
        <div className="todo-container">
          <header className="current-date">
            <div className="date">
              <span className="day-number">{date.getDate()}</span>
              <div className="month-year-wrapper">
                <span className="month">{months[date.getMonth()]}</span>
                <span className="year">{date.getFullYear()}</span>
              </div>
            </div>
            <div className="today"><span>{days[date.getDay()]}</span></div>
          </header>
          <main className="todo-list">
            <ul className="tasks-container slide-fade">
            {tasks &&
                tasks.map((item,index) => {
                  return <li className={`task-container ${item.status === 'completed'  && 'checked'}`} id={item._id} data-status={item.status}>
                  <input type="radio" onClick={this.checkTask.bind(this, index)} />
                  <p className="task"> {item.name} </p>
                  <input type="button" onClick={this.deleteTask.bind(this,index)} value="X" />
              </li>
                })

              }
            </ul>
          </main>
          <button className="add-task-btn" onClick={this.addTask.bind(this)}>
            <span>+</span>
          </button>
        </div>
        <div className="todo-container new-task">
        <input type="text" name="task" className="new-todo" onChange={this.handleChange.bind(this)} value={task} placeholder="Type todo..."/>
        </div>
        <div id="newToDo" className="modal">
          <div className="modal-content">
            <button className="close" onClick={this.closeModal.bind(this)}>&times;</button>  
          </div>
          </div>
        </div>

    );
  }

}

export default App;
