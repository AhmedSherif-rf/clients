<template>
  <ul class="contributors input-component">
    <ul class="infinite-list">
      <li v-for="(contributor, i) in contributors">
        <label v-show="false">Contributor #{{i+1}}</label>
        <div class="input-top-label" v-if="_.keys(roles).length">
          <label>Role</label>

          <div class="input">
            <select v-model="contributor.role">
              <option :value="k" v-for="(v,k) in roles">{{ v }}</option>
            </select>
          </div>
        </div>
        <div class="input-top-label" v-show="conf.suffix || conf.suffix === undefined">
          <label>Suffix</label>

          <div class="input">
            <input type="text" v-model="contributor.suffix"/>
          </div>
        </div>
        <div class="input-top-label">
          <label>First name</label>

          <div class="input">
            <input type="text" v-model="contributor.first" @keydown="typed(i)" />
          </div>
        </div>
        <div class="input-top-label">
          <label>Mi / Middle</label>

          <div class="input">
            <input type="text"  v-model="contributor.middle"/>
          </div>
        </div>
        <div class="input-top-label">
          <label>{{ conf.last_label || 'Last / corp.' }}</label>

          <div class="input">
            <input type="text" v-model="contributor.last" @keydown="typed(i)" />
          </div>
        </div>
      </li>
    </ul>

    <div class="qa-nav">
      <div class="action no-select" @click="$emit('prev')"><div class="left-arrow"></div> Go Back</div>
      <div class="primary action no-select" @click="$emit('next')" v-show="!question.required || answers[question.id]">Next step <div class="right-arrow"></div></div>
    </div>
    
  </ul>
</template>
 
<script>
export default { 
  props: ['conf', 'answers', 'question'],

  components: {  },

  data(){
    return {
      // contributors: this.conf.contributors || [],
      roles: this.conf.roles
    }
  },

  methods:{
    focus(){
      this.$nextTick(() => {
        this.$el.querySelector('input').focus()
      })
    },

    add_contributor(){
      if(!this.contributors.length || _.last(this.contributors).first || _.last(this.contributors).last){
        this.contributors.push(_.extend({}, this.contributor_mock))
        // this.add_contributor()
      }
    },

    typed(i){
      if(i == this.contributors.length-1){
        // if(_.last(this.contributors).first || _.last(this.contributors).last){
          this.add_contributor()
        // }
      }
    }
  },

  created(){
    if(!this.answers.contributors){
      this.$set(this.answers, 'contributors', [])
    }

    if(!this.contributors.length){
      this.add_contributor()
    }
  },

  computed: {
    contributor_mock(){
      return {role: _.keys(this.conf.roles)[0], suffix: null, first: null, middle: null, last: null}
    },

    contributors(){
      return this.answers.contributors
    }
  },

  watch: {
    contributors(){
      this.add_contributor()
    }
  },

  mounted(){
    this.focus()
  }

}

</script>