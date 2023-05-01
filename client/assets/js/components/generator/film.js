const utils = require('./utils.js')

module.exports = {
  format(style, current_answers){
    let answers = utils.process_answers(current_answers, this.questions)
    
    let medium_map = {
      motion: 'Motion picture',
      dvd: 'DVD',
      vhs: 'VHS'
    }

    let h = {
      type: 'article',
      author: utils.format_contributors(style, answers.contributors),
      issued: utils.format_csl_date({year: answers.year_released}),

      title: answers.film_title,
      medium: medium_map[answers.medium],
      publisher: answers.studio,

      annotation: answers.annotation
    }

    return utils.csl_to_citation(h, style, h.type)
  },

  questions: [
    {
      id: 'medium',
      h1: 'Medium',
      type: 'quick_select',
      conf: {options: {motion: '📽️ Motion picture', dvd: '📀 DVD', vhs: '📼 VHS'}},
      required: true
    },
    {
      id: 'contributors',
      h1: 'List contributors',
      type: 'contributors',
      conf: {roles: {director: 'Director', producer: 'Producer'}, suffix: false}
    },
    {
      id: 'year_released',
      h1: 'Year of release',
      type: 'year'
    },
    {
      id: 'film_title',
      h1: 'Title of film',
      type: 'text'
    },
    {
      id: 'studio',
      h1: 'Studio',
      type: 'text'
    }
  ]
}