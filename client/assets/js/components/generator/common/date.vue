<template>
  <div class="state-country input-component">

    <div class="horizontal-inputs">
      <div class="input-top-label">
        <label>Year</label>

        <div class="input">
          <input type="text" placeholder="YYYY" maxlength="4" v-model="answers[question.id].year" />
        </div>
      </div>


      <div class="input-top-label">
        <label>Day</label>

        <div class="input">
          <select v-model="answers[question.id].day">
            <option value="">Day</option>
            <option :value="d" v-for="d in _.range(1, 31)">{{ d }}</option>
          </select>
        </div>
      </div>

      <div class="input-top-label">
        <label>Month</label>

        <div class="input">
          <select v-model="answers[question.id].month">
            <option value="">Month</option>
            <option value="1">January</option>       
            <option value="2">February</option>       
            <option value="3">March</option>       
            <option value="4">April</option>       
            <option value="5">May</option>       
            <option value="6">June</option>       
            <option value="7">July</option>       
            <option value="8">August</option>       
            <option value="9">September</option>       
            <option value="10">October</option>       
            <option value="11">November</option>       
            <option value="12">December</option> 
          </select>
        </div>
      </div>
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

  created(){
    if(!this.answers[this.question.id]){
      this.$set(this.answers, this.question.id, {day: '', month: '', year: ''})
    }
  }
}

</script>