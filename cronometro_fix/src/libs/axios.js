/* eslint-disable */ 
import Vue from 'vue'

// axios
import axios from 'axios'
import { getUserData } from '@/auth/utils'

let setBaseURL = null

if(process.env.NODE_ENV === 'development') {
  // Em desenvolvimento
  setBaseURL = 'https://arcane-cliffs-26136.herokuapp.com/api'
  //setBaseURL = 'http://localhost/api'
}else {
  // Em produção
  setBaseURL = 'https://arcane-cliffs-26136.herokuapp.com/api'
}

// const user = getUserData(); 
const token = JSON.parse(localStorage.getItem('userData'))
const axiosIns = axios.create({
  baseURL: setBaseURL,
  timeout: 1000000,
  headers: {
    'application': 'json',
    'Authorization': token == null ? '' : `Bearer ${token.token}`,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin' : '*'
  }
})

Vue.prototype.$http = axiosIns

export default axiosIns
