function getData() {
  var req = new XMLHttpRequest()
  // var urlname = 'https://padax.github.io/taipei-day-trip-resources/taipei-attractions.json'
  var urlname = 'http://0.0.0.0:3000/api/attractions?page=0'
  req.open('GET', urlname, true)
  req.onload = function () {
    var data = JSON.parse(this.responseText);
    for (let k = nowPostFrom; k < nowPost; k++) {

      title = data.data[k].name
      photourl = data.data[k].images[0]
      mrt = data.data[k].mrt
      category = data.data[k].category

      // console.log(k)
      // console.log(title, mrt)
      addElement(title, photourl, mrt, category, k)
    }
  }
  req.send()
}

function addElement(title, photourl, mrt, category, k) {

  // 卡片 框框
  var addPicCard = document.createElement('div')
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

getData()


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
  // 顯示 Dialog
  var dialogContainer = document.getElementById('dialogContainer')
  dialogContainer.style.display = 'block'

  // 卡住不准滾
  var wrapper = document.getElementById('wrapper')
  wrapper.classList.add('mask')
  wrapper.style.height = '100vh'
  wrapper.style.overflow = 'hidden'
  var footer = document.getElementsByTagName('footer')
  footer[0].style.display = 'none'
}

function closeBtn() {
  // 滾吧
  var wrapper = document.getElementById('wrapper')
  wrapper.classList.add('mask')
  wrapper.style.height = ''
  wrapper.style.overflow = 'auto'
  var footer = document.getElementsByTagName('footer')
  footer[0].style.display = 'block'

  // Dialog關起來
  var dialogContainer = document.getElementById('dialogContainer')
  dialogContainer.style.display = 'none'
  var wrapper = document.getElementById('wrapper')
  wrapper.classList.remove('mask')
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