'use strict'

const axios = require('axios')
const metascraper = require('metascraper')

class ApiController {
  async unfluff_url({request, auth, response}) {
    const params = request.all();

    try{
      let url  = params.url
      
      if(!/^https?:\/\//i.test(url)){
        url = 'http://' + url;
      }

      let body = await axios.get(url, {timeout: 10000})
      let data = await metascraper({html: body.data, url: params.url})

      response.status(200).json({
        status: { code: 200 },
        data: data
      })
    }catch(err){
      response.status(200).json({
        status: { code: 400, msg: "We couldn't fetch this URL! Please fill out the details manually." }
      })
    }
  }
}

module.exports = ApiController
