<template>
  <div class="text unfurl input-component">
    <div class="input">
      <input type="text" @keydown.enter.prevent.stop="next" :placeholder="conf.placeholder || 'Auto fill'" v-model="input" />
    </div>

    <div class="qa-nav">
      <div class="action no-select" @click="$emit('prev')"><div class="left-arrow"></div> Go Back</div>
      <div class="primary action no-select" :class="{loading: loading}" @click="next" v-show="!question.required || input">Next step <div class="right-arrow"></div></div>
    </div>
  </div>
</template>
 
<script>
export default { 
  props: ['conf', 'answers', 'question', 'source_type'],

  components: {  },

  data(){
    return {
      loading: false,
      input: null
    }
  },

  methods: {
    process_contributors(arr){
      return _.compact(_.map(_.compact(arr), (a) => { 
        if(!a.match(/[^'\.a-zA-Z\d\s:]/)){
          return this.raw_name_to_contributor(a)
        }else{
          return null
        }
      }))
    },

    next(){
      if(this.input){
        if(['webpage', 'video', 'blog'].indexOf(this.source_type) > -1){
          this.loading = true

          this.$set(this.answers, 'url', this.input)

          axios.get('/api/unfluff_url', {
            timeout: 9000,
            params: { url: this.input }
          }).then((rsp) => {
            this.loading = false

            rsp = rsp.data

            if(rsp.status.code == 200){
              if(this.source_type == 'webpage'){
                this.$set(this.answers, 'url', rsp.data.url || this.input)
                this.$set(this.answers, 'document_title', rsp.data.title)
                this.$set(this.answers, 'contributors', this.process_contributors([rsp.data.author]))

                if(rsp.data.date){
                  try{
                    let d = new Date(rsp.data.date)
                    this.$set(this.answers, 'date_published', {year: d.getFullYear(), month: d.getMonth(), day: d.getDay() })
                  }catch(err){}
                }

                this.$emit('next')
              }

              if(this.source_type == 'blog'){
                this.$set(this.answers, 'url', rsp.data.url || this.input)
                this.$set(this.answers, 'post_title', rsp.data.title)
                this.$set(this.answers, 'publisher', rsp.data.publisher)
                this.$set(this.answers, 'medium', 'Blog post')
                this.$set(this.answers, 'contributors', this.process_contributors([rsp.data.author]))

                if(rsp.data.date){
                  try{
                    let d = new Date(rsp.data.date)
                    this.$set(this.answers, 'date_published', {year: d.getFullYear(), month: d.getMonth(), day: d.getDay() })
                  }catch(err){}
                }

                this.$emit('next')
              }

              if(this.source_type == 'video'){
                this.$set(this.answers, 'url', rsp.data.url || this.input)
                this.$set(this.answers, 'video_title', rsp.data.title)
                this.$set(this.answers, 'medium', 'Video file')
                this.$set(this.answers, 'contributors', this.process_contributors([rsp.data.author]))

                if(rsp.data.date){
                  try{
                    let d = new Date(rsp.data.date)
                    this.$set(this.answers, 'date_published', {year: d.getFullYear(), month: d.getMonth(), day: d.getDay() })
                  }catch(err){}
                }

                this.$emit('next')
              }

            }else{
              this.loading = false
              this.$emit('next')
              this.$toast(rsp.status.msg, { width: 'auto', type: 'bottom', duration: 5000, wordWrap: false})
            }
          }).catch((err) => {
            this.loading = false
            this.$emit('next')
            this.$toast("This URL blocked access, Please fill out the details manually.", { width: 'auto', type: 'bottom', duration: 5000, wordWrap: false})
          })

        }
      }else{
        this.$emit('next')
      }
    }
  }
}

</script>