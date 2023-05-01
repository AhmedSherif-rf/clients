const utils = require('./utils.js')

module.exports = {
  format(style, current_answers){
    let answers = utils.process_answers(current_answers, this.questions)
    
    if(answers.available_format == 'print'){
      let h = {
        type: 'book',
        author: utils.format_contributors(style, answers.contributors),
        issued: utils.format_csl_date({year: answers.year_published}),

        title: answers.document_title,

        publisher: answers.publisher,
        'publisher-place': utils.format_address(style, answers.city, answers.state_country),
        medium: answers.publication_number,

        annotation: answers.annotation
      }

      return utils.csl_to_citation(h, style, h.type)
    }else{
      let h = {
        type: 'book',
        author: utils.format_contributors(style, answers.contributors),
        issued: utils.format_csl_date({year: answers.year_published}),

        title: answers.document_title,

        publisher: answers.publisher_agency,
        medium: answers.publication_number,

        URL: answers.url,

        annotation: answers.annotation
      }

      return utils.csl_to_citation(h, style, h.type)
    }
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
      conf: {roles: {}, suffix: false, last_label: 'Last name/Gov department'}
    },
    {
      id: 'year_published',
      h1: 'Year published',
      type: 'year'
    },
    {
      id: 'document_title',
      h1: 'Document title',
      type: 'text'
    },
    {
      id: 'city',
      h1: 'city',
      type: 'text',
      if: (answers) => { return answers.available_format == 'print' }
    },
    {
      id: 'state_country',
      h1: 'State / country',
      type: 'state_country',
      if: (answers) => { return answers.available_format == 'print' }
    },
    {
      id: 'publisher',
      h1: 'Publisher',
      type: 'text',
      tip: 'If author is publisher, enter the word "Author"',
      if: (answers) => { return answers.available_format == 'print' }
    },
    {
      id: 'publisher_agency',
      h1: 'Publisher/Agency',
      type: 'text',
      tip: 'If online only fill in if different from author',
      if: (answers) => { return answers.available_format == 'online' }
    },
    {
      id: 'publication_number',
      h1: 'Publication No.',
      type: 'text',
      conf: {size: "small"},
      tip: 'Publication No. xxx, if given'
    },
    {
      id: 'url',
      h1: 'Report URL',
      type: 'text',
      if: (answers) => { return answers.available_format == 'online' }
    },
  ]
}