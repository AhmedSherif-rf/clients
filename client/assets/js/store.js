import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
import EventBus from './bus';


let store = new Vuex.Store({
  state: {
    citation_style: 'apa',
    style_was_chosen: false
  },

  mutations: {
    set_style_was_chosen(state, v){
      state.style_was_chosen = v
    },

    set_citation_style(state, s){
      state.citation_style = s
    }
  },

  actions: {

  },

  getters: {
  }
})

export default store