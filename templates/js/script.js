var nextPage = 0
var keyword = ''
var url = 'http://0.0.0.0:3000/'
// var url = 'http://127.0.0.1:3000/'
// var url = 'http://18.182.195.43:3000/'
var nextPic = []
function getData() {
  return new Promise((resolve, reject) => {

    var req = new XMLHttpRequest()
    var urlname = url + 'api/attractions?page=' + nextPage + keyword
    req.open('GET', urlname, true)
    req.onload = function () {
      var data = JSON.parse(this.responseText)

      // 找不到資料時：
      if (data.data.length == 0) {
        noMatchData()
      }
      // 外面的大框框
      var pic_box = document.getElementsByClassName('pic_box')[0]
      if (!pic_box) {
        var pic_box = document.createElement('div')
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
  var addPicCard = document.createElement('a')
  addPicCard.setAttribute('href', '/attraction/' + id)
  addPicCard.setAttribute('class', 'pic_card')
  addPicCard.setAttribute('id', 'pic' + k)
  document.getElementById('boxID').appendChild(addPicCard)

  // 卡片裡的 圖片
  var newImg = document.createElement('img')
  newImg.setAttribute('src', photourl)
  newImg.setAttribute('class', 'pic')
  document.getElementById('pic' + k).appendChild(newImg)

  // 卡片裡的 標題文字
  var newDiv = document.createElement('div')
  newDiv.appendChild(document.createTextNode(title))
  newDiv.setAttribute('class', 'txt')
  document.getElementById('pic' + k).appendChild(newDiv)

  // 卡片裡的 副標 捷運+分類的 框框
  var newSubTxt = document.createElement('div')
  newSubTxt.setAttribute('class', 'subTxt')
  newSubTxt.setAttribute('id', 'subTxt' + k)
  document.getElementById('pic' + k).appendChild(newSubTxt)

  // 卡片裡的 副標 捷運+分類的 內容
  var newSubTxtMrt = document.createElement('div')
  newSubTxtMrt.appendChild(document.createTextNode(mrt))
  newSubTxtMrt.setAttribute('class', 'mrt')
  document.getElementById('subTxt' + k).appendChild(newSubTxtMrt)
  var newSubTxtCategory = document.createElement('div')
  newSubTxtCategory.appendChild(document.createTextNode(category))
  newSubTxtCategory.setAttribute('class', 'category')
  document.getElementById('subTxt' + k).appendChild(newSubTxtCategory)
}



function loginDialog() {
  // 遮起來
  var getBody = document.getElementsByTagName('body')
  getBody[0].classList.add('mask')

  // Dialog打開
  var dialogContainer = document.getElementById('dialogContainer')
  dialogContainer.style.display = 'block'
}

function closeBtn() {
  // 拿掉遮罩
  var getBody = document.getElementsByTagName('body')
  getBody[0].classList.remove('mask')

  // Dialog關起來
  var dialogContainer = document.getElementById('dialogContainer')
  dialogContainer.style.display = 'none'
}


var logOrSign = true
function toSignin() {
  var getName = document.getElementById('getName')
  getName.style.display = 'block'
  var dialogTitle = document.getElementsByClassName('dialogTitle')
  dialogTitle[0].innerHTML = '註冊會員帳號'
  var toSignin = document.getElementById('toSignin')
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
    var req = new XMLHttpRequest()
    var urlname = url + 'api/attraction/' + id
    req.open('GET', urlname, true)
    req.onload = function () {
      var data = JSON.parse(this.responseText)
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
  var keyword = document.getElementById('keyword')
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
  searchUsername()
}
function searchUsername() {
  var req = new XMLHttpRequest()
  var urlname = url + 'api/user'
  req.open('GET', urlname, true)
  req.onload = function () {
    var data = JSON.parse(this.responseText)
    // console.log(data.data)
    if (data.data == null) {
    } else {
      console.log('已登入')
      document.querySelector('#logoutBtn').style.display = 'inline'
      document.querySelector('#loginSignin').style.display = 'none'
    }
  }
  req.send()
}

function signup() {
  username = document.querySelector('#getName')
  email = document.querySelector('#getEmail')
  password = document.querySelector('#getPassword')
  var req = new XMLHttpRequest()
  var urlname = url + 'api/user'
  req.open('POST', urlname, true)
  var data
  data = {
    'name': username.value,
    'email': email.value,
    'password': password.value
  }
  data = JSON.stringify(data)
  req.setRequestHeader('Content-type', 'application/json')
  req.onload = function () {
    response = this.responseText
    console.log(response)
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

function signin() {
  email = document.querySelector('#getEmail')
  password = document.querySelector('#getPassword')
  var req = new XMLHttpRequest()
  var urlname = url + 'api/user'
  req.open('PATCH', urlname, true)
  var data
  data = {
    'email': email.value,
    'password': password.value
  }
  data = JSON.stringify(data)
  req.setRequestHeader('Content-type', 'application/json')

  req.send(data)
  req.onload = function () {
    response = this.responseText
    console.log(response)
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
  var signupResponse = document.createElement('div')
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
  var req = new XMLHttpRequest()
  var urlname = url + 'api/user'
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
  })
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
      var tt = document.getElementById('circle' + changeImg)
      tt.style.background = 'white'
      changeImg += 1
      changeImg = Math.abs(changeImg) % imgCount
      changeImgN += 1
      changeImgN = Math.abs(changeImgN) % imgCount
      changeImgP += 1
      changeImgP = Math.abs(changeImgP) % imgCount
      var tt = document.getElementById('circle' + changeImg)
      tt.style.background = 'black'
      document.getElementsByClassName('picPre')[0].remove()
      document.getElementsByClassName('picNow')[0].setAttribute('class', 'part1Img picPre')
      document.getElementsByClassName('picNext')[0].setAttribute('class', 'part1Img picNow')
      var picNext = document.createElement('img')
      picNext.setAttribute('class', 'part1Img picNext')
      picNext.setAttribute('src', nextPic[changeImgN])
      document.getElementsByClassName('part1pic')[0].appendChild(picNext)
    }, 500)
  } else if (e.keyCode === 37 || arrow === 'L') {
    document.getElementsByClassName('picNow')[0].style.transform = 'translateX(100%)'
    document.getElementsByClassName('picPre')[0].style.transform = 'translateX(0%)'
    setTimeout(() => {
      var tt = document.getElementById('circle' + changeImg)
      tt.style.background = 'white'
      changeImg -= 1
      changeImg = Math.abs(imgCount + changeImg) % imgCount
      changeImgP -= 1
      changeImgP = Math.abs(imgCount + changeImgP) % imgCount
      changeImgN -= 1
      changeImgN = Math.abs(imgCount + changeImgN) % imgCount
      var tt = document.getElementById('circle' + changeImg)
      tt.style.background = 'black'
      document.getElementsByClassName('picNext')[0].remove()
      document.getElementsByClassName('picNow')[0].setAttribute('class', 'part1Img picNext')
      document.getElementsByClassName('picPre')[0].setAttribute('class', 'part1Img picNow')
      var picPre = document.createElement('img')
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
    }
    )
  }
}

var TF = true
function scrollToLoadMore() {
  window.addEventListener('scroll', function () {
    var content = document.getElementsByClassName('content')[0]
    var rect = content.getBoundingClientRect()
    var height = document.documentElement.clientHeight
    if ((height - rect.bottom) >= 0 & TF == true) {
      TF = false
      loadmore()
    }
  })
}


function searchAttraction() {

  var p = document.getElementsByClassName('pic_box')[0]
  if (p) {
    p.remove()
  }
  var n = document.getElementsByClassName('noMatchData')[0]
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
  var n = document.getElementsByClassName('noMatchData')[0]
  var noMatchData = document.createElement('div')
  noMatchData.appendChild(document.createTextNode('找不到包含 ' + keyword.replace('&keyword=', '') + ' 的景點'))
  noMatchData.setAttribute('class', 'noMatchData')
  document.getElementsByClassName('wrapper')[0].appendChild(noMatchData)
}

function addElementPicCircle(changeImg, imgCount) {
  // 小白點們 有黑有白啦
  var circlesContainer = document.createElement('div')
  circlesContainer.setAttribute('class', 'circlesContainer')
  document.getElementsByClassName('part1pic')[0].appendChild(circlesContainer)
  for (let k = 0; k < imgCount; k++) {
    var littleCircle = document.createElement('div')
    littleCircle.setAttribute('class', 'littleCircle')
    littleCircle.setAttribute('id', 'circle' + k)
    document.getElementsByClassName('circlesContainer')[0].appendChild(littleCircle)
  }
  var tt = document.getElementById('circle' + changeImg)
  tt.style.background = 'black'

  // 左右圈圈
  var leftCircle = document.createElement('div')
  leftCircle.setAttribute('class', 'LRcirlce')
  leftCircle.setAttribute('id', 'leftCircle')
  leftCircle.setAttribute('onclick', 'subAEL(\'\',\'L\')')
  document.getElementsByClassName('part1pic')[0].appendChild(leftCircle)
  var rightCircle = document.createElement('div')
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