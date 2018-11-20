// 增
function create(model,param){
  // return new Promise((resolve, reject) => {
    return model.create(param)
    .then(data => {
      return {
        status: true,
        data
      }
    })
    .catch(err => {
      return {
        status: false,
        message: '数据库操作异常',
        data: err
      }
    })
  // })
}
// 查找一条
function findOne(model,param){
  // return new Promise((resolve, reject) => {
    return model.findOne(param)
    .then(data => {
      return {
        status: true,
        data
      }
    })
    .catch(err => {
      return {
        status: false,
        message: '数据库操作异常',
        data: err
      }
    })
  // })
}
// 有就修改没有则添加
function findCreate(model, param, find){
  return new Promise((resolve, reject) => {
    model.findOne(find).then(data => {
      if (data){ // 有
        model.update(find, param).then(data => {
          resolve({
            status: true,
            data
          })
        }).catch(err => {
          reject({
            status: false,
            message: '数据库操作异常',
            data: err
          })
        })
      }else{ // 没有
        model.create(param).then(data => {
          resolve({
            status: true,
            data
          })
        }).catch(err => {
          reject({
            status: false,
            message: '数据库操作异常',
            data: err
          })
        })
      }
    }).catch(err => {
      reject({
        status: false,
        message: '数据库操作异常',
        data: err
      })
    })
  })
}
// 改
function update(model, find, param) {
  // return new Promise((resolve, reject) => {
    return model.update(find, param)
    .then(data => {
      return {
        status: true,
        data
      }
    }).catch(err => {
      return {
        status: false,
        message: '数据库操作异常',
        data: err
      }
    })
  // })
}
// 查
function find(model, param){
  return model.find(param, null, { sort: [{ _id: -1 }] }) 
  .populate('user', ['avatar', 'nickName', 'userName'])
  .then(data => {
    return {
      status: true,
      data
    }
  })
  .catch(err => {
    return {
      status: false,
      message: '数据库操作异常',
      data: err
    }
  })
}
// 通过ID查
function findById(model, param){
  return model.findById(param) 
  .populate('user', ['avatar', 'nickName', 'userName'])
  .then(data => {
    return {
      status: true,
      data
    }
  })
  .catch(err => {
    return {
      status: false,
      message: '数据库操作异常',
      data: err
    }
  })
}
// 查找一条并删除
function findOneAndRemove(model, param){
  return model.findOneAndRemove(param) 
  .then(data => {
    return {
      status: true,
      data
    }
  })
  .catch(err => {
    return {
      status: false,
      message: '数据库操作异常',
      data: err
    }
  })
}

module.exports = {
  create,
  findOne,
  findCreate,
  update,
  find,
  findById,
  findOneAndRemove
}