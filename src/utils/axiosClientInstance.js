import axios from 'axios';
import config from '../../config/config';

// Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://localhost:3030/. 
// (Reason: CORS header ‘Access-Control-Allow-Origin’ missing).

// headers: { 'Access-Control-Allow-Origin': '*' }
// res.header( 'Access-Control-Allow-Origin', '*' );

// axios returns a JSON response

export default async function axiosClientInstance(request) {

  // const options = {
  //   method: 'get',
  //   headers: { 'Access-Control-Allow-Origin': '*' },
  //   request,
  // };

  const instance = axios.create({ baseURL: `http://${config.host}:${config.port}` });

  console.log('>>>>>>>>>>>>>>>> axiosClientInstance(request) > instance: ', instance);

  // Add a request interceptor
  // instance.interceptors.request.use(function (config) {
  //     // Do something before request is sent
  //     conf.headers.Cookie = req.header('cookie');
  //     return conf;
  //   },;

  try {
    const response = await instance.get(request);
    return {error: null, isLoading: null, response: response};
  
  } catch (error) {
    return {error: true, isLoading: false, response: error};
  }
}
