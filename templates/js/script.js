function getData() {
  var req = new XMLHttpRequest()
  // var urlname = 'http://0.0.0.0:3000/api/attractions?page=0'
  var urlname = 'http://18.182.195.43:3000/api/attractions?page=0'
  req.open('GET', urlname, true)
  req.onload = function () {
    var data = JSON.parse(this.responseText);
    for (let k = nowPostFrom; k < nowPost; k++) {

      title = data.data[k].name
      photourl = data.data[k].images[0]
      mrt = data.data[k].mrt
      category = data.data[k].category
      id = data.data[k].id
      addElement(title, photourl, mrt, category, id, k)
    }
  }
  req.send()
}

function addElement(title, photourl, mrt, category, id, k) {

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

// getData()


var nowPost = 12
var nowPostFrom = nowPost - 12

function loadmore() {
  nowPostFrom = nowPost
  nowPost += 12
  if (nowPost <= 283) {
    getData()
  } else if (nowPost === 288) {
    nowPost = 283
    getData()
  }
  console.log(nowPost)
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
  // var urlname = 'http://0.0.0.0:3000/api/attraction/' + id
  var urlname = 'http://18.182.195.43:3000/api/attraction/' + id
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