<template>
  <div id="generator">
    <div class="go-back" @click="exit">
      <div class="arrow"></div>
      <p>Exit citation mode</p>
    </div>

    <div class="inner">
      <div class="question" v-if="!source_type && !$store.state.style_was_chosen && is_touch">
        <div class="highlight-text"><span>{{ highlight_text }}</span></div>

        <h3>Before we begin citing..</h3>
        <h1>What style do you prefer?</h1>

        <div class="input-component">
          <ul class="quick-select stacked">
            <li @click="set_citation_style('apa')" class="blue"><div>Use <b>APA</b></div></li>
            <li @click="set_citation_style('mla')" class="yellow"><div>Use <b>MLA</b></div></li>
            <li @click="set_citation_style('chicago')" class="red"><div>Use <b>Chicago</b></div></li>
          </ul>
        </div>
      </div>


      <div class="question" v-if="!source_type && ($store.state.style_was_chosen || !is_touch)">
        <div class="highlight-text"><span>{{ highlight_text }}</span></div>

        <h3>First select the type of your source</h3>
        <h1>What are you citing?</h1>

        <ul class="source-types">
          <li @click="set_source_type('book')" class="green"><div><div class="mini-icon book s32"></div>Book</div></li>
          <li @click="set_source_type('webpage')" class="gray"><div><div class="mini-icon webpage s32"></div>Webpage</div></li>
          <li @click="set_source_type('magazine')" class="red"><div><div class="mini-icon magazine s32"></div>Magazine</div></li>
          <li @click="set_source_type('newspaper')" class="orange"><div><div class="mini-icon newspaper s32"></div>Newspaper</div></li>
          <li @click="set_source_type('video')" class="blue"><div><div class="mini-icon video s32"></div>Video</div></li>
          <li @click="set_source_type('journal')" class="yellow"><div><div class="mini-icon journal s32"></div>Journal</div></li>
        </ul>

        <ul class="more-source-types" v-show="more_source_types">
          <li @click="set_source_type('blog')">
            <div>✍️ Blog post</div>
          </li>
          <li @click="set_source_type('image')">
            <div>📷 Image</div>
          </li>
          <li @click="set_source_type('audio')">
            <div>🔉 Audio</div>
          </li>
          <li @click="set_source_type('encyclopedia')">
            <div>📕 Encyclopedia/Dictionary</div>
          </li>
          <li @click="set_source_type('television')">
            <div>📺 Television</div>
          </li>
          <li @click="set_source_type('govpub')">
            <div>🏛️ Government Publication</div>
          </li>
          <li v-show="false" @click="set_source_type('interview')">
            <div>🗨️ Interview</div>
          </li>
          <li @click="set_source_type('lecture_notes')">
            <div>🗒️ Lecture notes</div>
          </li>
          <li v-show="false" @click="set_source_type('dissertation')">
            <div>📓 Dissertation/Thesis</div>
          </li>
          <li @click="set_source_type('film')">
            <div>🎬 Film/DVD</div>
          </li>
          <li @click="set_source_type('conference')">
            <div>🎤 Conference</div>
          </li>
          <li @click="set_source_type('report')">
            <div>📜 Report</div>
          </li>
        </ul>

        <div class="other-source" @click="more_source_types = true" v-show="more_source_types == false">
          <a>📌 Citing something else?</a>
        </div>
      </div>


      <div class="qa" v-if="source_type">
        <div class="preview" ref="preview" :style="{visibility: is_citation_empty ? 'hidden' : 'visible'}">
          <blockquote>
            <b>Preview:</b> <div v-html="citation"></div>
          </blockquote>
        </div>

        <form class="questions" @submit.prevent="navigate('next')">

          <div class="question" v-for="(question, i) in questions" :class="{active: current_question_id == question.id}" v-show="current_question_id == question.id">

            <h1>{{ question.h1 }}</h1>

            <component :is="`input-${question.type}`" :conf="question.conf" :answers="answers" :question="question" :source_type="source_type" @prev="navigate('prev')" @next="navigate('next')"></component>


            <div class="bottom-tip">
              <div :class="'character writer'"></div>
              <p>{{ question.tip || 'Need help? contact hello@citationgenerator.com' }}</p>
            </div>
          </div>

          <input type="submit" class="no-where" />
        </form>

      </div>

    </div>
  </div>
</template>
 
<script>
let components = {}

_.each(['contributors', 'text', 'year', 'quick_select', 'state_country', 'date', 'number', 'unfurl', 'autofill_books'], (n) => {
  components[`input-${n}`] = require(`./generator/common/${n}.vue`)
})

let generators = {}
_.each([
  'book', 'webpage', 'journal', 'newspaper', 'image', 'video', 'magazine', 'blog', 'television', 'govpub', 'lecture_notes', 'film', 'conference', 'report', 'audio', 'encyclopedia'
], (n) => {
  generators[n] = require(`./generator/${n}.js`)
})

export default { 
  props: ['highlight_text'],

  components: components,

  data(){
    return {
      source_type: null,
      current_question_id: null,
      questions: [],
      answers: {},

      more_source_types: true
    }
  },

  methods:{
    set_citation_style(style){
      this.$store.commit('set_citation_style', style)
      this.$store.commit('set_style_was_chosen', true)
    },

    exit(){
      this.clear_source_type()
      this.$emit('exit')
    },

    navigate(dir){
      if(dir == 'next'){
        if(this.next_question){
          this.current_question_id = this.next_question.id

          try{ document.scrollingElement.scrollTop = 0 }catch(err){}
          this.$el.scrollTop = 0
          // this.$refs.preview.scrollIntoView()
        }else{

          EventBus.$emit('add-citation', {
            html: this.citation
          })

          this.exit()
          // alert('done')
        }
      }else{
        if(this.prev_question){
          this.current_question_id = this.prev_question.id
          
          try{ document.scrollingElement.scrollTop = 0 }catch(err){}
          this.$el.scrollTop = 0
          // this.$refs.preview.scrollIntoView()
        }else{
          if(confirm("Are you sure you want to start over?")){
            this.clear_source_type()
          }
        }
      }
    },

    set_source_type(s){
      this.source_type = s
      this.questions = _.extend([], this.generator.questions)
      this.questions.push({id: "annotation", type: 'text', h1: "Want to add an annotation?", tip: "Adding an annotation is completely optional!"})
      this.current_question_id = this.questions[0].id
    },

    clear_source_type(){
      this.source_type = null
      this.questions = []
      this.current_question_id = null
      this.answers = {}
    },

    focus(){
      if(!this.is_touch){
        try{ $(this.$el).find('.question.active input:visible:first').focus() }catch(err){}
      }
    },

  },

  created(){
  },

  computed: {
    is_citation_empty(){
      let tdiv = document.createElement('div')
      tdiv.innerHTML = this.citation

      return !tdiv.innerText.trim().length
    },

    generator(){
      return generators[this.source_type]
    },

    citation(){
      return this.generator.format(this.citation_style, this.answers)
    },

    available_questions(){
      return _.filter(this.questions, (q) => { return !q.if || q.if(this.answers) })
    },

    next_question(){
      return this.available_questions[_.findIndex(this.available_questions, {id: this.current_question_id})+1]
    },

    prev_question(){
      return this.available_questions[_.findIndex(this.available_questions, {id: this.current_question_id})-1]
    }

  },

  watch: {
    current_question_id(){
      this.$nextTick(() => {
        this.focus()
      })
    }
  }

}

</script>