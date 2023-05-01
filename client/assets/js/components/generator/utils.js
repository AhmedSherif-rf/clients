module.exports = {
  // remove answers no longer fitting other 'if' conditions
  process_answers(current_answers, questions){
    let answers = _.extend({}, current_answers)

    _.each(answers, (v, k) => {
      let q = _.find(questions, {id: k})

      if(q && q['if'] && !q['if'](answers)){
        delete answers[k]
      }
    })

    return answers
  },

  // CSL hash to citation HTML
  csl_to_citation(data, style, type){
    console.log('formatting', data)

    let d = document.createElement('div')

    if(data.URL && (data.URL.match(/^(doi\:|\d)/i))){
      data.DOI = data.URL.replace(/^doi\:/i, '')
      delete data.URL
    }

    d.innerHTML = new Cite(data).format('bibliography', {
      format: 'html',
      template: style
    })

    let html = d.querySelector('.csl-entry, .csl-bib-body').innerHTML.trim()
    let text = d.innerText.trim()

    // Add accessed date (hotfix) and annotation
    let annotation = []

    if(data.accessed && data.accessed['date-parts'] && data.accessed['date-parts'][0][0]){
      annotation.push(`(Accessed ${this.pretty_date(data.accessed['date-parts'][0])})`)
    }

    if(data.annotation){
      annotation.push(data.annotation)
    }

    if(text){
      if(_.last(text) != '.'){
        html += '.'
      }

      if(annotation.length){
        html += ' '+annotation.join(' ')
      }
    }

    html = html.replace(/\(Ed.(^|\s)/, '(Ed.)')
    html = html.replace(/\(Trans.(^|\s)/, '(Trans.)')
    html = html.replace(/\(Producer(^|\s)/, '(Producer)')
    html = html.replace(/\(Director(^|\s)/, '(Director)')

    return html
  },

  pretty_date(d){
    return d.join('-')
  },

  // data_to_bibtex(data, style, type){
  //   let bibtex = []

  //   bibtex.push(`@${type}{${type}`)
    
  //   _.each(data, (v, k) => {
  //     if(v !== undefined && v !== null && v !== ''){
  //       bibtex.push(`  ${k} = `+(typeof v == 'number' ? v : `{${v}}`))
  //     }
  //   })

  //   bibtex = bibtex.join(",\n") + "\n}"

  //   return bibtex
  // },

  format_csl_date(date){
    if(date && date.year){
      return {
        'date-parts': [_.compact([
          date.year ? date.year.toString() : null,
          date.month ? date.month.toString() : null,
          date.day ? date.day.toString() : null
        ])]
      }
    }else{
      return null
    }
  },

  format_address(style, city, state_country){
    state_country = state_country || {}

    return _.compact([city, (state_country.state || state_country.country)]).join(', ')
  },

  format_contributors(style, contributors){
    let roles_map = {
      editor: 'Ed.',
      translator: 'Trans.',
      director: 'Director',
      producer: 'Producer'
    }

    return _.compact(_.map(contributors, (c) => {
      if(!c.first && !c.middle && !c.last){
        return
      }

      let g = ''

      if(c.first){
        g += `${c.first[0].toUpperCase()}. `
      }
      if(c.middle){
        g += `${c.middle[0].toUpperCase()}. `
      }

      g = g.trim()

      if(g && roles_map[c.role]){
        g += ` (${roles_map[c.role]})`
      }

      let f = c.last || ''

      if(!g && roles_map[c.role]){
        f += ` (${roles_map[c.role]})`
      }

      return {given: g, family: _.upperFirst(f)}
    }))
  }
}