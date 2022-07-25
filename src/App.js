import Header from "./components/Header";
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";
import { useState, useEffect } from 'react'

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks]= useState([])

  //HTTP Requests
  useEffect( () => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    }

    getTasks()
  }, []) 

  //Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/Tasks')

    const data = await res.json();

    return data;
  }

  //Fetch Tasks
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/Tasks/${id}`)

    const data = await res.json();

    return data;
  }

  //Add Task
  const addTask = async (task) => {
    //Post Request
    const res = await fetch('http://localhost:5000/Tasks',{
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json();
    setTasks([...tasks, data])

    //For file operations
    // const id = Math.floor(Math.random()*10000)+1
    
    // const newTask = {id, ...task}
    // setTasks([...tasks, newTask])
  }

  //Delete Task - with delete request
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/Tasks/${id}`,{method:'DELETE'})
    setTasks(tasks.filter((task) => task.id !== id));
  }

  //Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const upTask = {...taskToToggle, reminder:!taskToToggle.reminder};

    const res = await fetch(`http://localhost:5000/Tasks/${id}`,{
      method:'PUT',
      headers:{
        'Content-type': 'application/json'
      },
      body: JSON.stringify(upTask)
    })

    const data = await res.json();

    setTasks(tasks.map((task) => task.id === id ? {...task, reminder: !data.reminder}: task));
    console.log(tasks);
  }

  return (
    <Router>
      <div className="container">
        <Header onAdd={() => {setShowAddTask(!showAddTask)}} showAddTask={showAddTask}/> 
        {showAddTask && <AddTask onAdd={addTask} />}
        {tasks.length > 0 ? <Tasks tasks= {tasks} onDelete={deleteTask} onToggle={toggleReminder}/>: 'No Tasks To Show'}
        <Route path='/about' component={About} />
        <Footer/>
      </div>
    </Router>
  );
}
export default App;
