const utils = require('./utils.js')

module.exports = {
  format(style, current_answers){
    let answers = utils.process_answers(current_answers, this.questions)
    
    let h = {
      type: 'website',
      author: utils.format_contributors(style, answers.contributors),
      issued: utils.format_csl_date(answers.date_published),

      title: answers.presentation_title,
      medium: answers.format,
      URL: answers.url,

      annotation: answers.annotation
    }

    return utils.csl_to_citation(h, style, h.type)
  },

  questions: [
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
      id: 'format',
      h1: 'Format',
      type: 'text',
      tip: "PowerPoint slides or PDF document"
    },
    {
      id: 'url',
      h1: 'Enter a URL',
      type: 'text'
    }
  ]
}