const utils = require('./utils.js')

module.exports = {
  format(style, current_answers){
    let answers = utils.process_answers(current_answers, this.questions)
    
    let h = {
      type: 'post-weblog',
      title: answers.document_title,
      issued: utils.format_csl_date(answers.date_published),
      URL: answers.url,
      author: utils.format_contributors(style, answers.contributors),
      annotation: answers.annotation
    }

    return utils.csl_to_citation(h, style, h.type)
  },

  questions: [
    {
      id: 'unfurl',
      h1: 'Enter the URL',
      type: 'unfurl',
      conf: { placeholder: "Enter page URL" }
    },
    // {
    //   id: 'url',
    //   h1: 'Enter the URL',
    //   type: 'text'
    // },
    {
      id: 'contributors',
      h1: 'List contributors',
      type: 'contributors',
      conf: {roles: {author: 'Author', editor: 'Editor', translator: 'Trans.'}, suffix: false},
      tip: 'Contributors can be authors, editors, or even translators.'
    },
    {
      id: 'date_published',
      h1: 'Date published',
      type: 'date',
      tip: "If blank (n.d.) will be automatically added to your citation."
    },
    {
      id: 'document_title',
      h1: 'Document title',
      type: 'text'
    }
  ]
}