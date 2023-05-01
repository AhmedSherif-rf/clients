const utils = require('./utils.js')

module.exports = {
  format(style, current_answers){
    let answers = utils.process_answers(current_answers, this.questions)

    let h = {
      type: 'chapter',
      author: utils.format_contributors(style, answers.contributors),

      issued: utils.format_csl_date({year: answers.year_published}),

      title: answers.entry_title,
      'container-title' : answers.encyclopedia,

      edition: answers.edition,
      volume: answers.volume,
      page: answers.pages,

      annotation: answers.annotation
    }

    if(answers.available_format == 'print'){
      h.publisher = answers.publisher
      h['publisher-place'] = utils.format_address(style, answers.publishing_city, answers.publishing_state)
    }

    if(answers.available_format == 'online'){
      h['URL'] = answers.doa_url
      h.accessed = utils.format_csl_date(answers.retrieval_date)
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
      h1: 'List the contributors',
      type: 'contributors',
      conf: {roles: {author: 'Author', editor: 'Editor', translator: 'Translator'}, suffix: false}
    },
    {
      id: 'year_published',
      h1: 'Year published',
      type: 'year'
    },
    {
      id: 'entry_title',
      h1: 'Entry title',
      type: 'text',
      tip: 'Entry title should be in sentence case.'
    },
    {
      id: 'encyclopedia',
      h1: 'Encyclopedia',
      type: 'text',
      tip: 'Encyclopedia title should be in sentence case.'
    },
    {
      id: 'edition',
      h1: 'Edition',
      type: 'text',
      conf: {size: 'small'},
      tip: 'Only if other than first (digits only)'
    },
    {
      id: 'volume',
      h1: 'Volume',
      type: 'text',
      conf: {size: 'small'},
      tip: 'Only if other than first (digits only)'
    },
    {
      id: 'pages',
      h1: 'Page(s)',
      type: 'text',
      conf: {size: 'small'},
      tip: 'If there are no page numbers, the entry title is sufficient.'
    },
    {
      id: 'publisher',
      h1: "Who's the publisher?",
      type: 'text',
      tip: "If author is publisher, enter the word: Author",
      if: (answers) => { return answers.available_format == 'print' }
    },
    {
      id: 'publishing_city',
      h1: 'Publishing city',
      type: 'text',
      if: (answers) => { return answers.available_format == 'print' }
    },
    {
      id: 'publishing_state',
      h1: 'Publishing state/country',
      type: 'state_country',
      tip: "Select a state if in the U.S. or enter a country.",
      if: (answers) => { return answers.available_format == 'print' }
    },
    {
      id: 'source_changing',
      h1: 'Is source material likely to change over time (e.g., wikis)?',
      type: 'quick_select',
      conf: {options: {yes: 'Yes', no: 'No'}},
      required: true,
      if: (answers) => { return answers.available_format == 'online' }
    },
    {
      id: 'retrieval_date',
      h1: 'Retrieval date',
      type: 'date',
      if: (answers) => { return answers.available_format == 'online' && answers.source_changing == 'yes' },
      tip: 'Never use retrieval date with DOI.'
    },
    {
      id: 'doa_url',
      h1: 'DOI or URL',
      type: 'text',
      tip: "Use DOI if available.",
      if: (answers) => { return answers.available_format == 'online' }
    }
  ]
}