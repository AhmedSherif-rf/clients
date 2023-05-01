const utils = require('./utils.js')

module.exports = {
  format(style, current_answers){
    let answers = utils.process_answers(current_answers, this.questions)
    
    let h = {
      type: 'website',
      author: utils.format_contributors(style, answers.contributors),

      title: answers.image_title,
      URL: answers.url,
      medium: answers.description,

      annotation: answers.annotation
    }

    if(answers.work_type == 'work_of_art'){
      h.issued = utils.format_csl_date({year: answers.year_created})
    }else{
      h.issued = utils.format_csl_date(answers.date_published)
    }

    return utils.csl_to_citation(h, style, h.type)
  },

  questions: [
    {
      id: 'work_type',
      h1: 'What type of image is this?',
      type: 'quick_select',
      conf: {options: {work_of_art: 'A work of art or photograph', not_work_of_art: 'Not a work of art – an image found on the web'}},
      required: true
    },
    {
      id: 'contributors',
      h1: 'List contributors',
      type: 'contributors',
      conf: {roles: {}, suffix: false}
    },
    {
      id: 'year_created',
      h1: 'Year created',
      type: 'year',
      if: (answers) => { return answers.work_type == 'work_of_art' }
    },
    {
      id: 'date_published',
      h1: 'Date published',
      type: 'date',
      if: (answers) => { return answers.work_type == 'not_work_of_art' }
    },
    {
      id: 'image_title',
      h1: 'Image title',
      type: 'text'
    },
    {
      id: 'description',
      h1: 'Type of work or brief description',
      type: 'text',
      tip: "Give description here if no title e.g. Photo of a boat"
    },
    {
      id: 'url',
      h1: 'Enter the image URL',
      type: 'text',
      tip: "Give the URL of the image."
    }
  ]
}