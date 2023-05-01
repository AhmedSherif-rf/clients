const utils = require('./utils.js')

module.exports = {
  format(style, current_answers){
    let answers = utils.process_answers(current_answers, this.questions)
    
    console.log(style, answers, answers.contributors)

    if(answers.citing_type == 'individual_broadcast'){
      let h = {
        type: 'book',
        author: utils.format_contributors(style, answers.contributors),

        issued: utils.format_csl_date(answers.broadcast_date),
        title: answers.broadcast_title,
        medium: 'Television broadcast',

        publisher: answers.network,
        'publisher-place': utils.format_address(style, answers.city, answers.state_country),

        annotation: answers.annotation
      }

      return utils.csl_to_citation(h, style, h.type)
    }else if(answers.citing_type == 'series_episode'){
      let h = {
        type: 'book',
        author: utils.format_contributors(style, answers.contributors),

        issued: utils.format_csl_date(answers.broadcast_date),
        title: answers.episode_title,
        'container-title': answers.program_series,
        medium: 'Television series episode',

        publisher: answers.network,
        'publisher-place': utils.format_address(style, answers.city, answers.state_country),

        annotation: answers.annotation
      }

      return utils.csl_to_citation(h, style, h.type)
    }else if(answers.citing_type == 'series'){
      let h = {
        type: 'book',
        author: utils.format_contributors(style, answers.contributors),

        issued: utils.format_csl_date(answers.broadcast_date),
        title: answers.program_series,
        medium: 'Television series',

        publisher: answers.network,
        'publisher-place': utils.format_address(style, answers.city, answers.state_country),

        annotation: answers.annotation
      }

      return utils.csl_to_citation(h, style, h.type)
    }
  },

  questions: [
    {
      id: 'citing_type',
      h1: 'What exactly is this about?',
      type: 'quick_select',
      conf: {options: {series: '📺 Series', series_episode: '🎞️ Series episode', individual_broadcast: '📡 Individual broadcast'}},
      required: true
    },
    {
      id: 'contributors',
      h1: 'List contributors',
      type: 'contributors',
      conf: {roles: {producer: 'Producer', director: 'Director', writer: 'Writer'}, suffix: false},
      tip: 'Contributors can be authors, editors, or even translators.'
    },
    {
      id: 'broadcast_date',
      h1: 'Broadcast date',
      type: 'date'
    },
    {
      id: 'episode_title',
      h1: 'Episode title',
      type: 'text',
      if: (answers) => { return answers.citing_type == 'series_episode' }
    },
    {
      id: 'program_series',
      h1: 'Program/Series',
      type: 'text',
      if: (answers) => { return answers.citing_type != 'individual_broadcast' }
    },
    {
      id: 'broadcast_title',
      h1: 'Broadcast title',
      type: 'text',
      if: (answers) => { return answers.citing_type == 'individual_broadcast' }
    },
    {
      id: 'network',
      h1: 'Network',
      type: 'text'
    },
    {
      id: 'city',
      h1: 'City',
      type: 'text'
    },
    {
      id: 'state_country',
      h1: 'State / Country',
      type: 'state_country'
    }
  ]
}