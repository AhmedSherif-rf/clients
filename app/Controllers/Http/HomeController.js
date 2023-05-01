'use strict'
const Helpers = use('Helpers')

class HomeController {
  async index({request, auth, response}) {
    if(process.env.NODE_ENV == 'production' && (!request.request.headers.host.match(/^www\./i) || request.protocol().toLowerCase() != 'https')){
      response.redirect('https://www.citationgenerator.com', true, 301)
    }else{
      response.download(Helpers.publicPath(asset_path('app.html')))
    }
  }
}

module.exports = HomeController
