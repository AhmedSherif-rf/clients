const utils = require('./utils.js')

module.exports = {
  format(style, current_answers){
    let answers = utils.process_answers(current_answers, this.questions)
    
    let h = {
      type: 'article-journal',
      author: utils.format_contributors(style, answers.contributors),

      issued: utils.format_csl_date({year: answers.year_published}),
      title: answers.article_title,
      'container-title': answers.newspaper_name,
      page: answers.pages,
      URL: answers.doi_url,

      annotation: answers.annotation
    }

    return utils.csl_to_citation(h, style, h.type)
  },

  questions: [
    {
      id: 'available_format',
      h1: 'Available Format',
      type: 'quick_select',
      conf: {options: {print: '🖨️ Print', online: '🌐 Online/Web'}},
      required: true
    },
    {
      id: 'contributors',
      h1: 'List contributors',
      type: 'contributors',
      conf: {roles: {}, suffix: false}
    },
    {
      id: 'year_published',
      h1: 'Year published',
      type: 'year'
    },
    {
      id: 'article_title',
      h1: 'Article title',
      type: 'text'
    },
    {
      id: 'newspaper_name',
      h1: 'Newspaper name',
      type: 'text',
      tip: "If name of newspaper begins with 'The', omit this word."
    },
    {
      id: 'pages',
      h1: 'Page(s)',
      type: 'text',
      conf: {size: 'small'},
      tip: "Inclusive: xx-xx (Do not start with p.)"
    },
    {
      id: 'url',
      h1: 'Enter the URL',
      type: 'text',
      tip: "Give the URL of the newspaper home page when the online version of the article is available by search to avoid nonworking URLs.",
      if: (answers) => { return answers.available_format == 'online' }
    }
  ]
}