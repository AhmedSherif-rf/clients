const utils = require('./utils.js')

module.exports = {
  format(style, current_answers){
    let answers = utils.process_answers(current_answers, this.questions)
    
    let pub_prefix = {
      paper: 'Paper presented at ',
      poster: 'Poster session presented at ',
      symposium: 'Symposium conducted at '
    }
 
    let h = {
      type: 'book',
      author: utils.format_contributors(style, answers.contributors),

      issued: utils.format_csl_date(answers.date_published),
      title: answers.presentation_title,
      publisher: answers.org_name && answers.format ? pub_prefix[answers.format]+answers.org_name : null,
      'publisher-place': answers.location,

      annotation: answers.annotation
    }

    if(answers.format == 'symposium'){
      h['container-title'] = answers.symposium_title
      // h.type = 'chapter'
    }

    return utils.csl_to_citation(h, style, h.type)
  },

  questions: [
    {
      id: 'format',
      h1: 'Format',
      type: 'quick_select',
      conf: {options: {paper: '📜 Paper', poster: '🎴 Poster', symposium: '🎤 Symposium'}},
      required: true
    },
    {
      id: 'contributors',
      h1: 'List contributors',
      type: 'contributors',
      conf: {roles: {}, suffix: false}
    },
    {
      id: 'date_published',
      h1: 'Date published',
      type: 'date'
    },
    {
      id: 'presentation_title',
      h1: 'Presentation title',
      type: 'text'
    },
    {
      id: 'symposium_title',
      h1: 'Symposium title',
      type: 'text',
      if: (answers) => { return answers.format == 'symposium' },
      tip: 'Conference title should be in sentence case.'
    },
    {
      id: 'org_name',
      h1: 'Organization / Conference name',
      type: 'text',
      tip: "If using organization name start with: the meeting of the ..."
    },
    {
      id: 'location',
      h1: 'Location',
      type: 'text'
    },
    {
      id: 'chair',
      h1: 'Chair',
      type: 'text',
      if: (answers) => { return answers.format == 'symposium' }
    },
  ]
}