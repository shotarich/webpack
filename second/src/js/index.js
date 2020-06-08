import $ from 'jquery'

switch(process.env.NODE_ENV) {
  case 'production':
    url = 'https://www.shotarich.com/getList'
    break
  case 'test':
    url = 'https://www-test.shotarich.com/getList'
    break
  case 'development':
    url = 'https://www-dev.shotarich.com/getList'
    break
  default:
    url = 'https://www.shotarich.com/getList'
    break
}

$.ajax({
  url,
  method: 'get',
  dataType: 'json',
  success(resp) {
    $('#app').append()
  },
  error(err) {
    console.error(err)
  }
})

function genHtml(data) {

}