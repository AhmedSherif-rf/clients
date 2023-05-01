const utils = require('./utils.js')

module.exports = {
  format(style, current_answers){
    let answers = utils.process_answers(current_answers, this.questions)
    
    let h = {
      type: 'website',
      author: utils.format_contributors(style, answers.contributors),
      issued: utils.format_csl_date(answers.date_published),

      title: answers.video_title,
      URL: answers.url,
      medium: answers.medium,

      annotation: answers.annotation
    }

    return utils.csl_to_citation(h, style, h.type)
  },

  questions: [
    {
      id: 'unfurl',
      h1: 'Enter the URL',
      type: 'unfurl',
      conf: { placeholder: "Enter video URL" }
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
      id: 'video_title',
      h1: 'Video title',
      type: 'text'
    },
    {
      id: 'medium',
      h1: 'Medium',
      type: 'text'
    }
    // {
    //   id: 'url',
    //   h1: 'Enter the URL',
    //   type: 'text'
    // }
  ]
}