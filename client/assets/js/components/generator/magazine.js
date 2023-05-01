const utils = require('./utils.js')

module.exports = {
  format(style, current_answers){
    let answers = utils.process_answers(current_answers, this.questions)
    
    let h = {
      type: 'article-journal',
      author: utils.format_contributors(style, answers.contributors),

      issued: utils.format_csl_date(answers.date_published),
      title: answers.article_title,
      'container-title': answers.magazine_name,
      volume: answers.volume,
      issue: answers.issue,
      page: answers.pages,
      URL: answers.url,

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
      id: 'date_published',
      h1: 'Date published',
      type: 'date',
      tip: 'Month and year for monthlies – day, month and year for weeklies.'
    },
    {
      id: 'article_title',
      h1: 'Article title',
      type: 'text',
      tip: 'Article title should be in sentence case.'
    },
    {
      id: 'magazine_name',
      h1: 'Magazine name',
      type: 'text'
    },
    {
      id: 'volume',
      h1: 'Volume',
      type: 'number',
      tip: "Only enter digits."
    },
    {
      id: 'issue',
      h1: 'Issue',
      type: 'number',
      tip: "Only enter digits."
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
      h1: "What's the URL?",
      type: 'text',
      tip: "Give the URL of the magazine home page when the online version of the article is available by search to avoid nonworking URLs.",
      if: (answers) => { return answers.available_format == 'online' }
    }
  ]
}