const utils = require('./utils.js')

module.exports = {
  format(style, current_answers){
    let answers = utils.process_answers(current_answers, this.questions)
    
    let h = {
      type: 'article-journal',
      author: utils.format_contributors(style, answers.contributors),

      issued: utils.format_csl_date({year: answers.year_published}),
      title: answers.article_title,
      'container-title': answers.journal_name,
      volume: answers.volume,
      issue: answers.issue,
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
      conf: {roles: {author: 'Author', editor: 'Editor', translator: 'Trans.'}, suffix: false},
      tip: 'Contributors can be authors, editors, or even translators.'
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
      id: 'journal_name',
      h1: 'Journal name',
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
      id: 'doi_url',
      h1: 'DOI or URL',
      type: 'text',
      tip: "Use DOI if available, otherwise URL of journal's home page.",
      if: (answers) => { return answers.available_format == 'online' }
    }
  ]
}