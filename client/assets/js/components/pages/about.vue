<template>
  <div class="route about">
    <div class="inner">
      <div class="intro">
        <div class="text">
          <h1>We make citing enjoyable.</h1>

          <p>We know how important and tedious the process of citing can be. We try to make it quick and easy.</p>

          <a class="button  big" href="#editor"><div class="black-quote s16 mini-icon"></div> Start citing now</a>
        </div>
      </div>

      <ul class="biography">
        <li>
          <h3>Who are we?</h3>

          <p>We’re a small, distributed team working on a variety of products that make teachers and students life's easier. We’re focusing on writing and productivity tools.</p>

          <p>We’re also working on a few stealth startups that will accompany this tool and help you write faster. If you're interested in joining us please contact: <a href="mailto:careers@citationgenerator.com">careers@citationgenerator.com</a></p>
        </li>

        <li>
          <h3>Product roadmap.</h3>

          <p>We are starting off supporting the APA, MLA, and Chicago citation format. Over the next months, we'll add more formats and expand on features.</p>

          <p>Future features will help to improve grammar, spelling, readability, word choice, and sentence length.</p>
        </li>
      </ul>

      <div class="contact">
        <div class="team"></div>

        <div class="form">
          <h2>Say hello!</h2>

          <p>Need help with the service or want to report a bug? One of our team will get back to you as soon as we can!</p>

          <form ref="form" @submit.prevent="send">
            <div class="field">
              <input type="text" ref="email" spellcheck="false" placeholder="Your email address" />
            </div>

            <div class="field">
              <textarea ref="message" placeholder="What do you want to tell us?"></textarea>
            </div>

            <div class="form-bottom">
              <div class="button green big" ref="send_button" @click="send">📧 Send now</div>
              <p>You can also directly contact us via <a href="mailto:hello@citationgenerator.com">hello@citationgenerator.com</a></p>

              <input type="submit" class="no-where" />
            </div>
          </form>

        </div>
      </div>


      <div class="footer">
        <div class="left">
          <div class="logo"></div>
          <div class="copyright">© {{ (new Date()).getFullYear() }} CitationGenerator</div>
        </div>

        <div class="right">
          <ul class="menu">
            <li>
              <h4>Company</h4>

              <div class="links">
                <a href="#about">About us</a>
                <a href="/blog">Blog</a>
              </div>
            </li>
            <li>
              <h4>Legal</h4>

              <div class="links">
                <a href="#terms">Terms of service</a>
                <a href="#privacy">Privacy policy</a>
              </div>
            </li>
            <li>
              <h4>Connect</h4>

              <div class="links">
                <a href="https://twitter.com/citegen">Twitter</a>
                <a href="https://facebook.com/citationgenerator">Facebook</a>
              </div>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>


<script>
export default {
  data(){
    return {
    }
  },

  methods: {
    send(){

      console.log({
          email: this.$refs.email.value,
          message: this.$refs.message.value
        })

      if(this.$refs.message.value && /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.$refs.email.value)){

        axios.post('https://usebasin.com/f/c085c0918b84.json', {
          email: this.$refs.email.value,
          message: this.$refs.message.value
        })

        this.$toast(`👏 We've received your message`, { width: 'auto', type: 'bottom', duration: 5000, wordWrap: false})
        this.$refs.send_button.innerText = '📮 Sent!'
        this.$refs.send_button.classList.add('disabled')
      }else{
        this.$toast(`Please fill out all the required fields`, { width: 'auto', type: 'bottom', duration: 5000, wordWrap: false})
      }
    }
  },

  computed: {

  }
}
</script>
