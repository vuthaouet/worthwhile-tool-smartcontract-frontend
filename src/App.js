import React, {useEffect, useState} from 'react';
import { Button } from 'antd';
import './App.css';
import ReactDOM from "react-dom";
import MyUpload from "./api/upload"
import PicturesWall from "./test";
import Demo from "./api/test2";

function App() {
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        fetch('/time').then(res => res.json()).then(data => {
            setCurrentTime(data.time);
        });
    }, []);

    return (
        <div className="App" style={{width: '80%',margin : 'auto'}}>
            <h1>Smart Contract Security Analysis.</h1>
            <MyUpload/>
        </div>
    );



}


export default App;