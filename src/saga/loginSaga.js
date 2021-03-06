import { put,takeLatest,call,select } from 'redux-saga/effects'
import { push,replace } from 'react-router-redux'
import {login} from '../services/api'
import { reloadAuthorized } from '../utils/Authorized';

 function* logincheck({payload}){

  const response = yield call(login, payload);

  

  yield put({
    type:'commonlogin',
    payload:{
      ...response,
      type:payload.type,
      currentAuthority:'admin',
    },
  })

  if(response.status === 200){

    reloadAuthorized();

    yield put(push("/"))

  }
}

function* logout({payload}){

  try {
    // get location pathname
    const urlParams = new URL(window.location.href);
    const pathname = yield select(state => state.routerReducer.location.pathname);
    // add the parameters in the url
    urlParams.searchParams.set('redirect', pathname);
    window.history.replaceState(null, 'login', urlParams.href);
  } finally {
    yield put({
      type: 'tologin',
      payload: {
        status: "",
        currentAuthority: 'guest',
      },
    });
    reloadAuthorized();
    yield put(push('/user/login'));
  }


}

 function* loginSaga() {

    yield takeLatest('getToken', logincheck)

    yield takeLatest('logout', logout)

  }

  export default loginSaga;