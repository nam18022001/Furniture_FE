import axios from 'axios';
// const baseURL = 'https://furniture-be.onrender.com/';
const baseURL = 'http://localhost:8080';

axios.defaults.baseURL = baseURL;

// Important: If axios is used with multiple domains, the AUTH_TOKEN will be sent to all of them.
// See below for an example using Custom instance defaults instead.

axios.defaults.headers.post['Content-Type'] = 'application/json';
export { baseURL };
export default axios;
