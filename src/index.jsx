import React from 'react';
import ReactDOM from 'react-dom';
import './style.scss';



let xhr = new XMLHttpRequest();
let currentUser;


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
        xhr2.send(JSON.stringify({user_name: username, password: password}))
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

    let items;
    let set = this;

    this.toggleTagWindow = this.toggleTagWindow.bind(this);

    this.state={list: [], score: 0, toggledTagWindow: false, toggledEditWindow: false, filter: "", itemExists: false};

     
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

    let items = this.items; 
    let set = this;
    let bool;
    

    for(let x of items) {
      if (x.name == name.trim()) {
        bool = true;
      }
    }

    if(bool) {

      set.setState({itemExists: true})
       setTimeout(function() {
         set.setState({itemExists: false})
       }, 1000);
      } else {
    

      xhr2.open('POST', '/api/items/');
      xhr2.setRequestHeader("Content-Type", "application/json");
    
      xhr2.send(JSON.stringify({name: name, user_name: user}));

      xhr.open('GET', '/api/items/', true);
      xhr.responseType = 'json';

      xhr.onload = function () {
      items = xhr.response;
      
      set.setState({list: items});
      }
    xhr.send(null);
  }
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

      if(tag.trim() != "") {

      let xhrTag = new XMLHttpRequest;
      xhrTag.open("PUT", '/api/' + this.currentItem + '/')
      xhrTag.setRequestHeader("Content-Type", "application/json");
      xhrTag.send(JSON.stringify({tag: tag}));

      xhr.open('GET', '/api/items/', true);
      xhr.responseType = 'json';

      xhr.onload = function () {
        let items = xhr.response;
      
        set.setState({list: items});
      }
      xhr.send(null);
      this.setState({toggledTagWindow: false});
    }
  }

  editName() {
    let new_name = document.getElementsByName("new_name")[0].value;
    let set = this;

    let xhrName = new XMLHttpRequest;

    xhrName.open("PUT", '/api/name/' + this.currentItem + '/')
    xhrName.setRequestHeader("Content-Type", "application/json");
    xhrName.send(JSON.stringify({new_name: new_name}));

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
  <div className="container">
      <div className="box-item">
      <input className = "todo_input" type="text" name="filter" placeholder="search a tag"></input>
      <button onClick={() => this.filter()} style = {{marginBottom: "10px"}}> search </button>
      <div>
      {this.state.list.map(function(element, idx){
        if(set.state.filter != "") {
          if(element.user_name === currentUser.user_name && element.tag === set.state.filter) {
            return (
              <ul>
              <li class="item" key={idx}>{element.name} <button className = "item_button" onClick={() => set.toggleTagWindow(true, element.name)}>tag item</button>
            <button className = "item_button" onClick={() => set.toggleEditWindow(true, element.name)}>edit</button>
            </li>
            </ul>)
          }
        } else {
          if(element.user_name === currentUser.user_name) {
            return (
              <ul>
              <li class = "item" key={idx}>{element.name} <button className = "item_button" onClick={() => set.toggleTagWindow(true, element.name)}>tag item</button>
            <button className = "item_button" onClick={() => set.toggleEditWindow(true, element.name)}>edit</button>
            </li>
            </ul>)
          }
        }
        })}
       </div>
       {this.state.toggledTagWindow && <div className = "popup">
       <div className = "inner_popup">
       <div className = "container">
       <input type="text" name="tag" placeholder="tag"></input>
       <button className = "item_button" onClick={this.addTag.bind(this)}> save </button>
       <button className = "item_button" onClick={() => this.toggleTagWindow(false)}> cancel </button>
       </div>
       </div>
       </div>}
       {this.state.toggledEditWindow && <div className = "popup">
       <div className = "inner_popup">
       <div className = "container">
       <input type="text" name="new_name" placeholder="new name"></input>
       <button className = "item_button" onClick={this.editName.bind(this)}> save </button>
       <button className = "item_button" onClick={() => this.toggleEditWindow(false)}> cancel </button>
       </div>
       </div>
       </div>}
       <input type="text" name="item" placeholder="item name"></input>
       <button onClick={() => this.addItem()}> create </button>
       {this.state.itemExists && <div style={{color:'rgb(255, 17, 0)'}}>Item already exists</div>}
       </div>
       <div><button type="button" name="logout" className="logout_button" onClick={this.logOut.bind(this)}>
         Log out
         </button>
       </div>
       </div>
       </div>);
  }
  }



  ReactDOM.render(<App/>, document.getElementById('root'));
