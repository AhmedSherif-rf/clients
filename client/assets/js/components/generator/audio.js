const utils = require('./utils.js')

module.exports = {
  format(style, current_answers){
    let answers = utils.process_answers(current_answers, this.questions)
    
    let h = {
      type: 'chapter',
      author: utils.format_contributors(style, answers.contributors),

      title: answers.recording_title,

      issued: utils.format_csl_date(answers.date_published),
      medium: answers.medium,

      annotation: answers.annotation
    }

    if(answers.available_format == 'cd_record'){
      h['container-title'] = answers.album_title
      h.publisher = answers.publisher
      h['publisher-place'] = utils.format_address(style, answers.publishing_city, answers.publishing_state)
    }

    if(answers.available_format == 'podcast'){
      h['container-title'] = answers.program
      h['URL'] = answers.url
    }

    return utils.csl_to_citation(h, style, h.type)
  },

  questions: [
    {
      id: 'available_format',
      h1: 'Available Format',
      type: 'quick_select',
      conf: {options: {cd_record: '📀 CD/Record', podcast: '🎤 Podcast'}},
      required: true
    },
    {
      id: 'contributors',
      h1: 'List the producers',
      type: 'contributors',
      conf: {roles: {}, suffix: false}
    },
    {
      id: 'date_published',
      h1: 'Date published',
      type: 'date'
    },
    {
      id: 'recording_title',
      h1: 'Recording title',
      type: 'text',
      if: (answers) => { return answers.available_format == 'cd_record' }
    },
    {
      id: 'album_title',
      h1: 'Album title',
      type: 'text',
      tip: "Audio title should be in sentence case",
      if: (answers) => { return answers.available_format == 'cd_record' }
    },
    {
      id: 'program',
      h1: 'Program',
      type: 'text',
      tip: "Audio title should be in sentence case",
      if: (answers) => { return answers.available_format == 'podcast' }
    },
    {
      id: 'medium',
      h1: 'Medium',
      type: 'text',
      tip: "Audio podcast, CD, MP3 file, Vinyl record, or Cassette."
    },
    {
      id: 'publisher',
      h1: "Who's the publisher?",
      type: 'text',
      tip: "If author is publisher, enter the word: Author",
      if: (answers) => { return answers.available_format == 'cd_record' }
    },
    {
      id: 'publishing_city',
      h1: 'Publishing city',
      type: 'text',
      if: (answers) => { return answers.available_format == 'cd_record' }
    },
    {
      id: 'publishing_state',
      h1: 'Publishing state/country',
      type: 'state_country',
      tip: "Select a state if in the U.S. or enter a country.",
      if: (answers) => { return answers.available_format == 'cd_record' }
    },
    {
      id: 'url',
      h1: 'Enter the podcast URL',
      type: 'text',
      tip: "Give the URL of the podcast.",
      if: (answers) => { return answers.available_format == 'podcast' }
    }
  ]
}