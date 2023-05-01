<template>
  <div class="route editor">
    <div class="intro-popup" v-show="intro_shown">
      <div class="inner">
        <h1>👋 Welcome!</h1>
        <h2>3 steps to get started</h2>

        <ul>
          <li>
            <div class="num">1</div>
            <p>Write or paste in your work, this is a live editor.</p>
          </li>
          <li>
            <div class="num">2</div>
            <p><span class="h">Highlight</span> part of the text</p>
          </li>
          <li>
            <div class="num">3</div>
            <p>Click "create citation" and voila!</p>
          </li>
        </ul>

        <div class="action" ref="dismiss_intro" @click="intro_shown=false">👍 Let's start.</div>
        <div class="note"><a href="#" @click.prevent="dont_remind('intro')">Don't remind me again.</a></div>
      </div>
    </div>

    <div class="cta-popup" v-show="spellcheck_popup_shown">
      <div class="inner">
        <div class="close" @click="spellcheck_popup_shown = false"><div></div></div>

        <div class="screenshot">
          <img src="/assets/images/spellcheck.png" />
        </div>

        <h1>Enable corrections</h1>
        <p>Detect the most difficult to spot writing mistakes & plagiarism inside CitationGenerator's editor.</p>

        <div class="cta">
          <form action="/checking" ref="spellcheck_form" method="post" target="_blank" class="no-where">
            <textarea name="text"></textarea>
            <input type="submit" />
          </form>

          <div class="action" @click="run_spellcheck">Activate Now</div>
          <div class="rating">
            <div class="stars"></div>
            <label>Top rated</label>
          </div>
        </div>

        <div class="steps">
          <ul>
            <li>
              <div class="num">1</div>
              <p>Click "Activate Now"</p>
            </li>
            <li>
              <div class="num">2</div>
              <p>Refresh CitationGenerator</p>
            </li>
            <li>
              <div class="num">3</div>
              <p>See corrections inside our editor</p>
            </li>
          </ul>
        </div>
      </div>  
    </div>

    <div class="editor-head">
      <div class="left">
        <select v-model="citation_style" @click="style_tooltip_dismissed = true" @change="set_citation_style($event.target.value)">
          <option value="apa">{{is_touch ? 'APA' : 'Citation style: APA'}}</option>
          <option value="mla">{{is_touch ? 'MLA' : 'Citation style: MLA'}}</option>
          <option value="chicago">{{is_touch ? 'CMOS' : 'Citation style: Chicago'}}</option>
        </select>

        <div class="spellcheck-button" v-if="spellcheck_enabled && word_count > 50" @click="spellcheck_popup_shown = true"></div>

        <div class="hover-tooltip pop-top-left" v-show="!intro_shown && !style_tooltip_dismissed && editor_empty && !highlight.active" style="animation-delay: 0s !important; top: 60px; left: 35px;">
          <div class="dir-top arrow"></div>
          <div class="top">
            <div class="character laura"></div>
            <p>Select your style!</p>
          </div>

          <div class="bottom">
            <div class="action" ref="dismiss_style_tooltip" @click="style_tooltip_dismissed = true; focus()">👍 Got it</div>

            <div class="link"><a href="#" @click.prevent="dont_remind('style')">Don't remind me again.</a></div>
          </div>
        </div>

        <div class="froala-toolbar" ref="froala_toolbar"></div>
      </div>
 
      <div class="right">
        <div class="button no-select clear-button" @click="clear">Clear all</div>
        <div class="button green no-select" @click="copy_all" ref="copy_button"  v-show="!(is_touch && highlight.active)"><div class="mini-icon copy s20"></div> Copy text</div>
        <div class="button green no-select" @mousedown.prevent="save_selection" @click="$emit('initCitation', {highlight_text: highlight.text})" ref="cite_button" v-show="is_touch && highlight.active"><div class="mini-icon black-quote s16" style="opacity: .5"></div> <b>Cite this</b></div>
      </div>
    </div>

    <div class="cta-note" v-show="spellcheck_enabled && word_count > 50 && !spellcheck_cta_dismissed">
      <div class="inner">
        <div class="ico"></div>
        <p>Your text may contain several grammatical errors.</p>
        <div class="action" @click="spellcheck_popup_shown = true">Correct Now</div>
        <div class="close" @click="spellcheck_cta_dismissed = true"></div>
      </div>
    </div>

    <div class="editor-content">
      <div class="hover-tooltip highlight-tooltip" v-show="!is_touch && highlight.active" ref="highlight_tooltip" :style="{left: highlight.tooltip_pos[0]+'px', top: highlight.tooltip_pos[1]+'px'}">
        <div class="arrow"></div>
        <div class="top">
          <div class="character lisa"></div>
          <p class="nowrap">Cite: "{{ highlight.text }}"</p>
        </div>

        <div class="bottom">
          <div class="action" ref="create_citation" @mousedown.prevent="save_selection" @click="$emit('initCitation', {highlight_text: highlight.text})"><div class="black-quote mini-icon s16"></div> Create citation</div>
        </div>
      </div>

      <div class="hover-tooltip" style="animation-delay: 0.5s !important; opacity: 0;" v-show="(style_tooltip_dismissed || is_touch) && editor_empty && !highlight.active">
        <div class="arrow"></div>
        <div class="top">
          <div class="character lisa"></div>
          <p>Highlight text to cite!</p>
        </div>

        <div class="bottom">
          <p>called the idea <span class="h">"genius"</span> and continued to praise..</p>
        </div>
      </div>

      <div ref="froala"></div>
    </div>
  </div>
</template>
 
<script>
export default { 
  components: {  },

  data(){
    return {
      spellcheck_enabled: false,
      spellcheck_popup_shown: false,
      spellcheck_cta_dismissed: false,

      intro_shown: localStorage.intro_dismissed ? false : true,
      editor_empty: true,
      word_count: 0,
      style_tooltip_dismissed: localStorage.style_tooltip_dismissed ? true : false,

      highlight: {
        active: false,
        text: null,
        tooltip_pos: [],
        froala_selection: null
      }
    }
  },

  methods:{
    run_spellcheck(){
      this.$refs.spellcheck_form.querySelector('textarea').value = document.querySelector('.fr-element').innerText
      this.$refs.spellcheck_form.submit()
      this.spellcheck_popup_shown = false
    },


    dont_remind(t){
      if(t == 'style'){
        localStorage.style_tooltip_dismissed = true;
        this.$refs.dismiss_style_tooltip.click()
      }

      if(t == 'intro'){
        localStorage.intro_dismissed = true;
        this.$refs.dismiss_intro.click()
      }
    },
    copy_all(){
      var dt = new clipboard.DT();
      dt.setData("text/plain", document.querySelector('.fr-element').innerText);
      dt.setData("text/html", this.editor.froalaEditor('html.get'));
      clipboard.write(dt);

      this.$toast('The text is in your clipboard now!', { width: 'auto', type: 'bottom', duration: 5000, wordWrap: false})
    },

    set_citation_style(style){
      this.focus()
      this.$store.commit('set_citation_style', style)
      this.$store.commit('set_style_was_chosen', true)
    },

    focus(){
      this.editor.froalaEditor('events.focus')
    },
    
    add_sample_citation(){
      EventBus.$emit('add-citation', {
        html: `dsadasad, A. (1920). <i>asdasdasdas</i> (54th ed.). dsadsadas, AZ: dasdasdasdas`
      })
    },

    clear(){
      this.editor.froalaEditor('html.set', '')
      this.editor.froalaEditor('events.focus')
    },

    copy(){
      this.select_all()
      document.execCommand("copy")
      this.unselect_all()
      this.restore_selection()

      this.$toast('The text is in your clipboard now!', { width: 'auto', type: 'bottom', duration: 5000, wordWrap: false})
    },

    save_selection(){
      this.editor.froalaEditor('selection.save')

      if(this.is_touch){
        document.activeElement.blur()
      }
      // document.activeElement.blur()
    },

    select_all(el){
      el = el || document.querySelector('.fr-element')

      if (document.selection) { 
        var range = document.body.createTextRange();
        range.moveToElementText(el);
        range.select().createTextRange();
      } else if (window.getSelection) {
        var range = document.createRange();
         range.selectNode(el);
         window.getSelection().addRange(range);
       }
    },

    unselect_all(){
      if (window.getSelection) {
        if (window.getSelection().empty) {  // Chrome
          window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {  // Firefox
          window.getSelection().removeAllRanges();
        }
      } else if (document.selection) {  // IE?
        document.selection.empty();
      }
    },

    restore_selection(){
      this.editor.froalaEditor('selection.restore')
    }
  },

  created(){
    let add_fn = _.debounce((data) => {
      console.log('adding citation', data)

      let next_number = 1

      while(true){
        if(document.querySelector(`.bib-item[data-number="${next_number}"]`)){
          next_number += 1
        }else{
          break
        }
      }

      this.editor.froalaEditor('selection.restore')

      let sup = document.createElement('sup')
      sup.innerText = `[${next_number}]`
      let range = this.highlight.froala_selection.getRangeAt(0)
      range.collapse(false);
      range.insertNode(sup);

      if(!document.querySelector('.fr-element .bib-heading')){
        $('.fr-element').append($('<p/>').html('<br/>'))
        $('.fr-element').append($('<p/>').html('<br/>'))
        $('.fr-element').append($('<h2/>').addClass('bib-heading').text('References'))
      }

      let bib_item = $('<p/>').addClass('bib-item').attr('data-style', this.citation_style).addClass('new').attr('data-number', next_number).html(data.html.replace(/<div/g, '<span').replace(/\/div>/g, '/span>')).prepend($('<b/>').addClass('bib-number').text(next_number+'. '))

      let bib_text = $('<div/>').html(data.html).text().trim()


      if(!this.is_touch){
        let $copy = $('<span/>').addClass('copy-citation').attr('title', 'Copy citation').attr('contenteditable', 'false').attr('unselectable', 'on')
        
        $copy.on('mousedown', (ev) => {
          ev.preventDefault()
          ev.stopPropagation()
        })

        $copy.on('mouseup', (ev) => {
          ev.preventDefault()
          ev.stopPropagation()
        })

        $copy.on('click', (ev) => {
          ev.preventDefault()
          ev.stopPropagation()

          let dt = new clipboard.DT();
          dt.setData("text/plain", bib_text);
          dt.setData("text/html", data.html);
          clipboard.write(dt);
          
          this.$toast('The citation is in your clipboard now!', { width: 'auto', type: 'bottom', duration: 5000, wordWrap: false})
        })

        bib_item.append($copy)
      }

      $('.fr-element').append(bib_item)

      setTimeout(() => {
        bib_item.removeClass('new')
      }, 2000)

      document.querySelector('.fr-wrapper').scrollTop = 1000 + document.querySelector('.fr-wrapper').scrollHeight
      document.querySelector('.editor-content').scrollTop = 1000 + document.querySelector('.editor-content').scrollHeight
      
      this.editor.froalaEditor('selection.clear')
    }, 1000, {leading: true})

    EventBus.$on('add-citation', add_fn)
  },

  mounted(){
    this.editor = $(this.$refs.froala)

    this.editor.froalaEditor({
      key: 'FD3E2G1C1uB5A2A1C3A5F1H4E1A3A14hvE-13cymstrzD-17qescwkwD7dgd==',
      placeholderText: "Type or paste your work here to start citing..",
      toolbarButtons: ['paragraphFormat', 'bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'clearFormatting', 'list'],
      toolbarButtonsMD: ['paragraphFormat', 'bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'clearFormatting', 'list'],
      toolbarButtonsSM: ['paragraphFormat', 'bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'clearFormatting', 'list'],
      toolbarButtonsXS: [],
      paragraphFormat: {
        N: 'Normal',
        H1: 'Heading 1',
        H2: 'Heading 2',
        H3: 'Heading 3',
        H4: 'Heading 4'
      },
      charCounterCount: false
    })

    // $('.fr-element').attr('data-gramm_editor', 'false')

    $('.fr-toolbar').detach().appendTo($(this.$refs.froala_toolbar))

    this.editor.on('froalaEditor.contentChanged', (e, editor) => {
      let text = $('.fr-element')[0].innerText
      this.editor_empty = text.length < 40
      this.word_count = text.trim().split(/\s+/).length
    })

    document.addEventListener('selectionchange', (ev) => {
      console.log('sel', ev, window.getSelection())
      // console.log(window.getSelection().rangeCount )
      setTimeout(() => {
        if(!window.getSelection().isCollapsed && this.editor.froalaEditor('selection.inEditor')){
          console.log('hohoho')

          if(window.HLT_TM){
            clearTimeout(window.HLT_TM)
            window.HLT_TM = null
          }

          if(document.body.scrollTop > 0){
            setTimeout(() => {
              document.body.scrollTop = document.querySelector('.editor-head').getBoundingClientRect().top
            }, 1000)
          }

          let sel = this.editor.froalaEditor('selection.get')

          // console.log('froala sel', sel.getRangeAt(0))

          // if(sel.type == 'Range'){
            this.highlight.active = true
            this.highlight.froala_selection = sel
            this.highlight.text = this.editor.froalaEditor('selection.text')

            let sel_bounds = this.editor.froalaEditor('position.getBoundingRect')
            let fr_bounds  = document.querySelector('.fr-wrapper').getBoundingClientRect()
            console.log('fr bounds', fr_bounds)

            this.highlight.tooltip_pos = [sel_bounds.left+sel_bounds.width-fr_bounds.left, sel_bounds.bottom-fr_bounds.top]

            if(this.highlight.tooltip_pos[0]+300 > window.innerWidth-fr_bounds.left){
              console.log('over')
              this.highlight.tooltip_pos[0] = fr_bounds.width - 300
            }

            console.log('bound', this.editor.froalaEditor('position.getBoundingRect'))
          // }
        }else{
          // window.HLT_TM = setTimeout(() => {
            this.highlight.active = false
          // }, 30)
        }
      }, 60)
    })


    if(localStorage.intro_dismissed && localStorage.style_tooltip_dismissed){
      this.editor.froalaEditor('events.focus')
    }

    setTimeout(() => {
      if(!document.querySelector('grammarly-card') && !document.body.getAttribute('data-gr-c-s-loaded') && (process.env.SPELLCHECK_ENABLED || '').toString().toLowerCase().trim() == 'true'){
        this.spellcheck_enabled = true
      }
    }, 3000)
  },

  computed: {
    localStorage(){
      return localStorage
    }
  }

}

</script>