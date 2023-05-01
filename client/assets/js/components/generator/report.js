const utils = require('./utils.js')

module.exports = {
  format(style, current_answers){
    let answers = utils.process_answers(current_answers, this.questions)
    
    let h = {
      type: 'book',
      author: utils.format_contributors(style, answers.contributors),
      issued: utils.format_csl_date({year: answers.year_published}),

      title: answers.document_title,

      publisher: answers.publisher,
      'publisher-place': utils.format_address(style, answers.city, answers.state_country),

      annotation: answers.annotation
    }

    if(answers.available_format == 'print'){
      h.medium = answers.report_number
    }else if(answers.available_format == 'online'){
      h.URL = answers.url
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
      id: 'document_title',
      h1: 'Document title',
      type: 'text',
      tip: 'Report title should be in sentence case.'
    },
    {
      id: 'city',
      h1: 'City',
      type: 'text',
      if: (answers) => { return answers.available_format == 'print' }
    },
    {
      id: 'state_country',
      h1: 'State/Country',
      type: 'state_country',
      if: (answers) => { return answers.available_format == 'print' }
    },
    {
      id: 'publisher',
      h1: 'Publisher/Agency',
      type: 'text',
      tip: 'If online only fill in if different from author.'
    },
    {
      id: 'report_number',
      h1: 'Report No.',
      type: 'text',
      conf: { size: 'small' },
      tip: 'Publication No. xxx, if given.',
      if: (answers) => { return answers.available_format == 'print' }
    },
    {
      id: 'url',
      h1: 'URL.',
      type: 'text',
      if: (answers) => { return answers.available_format == 'online' }
    }
  ]
}