<template>
  <div class="number input-component">
    <div class="input">
      <input type="text" placeholder="#" v-model="answers[question.id]" />
    </div>
    
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

    }
  },

}

</script>