import React from "react";
import './style.scss';
import Ripples from 'react-ripples';


export class mainPage extends React.Component{
    render(){
        return(
            <div> 
            <div className="root-container">
            <Ripples >
         <button type="button" value="lol" style={{color:'rgb(232, 239, 243)', background:'rgb(37, 154, 243)', height:200, width:1200, fontSize:50}} className="btn btn-primary">
           test
         </button>
       </Ripples>
           <div className="box-item">
       
           </div>
               </div>
               </div>
        )
            
        
    }
    
}

export default mainPage;