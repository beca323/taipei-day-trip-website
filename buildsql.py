import mysql.connector
import json

mydb = mysql.connector.connect(host='localhost',
                               user='root',
                               password='password',
                               database='website',
                               auth_plugin='mysql_native_password')

mycursor = mydb.cursor()
# sql = 'INSERT INTO taipei (info	,stitle	,xpostDate) VALUES (%s, %s, %s)'

with open('./data/taipei-attractions.json',encoding="utf-8") as f:
    data = json.load(f)

item = [''] * 21
itemContent = [''] * 21

item[0] = 'info'
item[1] = 'stitle'
item[2] = 'xpostDate'
item[3] = 'longitude'
item[4] = 'REF_WP'
item[5] = 'avBegin'
item[6] = 'langinfo'
item[7] = 'MRT'
item[8] = 'SERIAL_NO'
item[9] = 'RowNumber'
item[10] = 'CAT1'
item[11] = 'CAT2'
item[12] = 'MEMO_TIME'
item[13] = 'POI'
item[14] = 'file'
item[15] = 'idpt'
item[16] = 'latitude'
item[17] = 'xbody'
item[18] = '_id'
item[19] = 'avEnd'
item[20] = 'address'


def insertSQL(datanum):
    for k in range(0, 21):
        itemContent[k] = data['result']['results'][datanum][item[k]]

    sql = 'select serial_no from taipei where serial_no= %s'
    val = (itemContent[8], )
    mycursor.execute(sql, val)
    myresult = mycursor.fetchall()
    # print(myresult)
    if myresult != []:
        print(myresult)
        # pass
    else:
        # jpgfile處理 -------------------
        def jpgfileTransform(string):
            string = string.replace('http', ',http')[1:]
            files = string.split(',')
            jpgfile = [''] * len(files)
            jpgString = ''

            n = 0
            for k in range(0, len(files)):
                if files[k][-4:] == '.jpg' or files[k][-4:] == '.JPG':
                    jpgfile[n] = files[k]
                    jpgString += ',' + jpgfile[n]
                    n += 1

            return jpgString[1:]

        itemContent[14] = jpgfileTransform(itemContent[14])
        # -------------------jpgfile處理

        sql = 'INSERT INTO taipei (info	,stitle	,xpostDate	,longitude	,REF_WP	,avBegin	,langinfo,MRT	,SERIAL_NO	,RowNumber	,CAT1	,CAT2	,MEMO_TIME	,POI	,file	,idpt	,latitude	,xbody	,_id	,avEnd	,address) VALUES (%s, %s, %s,%s, %s, %s,%s, %s, %s,%s, %s, %s,%s, %s, %s,%s, %s, %s,%s, %s, %s)'
        val = (tuple(itemContent))
        mycursor.execute(sql, val)
        mydb.commit()


for alldata in range(0, data['result']['count']):
    insertSQL(alldata)
