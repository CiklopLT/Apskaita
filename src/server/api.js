import JWT from "expo-jwt";
// import jwt from "react-native-jwt";
import jwt from "react-native-pure-jwt";
import * as actions from '../common/actions/actions';
import configureStore from '../common/store/configureStore';
import * as SecureStore from 'expo-secure-store';
const jwtDecode = require('jwt-decode');

let url = 'https://www.dnsb.eu/api';
let secret = '2010ad0c-bb5b-4cb9-b02b-797fe9fd544a';
const store = configureStore({});
let token = '';

export const getToken = () => {
  return SecureStore.getItemAsync('token')
    .then((t) => {
      token = t;
      return t;
    })
    .catch(() => token = '')
};

export const removeToken = () => {
  return SecureStore.deleteItemAsync('token')
    .then(() => store.dispatch(actions.del_token()))
};


const formatRequest = (jti, data) => {
  let payload = {
    jti,
    iat: Math.floor(new Date().getTime()/1000)-7200,
    nbf: Math.floor(new Date().getTime()/1000)-7200,
    exp: Math.floor(new Date().getTime()/1000)+7200,
    iss: 'dnsb.eu',
    data: { ...data }
  };
  return JWT.encode(payload, secret);
};

const formatRequestForm = (params) => {
  const jti = token;
  const files_included = !!(params && params.file);
  let jwt = formatRequest(jti, params);
  let user_data = new FormData();
  user_data.append('jwt', jwt);
  if (files_included) {
    params.file.forEach((doc, i) => {
      if (doc.name) {
        user_data.append('doc', {
          uri: doc.uri,
          type: doc.type,
          name: doc.name
        });
      } else {
        // treat it as a taken photo with camera
        user_data.append('photo', {
          uri: doc,
          type: 'image/jpeg',
          name: `photo_${i}`
        });
      }
    });
  }
  return user_data;
};

const parseResponse = (response) => {
  return response.json()
    .then((data) => {
      if (data.status) {
        return jwtDecode(data.jwt);
      } else {
        return false;
      }
    });
};

const makeRequest = (service, data) => {
  return fetch(`${url}/${service}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    },
    body: data
  })
};

export const loginRequest = (username, password) => {
  let login_data = new FormData();
  login_data.append('username', username);
  login_data.append('password', password);

  return makeRequest('login', login_data)
    .then(parseResponse)
    .then((decoded) => {
      if (decoded && decoded.jti) {
        SecureStore.setItemAsync('token', decoded.jti);
        SecureStore.setItemAsync('credentials', JSON.stringify({ usr: username, psw: password }));
        store.dispatch(actions.set_token(decoded.jti));
        return decoded.data;
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export const forgotPasswordRequest = (email) => {
  let data = new FormData();
  data.append('email', email);

  return makeRequest('resetPassword', data)
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const getAdditionalDataRequest = () => {
  return getToken()
    .then((token) => {
      if (!token) return false;
      let jwt = formatRequest(token, {});
      let user_data = new FormData();
      user_data.append('jwt', jwt);
      return makeRequest('user', user_data)
        .then(parseResponse)
        .then((decoded) => {
          if (!decoded) return false;
          let return_data = decoded.data;
          return_data.rights = decoded.rights;
          return return_data;
        })
    })
};

export const getMasterAccounts = () => {
  return makeRequest('user/masterAccounts', formatRequestForm({}))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const switchUser = (params) => {
  return makeRequest('user/switchUser', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => {
      if (decoded && decoded.jti) {
        SecureStore.setItemAsync('token', decoded.jti);
      }
      return decoded;
    })
    .catch((error) => console.error(error));
};

export const getPersonalDataRequest = () => {
  return makeRequest('user/getSettings', formatRequestForm({}))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const setPersonalDataRequest = (params) => {
  return makeRequest('user/saveSettings/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const saveExtraPersonRequest = (params) => {
  return makeRequest('user/saveExtraPerson/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const deleteExtraPersonRequest = (params) => {
  return makeRequest('user/deleteExtraPerson/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const changePassword = (params) => {
  return makeRequest('user/setPassword/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const taxRequest = (params) => {
  return makeRequest('tax/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const allTaxesRequest = (params) => {
  return makeRequest('tax/history/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const meterRequest = (params) => {
  return makeRequest('meters/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const meterHistoryRequest = (params) => {
  return makeRequest('meters/history/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const meterSaveRequest = (params) => {
  return makeRequest('meters/save/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const newsRequest = (params) => {
  return makeRequest('news/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const newsCreate = (params) => {
  return makeRequest('news/save/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const newsDelete = (params) => {
  return makeRequest('news/delete/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const newsCommentCreate = (params) => {
  return makeRequest('news/comment/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const ideasRequest = (params) => {
  return makeRequest('ideas/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const ideasSaveRequest = (params) => {
  return makeRequest('ideas/save/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const ideasMasterCreateRequest = (params) => {
  return makeRequest('ideas/pirmSave/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const votesRequest = (params) => {
  return makeRequest('votings/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const votesQuestionsRequest = (params) => {
  return makeRequest('votings/voting', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded.data)
    .catch((error) => console.error(error));
};

export const votesCreateVoteRequest = (params) => {
  return makeRequest('/votings/save', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded.data)
    .catch((error) => console.error(error));
};

export const votesCreateQuestionRequest = (params) => {
  return makeRequest('/votings/saveQuestion', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const votesAnswerQuestionRequest = (params) => {
  return makeRequest('/votings/vote', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const votesCreateAnswerRequest = (params) => {
  return makeRequest('/votings/saveAnsw', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const contactsRequest = (params) => {
  return makeRequest('contact/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const serviceProvidersRequest = (params) => {
  return makeRequest('serviceProviders/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const partnersRequest = (params) => {
  return makeRequest('partners/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const docsRequest = (params) => {
  return makeRequest('docs/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const docsUploadRequest = (params) => {
  return makeRequest('docs/upload', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const financesRequest = () => {
  return makeRequest('finance/', formatRequestForm({ last_months: 12 }))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const tasksRequest = () => {
  return makeRequest('tasks/', formatRequestForm({ perPage: 50, executor: '' }))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const tasksSave = (params) => {
  return makeRequest('tasks/save/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const tasksSaveReply = (params) => {
  return makeRequest('tasks/reply/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const notesRequest = () => {
  return makeRequest('/notepad', formatRequestForm())
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const notesSave = (params) => {
  return makeRequest('notepad/save/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const notesDelete = (params) => {
  return makeRequest('notepad/delete/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const smsRequest = (params) => {
  return makeRequest('sms/', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const smsCreditRequest = (params) => {
  return makeRequest('sms/credits', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const smsRecipientsRequest = (params) => {
  return makeRequest('sms/recipients', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const smsTopUp = (params) => {
  return makeRequest('sms/buycredits', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const smsSend = (params) => {
  return makeRequest('sms/send', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const emailRequest = (params) => {
  return makeRequest('mail', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const emailRecipientsRequest = (params) => {
  return makeRequest('mail/recipients', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const emailSend = (params) => {
  return makeRequest('mail/send', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const invoicesIssuedRequest = () => {
  const params = {type: 't'};
  return makeRequest('invoices', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const invoicesReceivedRequest = () => {
  const params = {type: 'p'};
  return makeRequest('invoices', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const statementsRequest = (params) => {
  let accId = params && params.acc_id;
  return makeRequest('statements', formatRequestForm({ accId }))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const ownersRequest = () => {
  return makeRequest('owners', formatRequestForm({perPage: 200}))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

export const debtorsRequest = (params) => {
  return makeRequest('debtors', formatRequestForm(params))
    .then(parseResponse)
    .then((decoded) => decoded)
    .catch((error) => console.error(error));
};

