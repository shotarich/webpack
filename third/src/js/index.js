import '../style/index.css'
import $ from 'jquery'

let url = process.env.NODE_ENV === 'development' ? '/api' : ''

$.ajax({
  url: url + 'getList',
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