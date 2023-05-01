const utils = require('./utils.js')

module.exports = {
  format(style, current_answers){
    let answers = utils.process_answers(current_answers, this.questions)
    
    let h = {
      type: 'article-journal',
      author: utils.format_contributors(style, answers.contributors),

      issued: utils.format_csl_date(answers.date_published),
      title: answers.post_title,
      medium: answers.medium,
      URL: answers.url,

      annotation: answers.annotation
    }

    return utils.csl_to_citation(h, style, h.type)
  },

  questions: [
    {
      id: 'unfurl',
      h1: 'Enter the URL',
      type: 'unfurl',
      conf: { placeholder: "Enter blog post URL" }
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
      id: 'post_title',
      h1: 'Blog post title',
      type: 'text'
    },
    {
      id: 'medium',
      h1: 'Medium',
      type: 'text',
      tip: 'Blog post or Blog comment'
    }
  ]
}