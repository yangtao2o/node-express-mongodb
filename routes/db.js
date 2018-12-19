const MongoClient = require('mongodb').MongoClient
const settings = require('./settings')
const dbName = settings.nickname
// 链接数据库，没有则自动创建
function _connectDB(callback) {
  let url = settings.dbUrl
  MongoClient.connect(url, function (err, client) {
    if(err) {
      callback(err, null);
      return
    }
    // 链接成功执行回调
    callback(err, client)
  })
}

// 插入数据
exports.insertOne = function(collectionName, json, callback) {
  _connectDB(function(err, client) {
    client.db(dbName).collection(collectionName).insertOne(json, function(err, results) {
      if(err) {
        callback(err, null);
        client.close()
        return
      }
      callback(err, results)
      client.close()
    })
  })
}

// 查找数据
exports.find = function (collectionName, queryJson, callback) {
  _connectDB(function(err, client) {
    let json = queryJson.query || {},
      limit = Number(queryJson.limit) || 0,
      count = Number(queryJson.page) - 1,
      sort = queryJson.sort || {}

    // 页数为 0 或 1 都显示前 limit 条数据
    if(count <= 0) {
      count = 0
    } else {
      count = count * limit
    }

    let cursor = client.db(dbName).collection(collectionName).find(json).limit(limit).skip(count).sort(sort)

    cursor.toArray(function(err, results) {
      if(err) {
        callback(err, null),
        client.close()
        return
      }
      callback(err, results)
      client.close()
    })
  })
}

// 删除数据
exports.deleteMany = function(collectionName, json, callback) {
  _connectDB(function(err, client) {
    client.db(dbName).collection(collectionName).deleteMany(json, function(err, results) {
      if(err) {
        callback(err, null)
        client.close()
        return
      }
      callback(err, results)
      client.close()
    })
  })
}

// 修改数据
exports.updateMany = function(collectionName, jsonOld, jsonNew, callback) {
  _connectDB(function(err, client) {
    client.db(dbName).collection(collectionName).updateMany(
      jsonOld, {
        $set: jsonNew,
        $currentDate: { 'lastModified': false }
      },
      function(err, results) {
        if(err) {
          callback(err, null)
          client.close()
          return
        }
        callback(err, results)
        db.close()
      }
    )
  })
}
