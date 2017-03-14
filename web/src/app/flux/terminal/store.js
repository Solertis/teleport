/*
Copyright 2015 Gravitational, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import { Store } from 'nuclear-js';
import { Record } from 'immutable';
import reactor from 'app/reactor';
import { nodeHostNameByServerId } from 'app/flux/nodes/getters';
import {
  TLPT_TERMINAL_OPEN,
  TLPT_TERMINAL_CLOSE,
  TLPT_TERMINAL_SET_STATUS
} from './actionTypes';


const TermStatusRec = new Record({
  isReady: false,
  isLoading: false,
  isNotFound: false,
  isError: false,
  errorText: undefined,
})

export class TermRec extends Record({
  status: TermStatusRec(),
  login: undefined,
  siteId: undefined,
  serverId: undefined,
  sid: undefined
}) {
  
  getServerLabel() {
    let hostname = reactor.evaluate(nodeHostNameByServerId(this.serverId));

    if (hostname && this.login) {
      return `${this.login}@${hostname}`;  
    }

    return ''
    
  }
}
export default Store({
  getInitialState() {
    return new TermRec();
  },

  initialize() {
    this.on(TLPT_TERMINAL_OPEN, init);
    this.on(TLPT_TERMINAL_CLOSE, close);
    this.on(TLPT_TERMINAL_SET_STATUS, changeStatus);
  }
})

function close(){
  return new TermRec();
}

function init(state, json ){
  return new TermRec(json);
}

function changeStatus(state, status) {
  return state.setIn(['status'], new TermStatusRec(status));  
}
