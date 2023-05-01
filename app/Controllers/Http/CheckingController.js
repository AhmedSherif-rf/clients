'use strict'

class CheckingController {
  async index({request, auth, response, view}) {
    const params = request.all();

    return view.render('checking', {
      text_data: JSON.stringify({t: params.text})
    })
  }
}

module.exports = CheckingController
