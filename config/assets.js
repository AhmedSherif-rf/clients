if(process.env.NODE_ENV=='production'){
  const fs = require('fs')
  const Helpers = use('Helpers')
  const map = JSON.parse(fs.readFileSync(Helpers.publicPath('rev-manifest.json')));  
  global.asset_path = (path) => { return map[path] || path }
}else{
  global.asset_path = (path) => { return path }
}