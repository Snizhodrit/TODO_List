import React from 'react';
import ReactDOM from 'react-dom';
import './style.scss';
import Ripples from 'react-ripples';



let xhr = new XMLHttpRequest();
let currentUser;

  

// xhr.open('POST', '/api/users/');
// xhr.setRequestHeader("Content-Type", "application/json");
// xhr.send(JSON.stringify({user_name: "user3", password: "password3", score: 0}));

// xhr.open("PUT", '/api/user1')
// xhr.setRequestHeader("Content-Type", "application/json");
// xhr.send(JSON.stringify({score: 0}));



class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      LoginOpen: true,
      RegistrationOpen: false,
      
    };
  }
  

  showRegistrationBox(){
    this.setState({RegistrationOpen: true, LoginOpen: false});
  }

  showLoginBox(){
    this.setState({LoginOpen: true, RegistrationOpen: false});
  }

  showMainPage(){
    this.setState({LoginBox:false, RegistrationBox: false, MainPageOpen: true});
  }
  

   render() {

    

     return (
       
      <div className= "root-container">
        <div className = "box-controller">
        <div className = {"controller " + (this.state.LoginOpen ? "selected-controller": "")}  onClick={this.showLoginBox.bind(this)}>
          Login
          </div>
          <div name = "registerTab" className = {"controller " + (this.state.RegistrationOpen ? "selected-controller": "")} onClick={this.showRegistrationBox.bind(this)}>
          Register
          </div>
          {/* <div className = {"controller " + (this.state.MainPageOpen ? "selected-controller": "")} onClick={this.showMainPage.bind(this)}>
         Main Page
          </div> */}
        </div>

        <div className="box-container">
          {this.state.LoginOpen && <LoginBox/>}
          {this.state.RegistrationOpen && <RegistrationBox/>}
          
        </div>

     </div>
     )
  } 
}

class LoginBox extends React.Component {

  constructor(props){
    super(props);
    this.state={ 
      WarningOpen: false
    };
  }

  loginSubmit() {
    let set = this;
    xhr.open('GET', '/api/users/', true);
    xhr.responseType = 'json';
    let username;
    let password;
    let users = [];

    xhr.onload = function () {
      users = xhr.response;
      console.log({users})
      username = document.getElementsByName("username")[0].value;
      password = document.getElementsByName("password")[0].value;
      let correct = false;
      

      for(let x of users) {
        if(username === x.user_name && password === x.password) {
          currentUser = x;
          correct = true;
        }
      }

      if(correct) {
        ReactDOM.render(<MainPage/>, document.getElementById('root'));
      } else {
        set.setState({WarningOpen: true})
        setTimeout(function() {
          set.setState({WarningOpen: false})
        }, 1000);
      }
    }
    xhr.send(null);
  }

  render(){
    return(

    <div className="inner-container">
      <div className="header">
        Login
      </div>

      < div className="box">

           < div className="input-group">
            <label htmlFor="username"></label>
            <input type="text" name="username" className="login-input" placeholder="Username"/>
          </div>

          < div className="input-group">
            <label htmlFor="password"></label>
            <input type="password" name="password" className="login-input" placeholder="Password"/>
            {this.state.WarningOpen && <div style={{color:'rgb(255, 17, 0)'}}>Incorrect username/password</div>}
          </div>
          <button type="button" className="login-button" onClick={this.loginSubmit.bind(this)}>Login</button>
        </div>
    </div>);
  }
}


class RegistrationBox extends React.Component {

  constructor(props){
    super(props);
    this.state=this.state={ 
      WarningOpen: false,
      UserExists: false
    };
  }

  registerSubmit(){

    let set = this;
    xhr.open('GET', '/api/users/', true);
    xhr.responseType = 'json';
    

    xhr.onload = function () {
      let users = [];
      users = xhr.response;
      let username = document.getElementsByName("username")[0].value;
      let password = document.getElementsByName("password")[0].value;
      let bool = false;
      console.log({users})
      for(let x of users) {
        if (x.user_name == username.trim()) {
          bool = true;
        }
      }

      if(bool) {
        set.setState({UserExists: true})
        setTimeout(function() {
          set.setState({UserExists: false})
        }, 1000);
      } else if(username.trim() == "" || password.trim() == "") {
        set.setState({WarningOpen: true});
        setTimeout(function() {
        set.setState({WarningOpen: false})
        }, 1000);
      } else {
        let xhr2 = new XMLHttpRequest;

        xhr2.open('POST', '/api/users/');
        xhr2.setRequestHeader("Content-Type", "application/json");
        xhr2.send(JSON.stringify({user_name: username, password: password, score: 0}))
      }

    }
    xhr.send(null);    
  }

  render(){
    return(

    <div className="inner-container">
      <div className="header">
        Register
      </div>

      < div className="box">

           < div className="input-group">
            <label htmlFor="username"></label>
            <input type="text" name="username" className="login-input" placeholder="Username"/>
          </div>

          < div className="input-group">
            <label htmlFor="password"></label>
            <input type="password" name="password" className="login-input" placeholder="Password"/>
          </div>
          {this.state.WarningOpen && <div style={{color:'rgb(255, 17, 0)'}}>Cannot submit blank</div>}
          {this.state.UserExists && <div style={{color:'rgb(255, 17, 0)'}}>User already exists</div>}
          <button type="button" className="login-button" onClick={this.registerSubmit.bind(this)}>Register</button>
        </div>
    </div>);
  }
 }


 class MainPage extends React.Component {

  items = [];

  constructor(props){
    super(props);
    // this.state={list: [], score: currentUser.score};

    let items;
    let set = this;

    // xhr.open('GET', '/api/items/', true);
    // xhr.responseType = 'json';

    // xhr.onload = function () {
    //   users = xhr.response;
      
    //   set.setState({list: users});
    // }
    // xhr.send(null);

    this.toggleTagWindow = this.toggleTagWindow.bind(this);

    this.state={list: [], score: 0, toggledTagWindow: false, toggledEditWindow: false, filter: ""};

     
    let currentItem;

    xhr.open('GET', '/api/items/', true);
    xhr.responseType = 'json';

    xhr.onload = function () {
      items = xhr.response;
      
      set.setState({list: items});
    }
    xhr.send(null);
  }

  logOut() {
    ReactDOM.render(<App/>, document.getElementById('root'));
  }

  addItem() {
    let xhr2 = new XMLHttpRequest;
    let name = document.getElementsByName("item")[0].value;
    let user = currentUser.user_name;

    xhr2.open('POST', '/api/items/');
    xhr2.setRequestHeader("Content-Type", "application/json");
    
    xhr2.send(JSON.stringify({name: name, user_name: user}));

    let items = this.users; 
    let set = this;

    xhr.open('GET', '/api/items/', true);
    xhr.responseType = 'json';

    xhr.onload = function () {
      items = xhr.response;
      
      set.setState({list: items});
    }
    xhr.send(null);
  }

  toggleTagWindow(toggle, name) {
    this.setState({toggledTagWindow: toggle});
    this.currentItem = name;
  }

  toggleEditWindow(toggle, name) {
    this.setState({toggledEditWindow: toggle});
    this.currentItem = name;
  }

  addTag() {
    let tag = document.getElementsByName("tag")[0].value;
    let set = this;

    let xhr55 = new XMLHttpRequest;
    xhr55.open("PUT", '/api/' + this.currentItem + '/')
    xhr55.setRequestHeader("Content-Type", "application/json");
    xhr55.send(JSON.stringify({tag: tag}));

    xhr.open('GET', '/api/items/', true);
    xhr.responseType = 'json';

    xhr.onload = function () {
      let items = xhr.response;
      
      set.setState({list: items});
    }
    xhr.send(null);
    this.setState({toggledTagWindow: false});
  }

  editName() {
    let new_name = document.getElementsByName("new_name")[0].value;
    let set = this;

    let xhr55 = new XMLHttpRequest;

    xhr55.open("PUT", '/api/name/' + this.currentItem + '/')
    xhr55.setRequestHeader("Content-Type", "application/json");
    xhr55.send(JSON.stringify({new_name: new_name}));

    xhr.open('GET', '/api/items/', true);
    xhr.responseType = 'json';

    xhr.onload = function () {
      let items = xhr.response;
      
      set.setState({list: items});
    }
    xhr.send(null);

    this.setState({toggledEditWindow: false});
  }

  filter() {
    let filter = document.getElementsByName("filter")[0].value;
    this.setState({filter: filter});
  }


  render(){
    let set = this;
    
    return(
  <div> 
  <div className="root-container">
      <div className="box-item">
      <input type="text" name="filter" placeholder="search a tag"></input>
      <button onClick={() => this.filter()}> search </button>
      <div>
      {this.state.list.map(function(element, idx){
        if(set.state.filter != "") {
          if(element.user_name === currentUser.user_name && element.tag === set.state.filter) {
            return (<li key={idx}>{element.name} <button onClick={() => set.toggleTagWindow(true, element.name)}>tag item</button>
            <button onClick={() => set.toggleEditWindow(true, element.name)}>edit</button>
            </li>)
          }
        } else {
          if(element.user_name === currentUser.user_name) {
            return (<li key={idx}>{element.name} <button onClick={() => set.toggleTagWindow(true, element.name)}>tag item</button>
            <button onClick={() => set.toggleEditWindow(true, element.name)}>edit</button>
            </li>)
          }
        }
        })}
       </div>
       {this.state.toggledTagWindow && <div className = "popup">
       <div className = "inner_popup">
       <input type="text" name="tag" placeholder="tag"></input>
       <button onClick={this.addTag.bind(this)}> add tag </button>
       <button onClick={() => this.toggleTagWindow(false)}> cancel </button>
       </div>
       </div>}
       {this.state.toggledEditWindow && <div className = "popup">
       <div className = "inner_popup">
       <input type="text" name="new_name" placeholder="new name"></input>
       <button onClick={this.editName.bind(this)}> add tag </button>
       <button onClick={() => this.toggleEditWindow(false)}> cancel </button>
       </div>
       </div>}
       <input type="text" name="item" placeholder="item name"></input>
       <button onClick={() => this.addItem()}> create </button>
       </div>
       <div><button type="button" name="logout" style={{color:'rgb(255, 8, 127)', background:'rgb(65, 75, 85)', height:50, width:100, fontSize:20}} className="btn btn-primary" onClick={this.logOut.bind(this)}>
         Log out
         </button>
       </div>
       </div>
       </div>);
  }
  }



  ReactDOM.render(<App/>, document.getElementById('root'));
