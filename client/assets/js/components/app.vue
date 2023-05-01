<template>
  <div id="app">
    <div class="sidebar">
      <div class="show-menu" @click="menu_shown=true"><div></div></div>

      <div class="logo">
        <div class="symbol"></div>
        <h1 class="type">CitationGenerator</h1>
      </div>

      <div class="menu" :class="{shown: menu_shown}">
        <div class="close-menu" @click="menu_shown = false" v-show="false">
          <label><div class="close mini-icon s20"></div> Close</label>
        </div>

        <a href="#" :class="{active: view == 'editor'}">
          <div class="black-quote s16 mini-icon"></div> Editor
        </a>

        <a href="/blog" :class="{active: view == 'blog'}">
          <div class="blog mini-icon s16"></div> Blog
        </a>

        <a href="#about" :class="{active: view == 'about'}">
          <div class="about mini-icon s16"></div> About us
        </a>

        <a href="#privacy" :class="{active: view == 'privacy'}">
          <div class="paper mini-icon s16"></div> Privacy policy
        </a>

        <a href="#terms" :class="{active: view == 'terms'}">
          <div class="paper mini-icon s16"></div> Terms of service
        </a>
      </div>

      <ul class="features">
        <li>
          <div class="ico pen"></div>
          <div class="text">
            <h3>APA, MLA, & Chicago</h3>
            <p>We support many popular citation formats.</p>
          </div>
        </li>
        <li>
          <div class="ico book"></div>
          <div class="text">
            <h3>Multiple source types</h3>
            <p>You can cite anything from a book to a webpage.</p>
          </div>
        </li>
        <li>
          <div class="ico fire"></div>
          <div class="text">
            <h3>Smart auto-fill</h3>
            <p>You just give us the important details, we’ll fill out the rest.</p>
          </div>
        </li>
        <li>
          <div class="ico shield"></div>
          <div class="text">
            <h3>No annoying ads</h3>
            <p>Obnoxious ads won’t help you write better.</p>
          </div>
        </li>
      </ul>

      <div class="subscribe">
        <label>🔔 Sign up for updates:</label>
        <form action="https://app.getresponse.com/add_subscriber.html" accept-charset="utf-8" method="post" target="_blank" ref="updates_form">
          <input type="text" name="email" spellcheck="false" placeholder="Enter your email" />
          <input type="hidden" name="campaign_token" value="6lx7W" />
          <input type="hidden" name="start_day" value="0" />
          <input type="submit" class="no-where" />
          <div class="submit" @click="$refs.updates_form.submit()">✓</div>
        </form>
      </div>

    </div>

    <div class="main">
      <editor @initCitation="init_citation" ref="editor" v-if="view == 'editor'"></editor>
      <generator v-if="view == 'editor' && generator.active" :highlight_text="generator.highlight_text" @exit="generator_exited"></generator>

      <terms v-if="view == 'terms'"></terms>
      <privacy v-if="view == 'privacy'"></privacy>
      <about v-if="view == 'about'"></about>
      <blog v-if="view == 'blog'"></blog>
      <subscribed v-if="view == 'subscribed'"></subscribed>
    </div>

  </div>
</template>
 
<script>
import Generator from './generator.vue'
import Editor from './editor.vue'

import Terms from './pages/terms.vue'
import Privacy from './pages/privacy.vue'
import About from './pages/about.vue'
import Blog from './pages/blog.vue'
import Subscribed from './pages/subscribed.vue'

export default { 
  components: { Generator, Editor, Terms, Privacy, About, Blog, Subscribed },

  data(){
    return {
      menu_shown: false,
      view: 'editor',

      generator: {
        active: false,
        highlight_text: null
      }
    }
  },

  methods:{
    generator_exited(){
      this.generator.active = false
      this.$refs.editor.restore_selection()
    },

    init_citation(data){
      console.log('init citation', arguments)
      this.generator.active = true
      this.generator.highlight_text = data.highlight_text
    },

    act_on_hash(){
      let routes = {
        editor: 'editor',
        privacy: 'privacy',
        terms: 'terms',
        about: 'about',
        blog: 'blog',
        subscribed: 'subscribed'
      }

      let r = routes[(location.hash || '').replace('#', '')]

      if(r){
        this.view = r
      }else{
        this.view = 'editor'
        history.pushState("", document.title, '/')
      }
      
      this.menu_shown = false
    }
  },

  created(){
    this.act_on_hash()
    window.addEventListener("hashchange", this.act_on_hash, false);
  },

  computed: {
  }

}

</script>