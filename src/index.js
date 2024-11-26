import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Modal from "react-modal";
import { AuthProvider } from './config/AuthProvider';
import './assets/styles/main.css';

Modal.setAppElement("#root");

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root')
);