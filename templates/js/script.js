var nextPage = 0
var keyword = ''
// var url = 'http://0.0.0.0:3000/'
// var url = 'http://127.0.0.1:3000/'
var url = 'http://18.182.195.43:3000/'
var nextPic = []
function getData() {
  return new Promise((resolve, reject) => {

    let req = new XMLHttpRequest()
    let urlname = url + 'api/attractions?page=' + nextPage + keyword
    req.open('GET', urlname, true)
    req.onload = function () {
      let data = JSON.parse(this.responseText)

      // 找不到資料時：
      if (data.data.length == 0) {
        noMatchData()
      }
      // 外面的大框框
      let pic_box = document.getElementsByClassName('pic_box')[0]
      if (!pic_box) {
        let pic_box = document.createElement('div')
        pic_box.setAttribute('class', 'pic_box')
        pic_box.setAttribute('id', 'boxID')
        document.getElementsByClassName('content')[0].appendChild(pic_box)
      }

      for (let k = 0; k < data.data.length; k++) {
        title = data.data[k].name
        photourl = data.data[k].images[0]
        mrt = data.data[k].mrt
        category = data.data[k].category
        id = data.data[k].id
        addElement(title, photourl, mrt, category, id, k)
      }
      nextPage = data.nextPage
      resolve()
    }
    req.send()
  })
}

function addElement(title, photourl, mrt, category, id, k) {
  k = nextPage * 12 + k

  // 卡片 框框
  let addPicCard = document.createElement('a')
  addPicCard.setAttribute('href', '/attraction/' + id)
  addPicCard.setAttribute('class', 'pic_card')
  addPicCard.setAttribute('id', 'pic' + k)
  document.getElementById('boxID').appendChild(addPicCard)

  // 卡片裡的 圖片
  let newImg = document.createElement('img')
  newImg.setAttribute('src', photourl)
  newImg.setAttribute('class', 'pic')
  document.getElementById('pic' + k).appendChild(newImg)

  // 卡片裡的 標題文字
  let newDiv = document.createElement('div')
  newDiv.appendChild(document.createTextNode(title))
  newDiv.setAttribute('class', 'txt')
  document.getElementById('pic' + k).appendChild(newDiv)

  // 卡片裡的 副標 捷運+分類的 框框
  let newSubTxt = document.createElement('div')
  newSubTxt.setAttribute('class', 'subTxt')
  newSubTxt.setAttribute('id', 'subTxt' + k)
  document.getElementById('pic' + k).appendChild(newSubTxt)

  // 卡片裡的 副標 捷運+分類的 內容
  let newSubTxtMrt = document.createElement('div')
  newSubTxtMrt.appendChild(document.createTextNode(mrt))
  newSubTxtMrt.setAttribute('class', 'mrt')
  document.getElementById('subTxt' + k).appendChild(newSubTxtMrt)
  let newSubTxtCategory = document.createElement('div')
  newSubTxtCategory.appendChild(document.createTextNode(category))
  newSubTxtCategory.setAttribute('class', 'category')
  document.getElementById('subTxt' + k).appendChild(newSubTxtCategory)
}



function loginDialog() {
  // 遮起來
  let getBody = document.getElementsByTagName('body')
  getBody[0].classList.add('mask')

  // Dialog打開
  let dialogContainer = document.getElementById('dialogContainer')
  dialogContainer.style.display = 'block'
}

function closeBtn() {
  // 拿掉遮罩
  let getBody = document.getElementsByTagName('body')
  getBody[0].classList.remove('mask')

  // Dialog關起來
  let dialogContainer = document.getElementById('dialogContainer')
  dialogContainer.style.display = 'none'
}


var logOrSign = true
function toSignin() {
  let getName = document.getElementById('getName')
  getName.style.display = 'block'
  let dialogTitle = document.getElementsByClassName('dialogTitle')
  dialogTitle[0].innerHTML = '註冊會員帳號'
  let toSignin = document.getElementById('toSignin')
  if (logOrSign == true) {
    toSignin.innerHTML = '已經有帳戶了？點此登入'
    document.querySelector('.loginBtn').style.display = 'none'
    document.querySelector('.signupBtn').style.display = 'block'
    logOrSign = false
  } else {
    toSignin.innerHTML = '還沒有帳戶？點此註冊'
    dialogTitle[0].innerHTML = '登入會員帳號'
    document.querySelector('.loginBtn').style.display = 'block'
    document.querySelector('.signupBtn').style.display = 'none'
    logOrSign = true
    getName.style.display = 'none'
  }
}



var changeImgN = 1 // 下一張
var changeImg = 0  // 中間
var changeImgP = 0 // 前一張
var imgCount = 0
function getAttraction(id) {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest()
    let urlname = url + 'api/attraction/' + id
    req.open('GET', urlname, true)
    req.onload = function () {
      let data = JSON.parse(this.responseText)
      imgCount = data.data[0].images[0].length
      nextPic = data.data[0].images[0]
      document.getElementsByClassName('picPre')[0].src = data.data[0].images[0][imgCount - 1]
      document.getElementsByClassName('picNow')[0].src = data.data[0].images[0][changeImg]
      document.getElementsByClassName('picNext')[0].src = data.data[0].images[0][changeImg + 1]
      changeImgP = imgCount - 1
      // getAttractionInfo( class名稱 , 對應data裡面 key的名稱 )
      getAttractionInfo('title', 'name')
      getAttractionInfo('cat', 'category')
      getAttractionInfo('mrt', 'mrt')
      getAttractionInfo('introduction', 'description')
      getAttractionInfo('address', 'address')
      getAttractionInfo('transport', 'transport')

      function getAttractionInfo(varName, keyName) {
        document.getElementsByClassName(varName)[0].innerHTML = data.data[0][keyName]
      }

      addElementPicCircle(changeImg, imgCount)
      resolve()
    }
    req.send()
  })

}


function indexOnload() {
  // getData()
  let keyword = document.getElementById('keyword')
  keyword.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
      searchAttraction()
    }
  })
  let promise = getData()
  promise.then(function () {
    TF = true
    scrollToLoadMore()
    searchUsername()
  })
}
function bookingOnload() {
  let p = searchUsernameToIndex()
  p.then(function () {
    let p2 = getBookingInfo()
    p2.then(function () {
      showBookingContent()
      hideLoadingGif()
    })
  })

  // let p = getBookingInfo()
  // p.then(function () {
  //   showBookingContent()
  //   searchUsername()
  // })
}


function hideLoadingGif() {
  document.getElementsByClassName('loading')[0].style.display = 'none'
}
function showBookingContent() {
  document.getElementsByClassName('allContent')[0].style.opacity = '1'
  document.getElementsByClassName('bookingbooktitle')[0].style.opacity = '1'
}
function toBookingPage() {
  let req = new XMLHttpRequest()
  let urlname = url + 'api/user'
  req.open('GET', urlname, true)
  req.onload = function () {
    let data = JSON.parse(this.responseText)
    if (data.data !== null) {
      window.location.href = url + 'booking'
    } else {
      // window.location.href = url
      loginDialog()
    }
  }
  req.send()
}
var tripInfo
function getBookingInfo() {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest()
    let urlname = url + 'api/booking'
    req.open('GET', urlname, true)
    req.onload = function () {
      let data = JSON.parse(this.responseText)
      tripInfo = data
      // console.log(data)
      if (req.status == 403) {
        // console.log('status', req.status)
        window.location.href = url
        reject()
      } else if (data.data == null) {
        // console.log('有登入，但 data = null')
        let allContent = document.getElementsByClassName('allContent')[0]
        allContent.innerHTML = '目前沒有任何待預定的行程'
        allContent.setAttribute('class', 'allContent allContentTxt')
        let wrapper = document.getElementsByClassName('wrapper')[0]
        wrapper.style.minHeight = '0'
        document.getElementsByTagName('footer')[0].setAttribute('class', 'footerHeight')
      } else {
        // console.log('有登入，有 data')
        document.getElementsByClassName('bookingImg')[0].src = data.data.attraction.image
        document.getElementsByClassName('bookingAddress')[0].innerHTML = data.data.attraction.address
        document.getElementsByClassName('bookingName')[0].innerHTML = data.data.attraction.name
        document.getElementsByClassName('bookingDate')[0].innerHTML = data.data.date
        document.getElementsByClassName('bookingPrice')[0].innerHTML = data.data.price
        document.getElementsByClassName('bookingPrice')[1].innerHTML = data.data.price
        if (data.data.time === 'morning') {
          bookingTime = '早上 9 點到下午 4 點'
        } else {
          bookingTime = '下午 2 點到晚上 9 點'
        }
        document.getElementsByClassName('bookingTime')[0].innerHTML = bookingTime
      }
      resolve()
    }
    req.send()
  })
}
function deleteBooking() {
  let req = new XMLHttpRequest()
  let urlname = url + 'api/booking'
  req.open('DELETE', urlname, true)
  req.onload = function () {
    let response = JSON.parse(this.responseText)
    if (response.ok === true) {
      window.location.reload()
    }
  }
  req.send()
}
function startBooking(id) {
  let req = new XMLHttpRequest()
  let urlname = url + 'api/booking'
  req.open('POST', urlname, true)
  if (document.getElementById('day').checked) {
    price = 2000
    time = 'morning'
  } else {
    price = 2500
    time = 'afternoon'
  }
  bookingDate = document.getElementById('bookingDate').value
  if (bookingDate == '') {
    return alert('ㄟ要選日期啊！')
  }
  let data = {
    'attractionId': id,
    'date': bookingDate,
    'time': time,
    'price': price
  }
  data = JSON.stringify(data)
  req.setRequestHeader('Content-type', 'application/json')
  req.onload = function () {
    let response = JSON.parse(this.responseText)
    // console.log(response)
    if (response.ok === true) {
      window.location.href = url + 'booking'
    } else {
      loginDialog()
    }
    return response
  }
  req.send(data)
}
function searchUsername() {
  let req = new XMLHttpRequest()
  let urlname = url + 'api/user'
  req.open('GET', urlname, true)
  req.onload = function () {
    let data = JSON.parse(this.responseText)
    if (data.data == null) {
      // console.log('未登入')
    } else {
      // console.log('已登入')
      document.querySelector('#logoutBtn').style.display = 'inline'
      document.querySelector('#loginSignin').style.display = 'none'
      if (document.getElementById('username')) {
        document.getElementById('username').innerHTML = data.data.name
      }
    }
  }
  req.send()
}

function signup() {
  username = document.querySelector('#getName')
  email = document.querySelector('#getEmail')
  password = document.querySelector('#getPassword')
  checkSignupInputData(username.value, email.value, password.value)
  let req = new XMLHttpRequest()
  let urlname = url + 'api/user'
  req.open('POST', urlname, true)
  let data
  data = {
    'name': username.value,
    'email': email.value,
    'password': password.value
  }
  data = JSON.stringify(data)
  req.setRequestHeader('Content-type', 'application/json')
  req.onload = function () {
    response = this.responseText
    // console.log(response)
    if (req.status != 200) {
      message = JSON.parse(response).message
      addSignupResponse(message, 'warningTxt')
    } else {
      message = '註冊成功'
      addSignupResponse(message, 'hintTxt')
      document.querySelector('#toSignin').innerHTML = '點此登入'
    }
  }
  req.send(data)
}

function checkSignupInputData() {

}

function signin() {
  email = document.querySelector('#getEmail')
  password = document.querySelector('#getPassword')
  let req = new XMLHttpRequest()
  let urlname = url + 'api/user'
  req.open('PATCH', urlname, true)
  let data
  data = {
    'email': email.value,
    'password': password.value
  }
  data = JSON.stringify(data)
  req.setRequestHeader('Content-type', 'application/json')

  req.send(data)
  req.onload = function () {
    response = this.responseText
    // console.log(response)
    if (req.status != 200) {
      message = JSON.parse(response).message
      addSignupResponse(message, 'warningTxt')
    } else {
      message = '登入成功'
      addSignupResponse(message, 'hintTxt')
      window.location.reload()
    }
  }
}

function addSignupResponse(message, txtTypeClass) {
  let signupResponse = document.createElement('div')
  signupResponse.appendChild(document.createTextNode(message))
  signupResponse.setAttribute('class', txtTypeClass)
  signupResponse.setAttribute('id', 'signupResponse')
  document.getElementById('submitBtn').appendChild(signupResponse)
  window.addEventListener('click', function () {
    let remove = document.getElementById('signupResponse')
    if (remove) {
      remove.remove()
    }
  })
}

function logout() {
  let req = new XMLHttpRequest()
  let urlname = url + 'api/user'
  req.open('DELETE', urlname, true)
  req.onload = function () {
    response = this.response
    if (req.status == 200) {
      window.location.reload()
    }
  }
  req.send()
}
function attractionOnload(id) {
  // getAttraction(id)
  let promise = getAttraction(id)
  promise.then(function () {
    AEL()
    searchUsername()
    setBookingDate()
  })
}
function setBookingDate() {
  let today = new Date()
  let tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  let year = tomorrow.getFullYear()
  let month = tomorrow.getMonth() + 1
  if (month < 10) { month = '0' + month }
  let date = tomorrow.getDate()
  if (date < 10) { date = '0' + date }
  let defaultDateValue = year + '-' + month + '-' + date

  let calendar = document.querySelector('#bookingDate')
  calendar.setAttribute('value', defaultDateValue)
  calendar.setAttribute('min', defaultDateValue)
}
function AEL() {
  window.addEventListener('keyup', function (e, arrow) {
    arrow = ''
    subAEL(e, arrow)
  })
}
function subAEL(e, arrow) {
  if (e.keyCode === 39 || arrow === 'R') {
    document.getElementsByClassName('picNow')[0].style.transform = 'translateX(-100%)'
    document.getElementsByClassName('picNext')[0].style.transform = 'translateX(0%)'
    setTimeout(() => {
      let tt = document.getElementById('circle' + changeImg)
      tt.style.background = 'white'
      changeImg += 1
      changeImg = Math.abs(changeImg) % imgCount
      changeImgN += 1
      changeImgN = Math.abs(changeImgN) % imgCount
      changeImgP += 1
      changeImgP = Math.abs(changeImgP) % imgCount
      let tt2 = document.getElementById('circle' + changeImg)
      tt2.style.background = 'black'
      document.getElementsByClassName('picPre')[0].remove()
      document.getElementsByClassName('picNow')[0].setAttribute('class', 'part1Img picPre')
      document.getElementsByClassName('picNext')[0].setAttribute('class', 'part1Img picNow')
      let picNext = document.createElement('img')
      picNext.setAttribute('class', 'part1Img picNext')
      picNext.setAttribute('src', nextPic[changeImgN])
      document.getElementsByClassName('part1pic')[0].appendChild(picNext)
    }, 500)
  } else if (e.keyCode === 37 || arrow === 'L') {
    document.getElementsByClassName('picNow')[0].style.transform = 'translateX(100%)'
    document.getElementsByClassName('picPre')[0].style.transform = 'translateX(0%)'
    setTimeout(() => {
      let tt = document.getElementById('circle' + changeImg)
      tt.style.background = 'white'
      changeImg -= 1
      changeImg = Math.abs(imgCount + changeImg) % imgCount
      changeImgP -= 1
      changeImgP = Math.abs(imgCount + changeImgP) % imgCount
      changeImgN -= 1
      changeImgN = Math.abs(imgCount + changeImgN) % imgCount
      let tt2 = document.getElementById('circle' + changeImg)
      tt2.style.background = 'black'
      document.getElementsByClassName('picNext')[0].remove()
      document.getElementsByClassName('picNow')[0].setAttribute('class', 'part1Img picNext')
      document.getElementsByClassName('picPre')[0].setAttribute('class', 'part1Img picNow')
      let picPre = document.createElement('img')
      picPre.setAttribute('class', 'part1Img picPre')
      picPre.setAttribute('src', nextPic[changeImgP])
      document.getElementsByClassName('part1pic')[0].appendChild(picPre)
    }, 500)
  }
}

function loadmore() {
  if (nextPage != null) {
    let promise = getData()
    promise.then(() => {
      TF = true
      scrollToLoadMore()
    })
  }
}

var TF = true
function scrollToLoadMore() {
  window.addEventListener('scroll', function () {
    let content = document.getElementsByClassName('content')[0]
    let rect = content.getBoundingClientRect()
    let height = document.documentElement.clientHeight
    if ((height - rect.bottom) >= 0 & TF == true) {
      TF = false
      loadmore()
    }
  })
}


function searchAttraction() {

  let p = document.getElementsByClassName('pic_box')[0]
  if (p) {
    p.remove()
  }
  let n = document.getElementsByClassName('noMatchData')[0]
  if (n) {
    n.remove()
  }
  nextPage = 0
  keyword = '&keyword=' + document.getElementById('keyword').value
  // getData()
  let promise = getData()
  promise.then(function () {
    TF = true
    scrollToLoadMore()
  })

  sessionStorage.setItem('keyword', keyword.replace('&keyword=', ''))

}



function noMatchData() {
  // let n = document.getElementsByClassName('noMatchData')[0]
  let noMatchData = document.createElement('div')
  noMatchData.appendChild(document.createTextNode('找不到包含 ' + keyword.replace('&keyword=', '') + ' 的景點'))
  noMatchData.setAttribute('class', 'noMatchData')
  document.getElementsByClassName('wrapper')[0].appendChild(noMatchData)
}

function addElementPicCircle(changeImg, imgCount) {
  // 小白點們 有黑有白啦
  let circlesContainer = document.createElement('div')
  circlesContainer.setAttribute('class', 'circlesContainer')
  document.getElementsByClassName('part1pic')[0].appendChild(circlesContainer)
  for (let k = 0; k < imgCount; k++) {
    let littleCircle = document.createElement('div')
    littleCircle.setAttribute('class', 'littleCircle')
    littleCircle.setAttribute('id', 'circle' + k)
    document.getElementsByClassName('circlesContainer')[0].appendChild(littleCircle)
  }
  let tt = document.getElementById('circle' + changeImg)
  tt.style.background = 'black'

  // 左右圈圈
  let leftCircle = document.createElement('div')
  leftCircle.setAttribute('class', 'LRcirlce')
  leftCircle.setAttribute('id', 'leftCircle')
  leftCircle.setAttribute('onclick', 'subAEL(\'\',\'L\')')
  document.getElementsByClassName('part1pic')[0].appendChild(leftCircle)
  let rightCircle = document.createElement('div')
  rightCircle.setAttribute('class', 'LRcirlce')
  rightCircle.setAttribute('id', 'rightCircle')
  rightCircle.setAttribute('onclick', 'subAEL(\'\',\'R\')')
  document.getElementsByClassName('part1pic')[0].appendChild(rightCircle)
}

function howMuch() {
  if (document.getElementById('day').checked) {
    document.getElementById('price').innerHTML = 2000
  } else {
    document.getElementById('price').innerHTML = 2500
  }
}

function getPrime() {
  return new Promise((resolve, reject) => {

    // event.preventDefault()

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
      alert('資料有誤。')
      return
    }

    // Get prime
    TPDirect.card.getPrime((result) => {
      if (result.status !== 0) {
        alert('資料有誤。' + result.msg)
        return
      }
      // alert('get prime 成功，prime: ' + result.card.prime)
      resolve(result.card.prime)
      // send prime to your server, to pay with Pay by Prime API .
      // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    })
  })
}

function onSubmit() {
  let p = getPrime()
  p.then((prime) => {

    let req = new XMLHttpRequest()
    let urlname = url + 'api/orders'
    req.open('POST', urlname, true)
    let data
    data = {
      'prime': prime,
      'order': {
        'price': tripInfo.data.price,
        'trip': {
          'attraction': tripInfo.data.attraction,
          'date': tripInfo.data.date,
          'time': tripInfo.data.time
        },
        'contact': {
          'name': document.getElementsByClassName('booking_name')[0].value,
          'email': document.getElementsByClassName('booking_email')[0].value,
          'phone': document.getElementsByClassName('booking_phone')[0].value,
        }
      }
    }
    data = JSON.stringify(data)
    req.setRequestHeader('Content-type', 'application/json')
    req.onload = function () {
      let response = JSON.parse(this.responseText)
      // console.log(response)
      if (response.data.payment.status === 0) {
        window.location.href = url + 'thankyou?number=' + response.data.number
      }
      return response
    }
    req.send(data)
  })
}

function thankyouOnload() {
  let p = searchUsernameToIndex()
  p.then(() => {
    getOrderNumber()
  })
}

function searchUsernameToIndex() {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest()
    let urlname = url + 'api/user'
    req.open('GET', urlname, true)
    req.onload = function () {
      let data = JSON.parse(this.responseText)
      if (data.data == null) {
        // console.log('未登入')
        window.location.href = url
      } else {
        // console.log('已登入')
        document.querySelector('#logoutBtn').style.display = 'inline'
        document.querySelector('#loginSignin').style.display = 'none'
        if (document.getElementById('username')) {
          document.getElementById('username').innerHTML = data.data.name
        }
      }
      resolve()
    }
    req.send()
  })
}

function getOrderNumber() {
  let myurl = location.href
  let orderNumber = myurl.split('?number=')[1]
  document.getElementsByClassName('orderNumber')[0].innerHTML = orderNumber
}