import axios from 'axios';
import config from '../../config/config';

// axios returns a JSON response

export default async function axiosClient(request) {
  console.log('>>>>>>>>>>>>>>>> axiosClient(request) <<<<<<<<<<<<<<<<<<<<<<');
  const data = await axios.get(request)
    .then(response => {
      console.log('>>>>>>>>>>>>>>>> axiosClient.then(response) <<<<<<<<<<<<<<<<<<<<<<');
      return {error: null, isLoading: null, response: response};
    })
    .catch(error => {
      console.log('>>>>>>>>>>>>>>>> axiosClient.catch(error) <<<<<<<<<<<<<<<<<<<<<<');
      return {error: true, isLoading: false, response: error};
    });
  return data;
};

// export default async function axiosClient(request) {
//   try {
//     const response = await axios.get(request);
//     return {error: null, isLoading: null, response: response};
// 
//   } catch (error) {
//     return {error: true, isLoading: false, response: error};
//   }
// };

// async fetchUsersAsync() {
//   try {
//     this.setState({...this.state, isFetching: true});
//     const response = await axios.get(USER_SERVICE_URL);
//     this.setState({users: response.data, isFetching: false});
//   } catch (e) {
//     console.log(e);
//     this.setState({...this.state, isFetching: false});
//   }
// };
// 
// fetchUsers = this.fetchUsersAsync;