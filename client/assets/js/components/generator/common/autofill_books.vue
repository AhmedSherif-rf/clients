<template>
  <div class="text autofill input-component">
    <div class="input">
      <input type="text" @input="input_changed = true" @keydown.enter.prevent.stop="next" :placeholder="conf.placeholder || 'Auto fill'" v-model="input" />
    </div>

    <ul class="results books" v-if="results.length">
      <li v-for="r in results" :key="r.id" :id="r.id" @click="select_book(r)">
        <div class="image" :style="{ backgroundImage: 'url('+r.volumeInfo.imageLinks.smallThumbnail+')' }" v-if="r.volumeInfo.imageLinks"></div>
        <div class="placeholder-image" v-if="!r.volumeInfo.imageLinks"></div>
        <div class="info">
          <div class="title">{{ r.volumeInfo.title }}</div>
          <div class="authors" v-if="r.volumeInfo.authors">{{ r.volumeInfo.authors.join(', ') }}</div>
          <div class="publisher">{{ _.compact([r.volumeInfo.publisher, r.volumeInfo.publishedDate]).join(', ') }}</div>
        </div>
        <div class="action">
          Select
        </div>
      </li>
    </ul>

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
      input: null,
      results: [],
      input_changed: true
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
      if(this.input_changed){
        this.input_changed = false

        this.loading = true

        axios.get('https://www.googleapis.com/books/v1/volumes', {params: {q: this.input}}).then((rsp) => {
          this.loading = false

          rsp = rsp.data

          if(rsp && rsp.items){
            if(rsp.items.length){
              this.results = _.take(rsp.items, 5)
            }else{
              this.$toast("We can't find any book by that name.", { width: 'auto', type: 'bottom', duration: 5000, wordWrap: false})
              
              this.$set(this.answers, 'book_title', this.input)
              this.$emit('next')
            }
          }else{
            this.$toast("We can't find any book by that name.", { width: 'auto', type: 'bottom', duration: 5000, wordWrap: false})
            
            this.$set(this.answers, 'book_title', this.input)
            this.$emit('next')
          }
        }).catch(() => {
          this.loading = false
          this.$toast("We can't autofill books at the moment, try later.", { width: 'auto', type: 'bottom', duration: 5000, wordWrap: false})

          this.$set(this.answers, 'book_title', this.input)
          this.$emit('next')
        })
      }else{
        this.$set(this.answers, 'book_title', this.input)
        this.$emit('next')
      }
    },

    select_book(book){
      this.$set(this.answers, 'book_title', book.volumeInfo.title)
      this.$set(this.answers, 'publisher', book.volumeInfo.publisher)

      if(book.volumeInfo.publishedDate){
        try{
          let year = new Date(book.volumeInfo.publishedDate).getFullYear()

          this.$set(this.answers, 'year_published', year)
        }catch(err){}
      }


      if(book.volumeInfo.authors && book.volumeInfo.authors.length){
        this.$set(this.answers, 'contributors', this.process_contributors(book.volumeInfo.authors))
      }
      
      this.$emit('next')
    }
  }
}

</script>