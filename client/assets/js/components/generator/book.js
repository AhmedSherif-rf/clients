const utils = require('./utils.js')

module.exports = {
  format(style, current_answers){
    let answers = utils.process_answers(current_answers, this.questions)

    if(answers.chapter_or_book == 'chapter'){
      let h = {
        type: 'chapter',
        author: utils.format_contributors(style, answers.contributors),

        title: answers.chapter_title,
        'container-title': answers.book_title,
        issued: utils.format_csl_date({year: answers.year_published}),

        publisher: answers.publisher,
        'publisher-place': utils.format_address(style, answers.publishing_city, answers.publishing_state),
        edition: answers.edition,
        page: answers.pages,
        URL: answers.url,
        version: answers.version,

        annotation: answers.annotation
      }

      return utils.csl_to_citation(h, style, h.type)
    }else{
      let h = {
        type: 'book',
        author: utils.format_contributors(style, answers.contributors),

        title: answers.book_title,
        issued: utils.format_csl_date({year: answers.year_published}),

        publisher: answers.publisher,
        'publisher-place': utils.format_address(style, answers.publishing_city, answers.publishing_state),
        edition: answers.edition,
        page: answers.pages,
        URL: answers.url,
        version: answers.version,

        annotation: answers.annotation
      }

      return utils.csl_to_citation(h, style, h.type)
    }
  },

  questions: [
    {
      id: 'autofill_books',
      h1: 'The book\'s title',
      type: 'autofill_books',
      conf: { placeholder: "e.g: The power of habit" },
      tip: "We'll try to find a book by this name and autofill if possible"
    },
    {
      id: 'contributors',
      h1: 'List contributors',
      type: 'contributors',
      conf: {roles: {author: 'Author', editor: 'Editor', translator: 'Translator'}, suffix: false},
      tip: 'Contributors can be authors, editors, or even translators.'
    },
    {
      id: 'available_format',
      h1: 'Available Format',
      type: 'quick_select',
      conf: {options: {print: '🖨️ Print', online: '🌐 Online/Web', ebook: '💻 E-book'}},
      required: true
    },
    {
      id: 'chapter_or_book',
      h1: 'Citing a chapter or an entire book?',
      type: 'quick_select',
      default: 'entire',
      conf: {options: {book: '📖 Entire book', chapter: '💬 Chapter of book'}},
      required: true
    },
    {
      id: 'year_published',
      h1: 'Year published',
      type: 'year'
    },
    {
      id: 'chapter_title',
      h1: 'Chapter title',
      type: 'text',
      if: (answers) => { return answers.chapter_or_book == 'chapter' }
    },
    {
      id: 'pages',
      h1: 'Page(s)',
      type: 'text',
      tip: 'List pages of chapter or essay in book. (Do not start with p.)',
      if: (answers) => { return answers.chapter_or_book == 'chapter' }
    },
    {
      id: 'publisher',
      h1: 'Publisher',
      type: 'text',
      tip: 'If author is publisher, enter the word: "Author"'
    },
    {
      id: 'publishing_city',
      h1: 'Publishing city',
      type: 'text',
      if: (answers) => { return answers.available_format == 'print' }
    },
    {
      id: 'publishing_state',
      h1: 'State/Country',
      type: 'state_country',
      if: (answers) => { return answers.available_format == 'print' }
    },
    {
      id: 'url',
      h1: "Ebook's URL",
      type: 'text',
      if: (answers) => { return answers.available_format == 'ebook' }
    },
    {
      id: 'version',
      h1: "Ebook's Version",
      type: 'text',
      conf: {size: 'small'},
      if: (answers) => { return answers.available_format == 'ebook' }
    },
    {
      id: 'edition',
      h1: 'Edition',
      type: 'text',
      tip: 'Only if other than first (digits only)'
    },
  ]
}