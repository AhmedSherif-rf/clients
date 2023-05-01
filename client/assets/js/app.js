// import 'chromereload/devonly';

import 'es6-promise/auto'


import Vue from 'vue';
window.Vue = Vue

require('./utils')
    
import EventBus from './bus';
window.EventBus = EventBus;
      
window._ = require('lodash')
window.axios = require('axios')

window.Cite = require('citation-js')
Cite.CSL.register.addTemplate('mla', require('./csl/mla.csl'))
Cite.CSL.register.addTemplate('chicago', require('./csl/chicago.csl'))
    
import _ from 'lodash'
import axios from 'axios'

import clipboard from 'clipboard-polyfill'
window.clipboard = clipboard

// Initiate Vue app
Vue.config.devtools = true

import store from './store'
window.STORE = store

import App from './components/app.vue'

import Toast from 'vue2-toast'
Vue.use(Toast, {
  defaultType: 'top',
  duration: 3000,
  wordWrap: true,
  width: '150px'
});

const human = require('humanparser');
window.YO = human

Vue.mixin({
  methods: {
    raw_name_to_contributor(n){
      n = n.trim()

      if(n.split(' ').length == 1){
        return {role: "author", first: '', middle: '', last: n}
      }else{
        let attrs = human.parseName(n)

        return {role: "author", first: attrs.firstName, middle: attrs.middleName, last: attrs.lastName}
      }
    }
  },

  computed: {
    _() {
      return _;
    },
    citation_style(){
      return this.$store.state.citation_style
    },
    is_touch(){
      return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/) ? true : false
    }
  }
})

new Vue({
  el: '#app',
  store: STORE,
  render: h =>h(App),

  // Schema
  data() {
    return {
    }
  },

  created(){
  },

  methods: {

  },

  watch: {
  }
})