# 載入Flask
from flask import Flask, redirect, request, render_template, session, jsonify, json
import mysql.connector

mydb = mysql.connector.connect(host='localhost',
                               user='root',
                               password='password',
                               database='website')

mycursor = mydb.cursor()

app = Flask(__name__, static_folder='templates', static_url_path='/')
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["JSON_SORT_KEYS"] = False
app.secret_key = 'jkdkowu48g'
app.config["JSON_AS_ASCII"] = False


# Pages
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html", id=id)


@app.route("/booking")
def booking():
    return render_template("booking.html")


@app.route("/thankyou")
def thankyou():
    return render_template("thankyou.html")


@app.route('/api/attractions')
def attractions():
    page = request.args.get('page', 0)
    nextPage = int(page) + 1
    keyword = request.args.get('keyword', '')
    keyword = '%' + keyword + '%'
    datafrom = int(page) * 12
    dataNumPage = 12
    sql = 'SELECT * FROM (SELECT _id,stitle,CAT2,xbody,address,info,MRT,latitude,longitude,file FROM taipei WHERE stitle like %s order by _id  ) as a LIMIT %s,%s'
    val = (keyword, datafrom, dataNumPage)
    mycursor.execute(sql, val)
    sqldata = mycursor.fetchall()
    myresult = [''] * (len(sqldata))
    for k in range(0, len(sqldata)):
        imagesx1 = sqldata[k][9].split(',')
        myresult[k] = {
            'id': sqldata[k][0],
            'name': sqldata[k][1],
            'category': sqldata[k][2],
            'description': sqldata[k][3],
            'address': sqldata[k][4],
            'transport': sqldata[k][5],
            'mrt': sqldata[k][6],
            'latitude': sqldata[k][7],
            'longitude': sqldata[k][8],
            'images': [imagesx1[0]]
        }

    # 判斷下一頁------
    sql = 'SELECT * FROM (SELECT stitle FROM taipei WHERE stitle like %s order by _id  ) as a LIMIT %s,%s'
    val = (keyword, datafrom + 12, 1)
    mycursor.execute(sql, val)
    sqldata = mycursor.fetchall()
    if sqldata == []:
        nextPage = None
    # ---------------
    return {'nextPage': nextPage, 'data': myresult}


@app.route('/api/attraction/<int:attractionid>')
def attractionsID(attractionid):
    sql = 'SELECT _id,stitle,CAT2,xbody,address,info,MRT,latitude,longitude,file FROM taipei WHERE _id=%s'
    val = (attractionid, )
    mycursor.execute(sql, val)
    sqldata = mycursor.fetchall()
    myresult = ['']
    imagesx1 = sqldata[0][9].split(',')
    myresult[0] = {
        'id': sqldata[0][0],
        'name': sqldata[0][1],
        'category': sqldata[0][2],
        'description': sqldata[0][3],
        'address': sqldata[0][4],
        'transport': sqldata[0][5],
        'mrt': sqldata[0][6],
        'latitude': sqldata[0][7],
        'longitude': sqldata[0][8],
        'images': [imagesx1]
    }
    return {'data': myresult}


@app.route('/api/user', methods=['GET'])
def api_get():
    username = session.get('username', '')
    mycursor.execute('SELECT * FROM taipei_user WHERE name = "' + username +
                     '"')
    myresult = mycursor.fetchall()
    if myresult == []:
        userfound = None
    else:
        userfound = {
            'id': myresult[0][0],
            'name': myresult[0][1],
            'email': myresult[0][3],
        }
    return {'data': userfound}


@app.route('/api/user', methods=['POST'])
def api_post():
    user = request.get_json()
    if (user['name'].find(' ') != -1 or user['email'].find(' ') != -1
            or user['password'].find(' ') != -1 or user['name'] == ''
            or user['email'] == '' or user['password'] == ''):
        errorResponse = {'error': True, 'message': '註冊失敗'}
        return (errorResponse, 400)
    else:
        mycursor.execute('SELECT email FROM taipei_user WHERE email = "' +
                         user['email'] + '"')
        myresult = mycursor.fetchall()
        print(myresult)
        if myresult != []:
            message = '此email已被註冊'
            errorResponse = {'error': True, 'message': message}
            return (errorResponse, 400)

        else:
            sql = 'INSERT INTO taipei_user (name, email, password) VALUES (%s, %s, %s)'
            val = (user['name'], user['email'], user['password'])
            mycursor.execute(sql, val)
            mydb.commit()
            return {'ok': True}


@app.route('/api/user', methods=['PATCH'])
def api_patch():
    user = request.get_json()
    sql = 'SELECT * FROM taipei_user WHERE email = %s AND password = %s'
    val = (user['email'], user['password'])
    mycursor.execute(sql, val)
    myresult = mycursor.fetchall()
    if myresult == []:
        message = '帳號或密碼錯誤'
        errorResponse = {'error': True, 'message': message}
        return (errorResponse, 400)
    else:
        session['id'] = myresult[0][0]
        session['username'] = myresult[0][1]
        session['email'] = myresult[0][3]
        session['password'] = myresult[0][4]
        return {'ok': True}


@app.route('/api/user', methods=['DELETE'])
def api_delete():
    session.pop('username', None)
    return {'ok': True}


@app.route('/logout')
def signout():
    session.pop('username', None)
    return redirect('/')


@app.errorhandler(404)
def internal_error400(error):
    return {'error': True, "message": "錯誤訊息"}


@app.errorhandler(500)
def internal_error500(error):
    return {'error': True, "message": "自訂的錯誤訊息"}


app.run(host="0.0.0.0", port=3000)
