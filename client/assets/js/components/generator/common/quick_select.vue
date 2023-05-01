<template>
  <div class="input-component">
    <ul class="quick-select stacked">
      <li v-for="(name, k) in conf.options" @click="select_option(k)" :class="colors_map[k]+' '+(active_option == k ? 'active' : '')">
        <div>{{ name }}</div>
      </li>
    </ul>
    
    <div class="qa-nav">
      <div class="action no-select" @click="$emit('prev')"><div class="left-arrow"></div> Go Back</div>
      <div class="primary action no-select" @click="$emit('next')" v-show="!question.required || answers[question.id]">Next step <div class="right-arrow"></div></div>
    </div>
  </div>
</template>
 
<script>
export default { 
  props: ['conf', 'answers', 'question'],

  components: {  },

  data(){
    return {
      active_option: null
    }
  },

  methods: {
    select_option(k){
      this.active_option = k
      this.$set(this.answers, this.question.id, k)
      this.$emit('next')
    }
  },

  computed: {
    layout(){
      // if(_.keys(this.conf.options).length <= 2){
        return 'stacked'
      // }
    },

    colors_map(){
      let m = {}
      let colors = 'green gray red orange blue'.split(' ')

      _.each(this.conf.options, (opt, k) => {
        if(colors.length){
          m[k] = _.sample(colors)
          colors.splice(colors.indexOf(m[k]), 1)
        }else{
          return _.sample('green gray red orange blue yellow'.split(' '))
        }
      })

      return m
    }
  }

}

</script>