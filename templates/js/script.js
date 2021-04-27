var nextPage = 0
var keyword = ''
var url = 'http://0.0.0.0:3000/'
// var url = 'http://127.0.0.1:3000/'
// var url = 'http://18.182.195.43:3000/'
function getData() {
  var req = new XMLHttpRequest()
  // var urlname = url + 'api/attractions?page=' + nextPage + keyword
  // var urlname = url + 'api/attractions?page=' + nextPage + keyword
  var urlname = url + 'api/attractions?page=' + nextPage + keyword
  req.open('GET', urlname, true)
  req.onload = function () {
    var data = JSON.parse(this.responseText);

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
  }
  req.send()
  scrollToLoadMore()
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

function loadmore() {
  if (nextPage != null) {
    getData()
  }
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
    logOrSign = false
  } else {
    toSignin.innerHTML = '還沒有帳戶？點此註冊'
    dialogTitle[0].innerHTML = '登入會員帳號'
    logOrSign = true
    getName.style.display = 'none'
  }
}

function getAttraction(id) {
  var req = new XMLHttpRequest()
  // var urlname = url+'api/attraction/' + id
  // var urlname = url+'api/attraction/' + id
  var urlname = url + 'api/attraction/' + id
  req.open('GET', urlname, true)
  req.onload = function () {
    var data = JSON.parse(this.responseText);
    data = data.data[0]

    var title = document.getElementsByClassName('title')[0]
    title.innerHTML = data.name
    var cat = document.getElementsByClassName('cat')[0]
    cat.innerHTML = data.category
    // var mrt = document.getElementsByClassName('mrt')[0]
    // mrt.innerHTML = data.mrt
    getAttractionInfo('mrt')
  }
  req.send()

}

function getAttractionInfo(varName) {
  var dumVarName = document.getElementsByClassName(varName)[0]
  console.log(dumVarName)
  console.log(varName)
  dumVarName.innerHTML = data.mrt

}

var TF = true
function scrollToLoadMore() {
  window.addEventListener('scroll', function () {
    var content = document.getElementsByClassName('content')[0]
    var rect = content.getBoundingClientRect()
    var height = document.documentElement.clientHeight;
    // console.log(height, rect.bottom)
    if ((height - rect.bottom) >= 0 & TF == true) {
      TF = false
      loadmore()
      stop1sec()
    }
  })
}
function stop1sec() {
  setTimeout(function () {
    TF = true
    scrollToLoadMore()
  }, 100)
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
  getData()
}

function indexOnload() {
  getData()
  var keyword = document.getElementById('keyword')
  keyword.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      searchAttraction()
    }
  })
}

function noMatchData() {
  var n = document.getElementsByClassName('noMatchData')[0]
  if (n) {
    // n.remove()
    console.log('沒砍掉啊')
  }
  var noMatchData = document.createElement('div')
  noMatchData.appendChild(document.createTextNode('找不到包含 ' + keyword.replace('&keyword=', '') + ' 的景點'))
  noMatchData.setAttribute('class', 'noMatchData')
  document.getElementsByClassName('wrapper')[0].appendChild(noMatchData)
}


