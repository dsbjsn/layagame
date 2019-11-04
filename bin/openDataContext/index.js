//-----------------------------------------------------------资源管理-----------------------------------------------------------
//资源列表
const assetsUrl = {
  icon_1: "openDataContext/assets/rank_1.png",
  icon_2: "openDataContext/assets/rank_2.png",
  icon_3: "openDataContext/assets/rank_3.png",
  rank_bg: "openDataContext/assets/rank_bg.png",
  self_bg: "openDataContext/assets/self_bg.png"
};

const assets = []

//是否加载过资源的标记量
let hasLoadRes;

//资源加载
function preloadAssets() {
  let preloaded = 0;
  let count = 0;
  for (let asset in assetsUrl) {
    count++;
    const img = wx.createImage();
    img.onload = () => {
      preloaded++;
      if (preloaded == count) {
        hasLoadRes = true;
      }
    }
    img.src = assetsUrl[asset];
    assets[asset] = img;
  }
}
preloadAssets();

//-----------------------------------------------------------资源管理-----------------------------------------------------------

//用户数据
let user = {
  openid: '',
  nickname: '自己',
  avatarUrl: 'openDataContext/assets/head_default.png',
  kv: {
    max_score: 1,
    station_name: "北京",
  }
}


//好友数据
let friend = {
  data: {},
  rank_key: []
}

//获取主域和开放数据域共享的 sharedCanvas
let sharedCanvas = wx.getSharedCanvas()
let context = sharedCanvas.getContext('2d')
context.globalCompositeOperation = "source-over"

//清空
function clear() {
  context.clearRect(0, 0, context.width, context.height)
}


//将KVDataList转化为对象
function kv_list2obj(KVDataList) {
  let obj = {}
  if (KVDataList.length) {
    for (let val of KVDataList) {
      obj[val.key] = val.value
    }
  }
  return obj
}


//更换微信用户头像加载的更改尺寸 size:0(代表640*640)、46、64、96、132
function updateAvatarSize(avatarUrl, size = 96) {
  var reg = /\/(0|64|96|132)$/g;
  var res = reg.exec(avatarUrl)
  if (res) {
    avatarUrl = avatarUrl.substring(0, res.index) + '/' + size;
  }
  return avatarUrl;
}


//更新好友排序
function rank(field = 'max_score') {
  friend.rank_key = []
  let obj = {}
  for (let openid in friend.data) {
    obj[Math.floor(friend.data[openid].kv[field] || 0) + '' + (Math.floor(Math.random() * 900) + 100)] = openid
  }
  console.log('obj', obj)
  let list = Object.keys(obj).sort((a, b) => { return b - a })
  if (list.length) {
    for (let val of list) {
      friend.rank_key.push(obj[val])
    }
  }
}


//用户名称缩略
function slug(str) {
  return str.length > 5 ? str.substr(0, 5) + '...' : str
}

wx.getFriendCloudStorage({
  keyList: ['max_score', "station_name"],
  success: (res) => {
    console.log("res", res);

    if (res && res.data) {
      //清空旧数据
      friend.data = {}
      for (let val of res.data) {
        //将KVDataList字段的内容转化到kv中以对象的形式存在
        val.kv = kv_list2obj(val.KVDataList)
        delete val.KVDataList
        //更换微信用户头像尺寸
        val.avatarUrl = updateAvatarSize(val.avatarUrl)
        friend.data[val.openid] = val
      }
    }
    console.log("getFriendCloudStorage:", friend);

    //更新好友排序
    rank()
  }
})

//同步分数
function setScore(score, station_name) {
  wx.setUserCloudStorage({
    KVDataList: [
      { key: 'max_score', value: score + '' },
      { key: 'station_name', value: station_name + '' }
    ]
  })
}



//画选项
function canvas_item(obj) {
  if (obj.isSelf) {
    context.fillStyle = '#eeeeee';
    context.fillRect(0, obj.y, 600, 110);
  }

  //画排名数字
  if (obj.rank <= 3) {
    context.drawImage(assets['icon_' + obj.rank], 36, obj.y + 30, 36, 46)
  } else {
    context.drawImage(assets['rank_bg'], 36, obj.y + 40, 36, 36)
    context.font = "24px SimHei";
    context.fillStyle = '#99908E';
    context.fillText(obj.rank, 54, obj.y + 67);
  }

  //画昵称
  context.font = "normal bold 28px SimHei";
  context.textAlign = 'left';
  context.fillStyle = "#595453";
  context.fillText(obj.nickname, 194, obj.y + 65, 250);

  //画分数
  context.font = "24px SimHei";
  context.textAlign = 'center';
  let text = "- 第" + obj.max_score + "站 -"
  context.fillStyle = "#595453";
  context.fillText(text, 480, obj.y + 46, 106)

  //画站点
  context.fillStyle = "#595453";
  context.font = "30px SimHei";
  context.fillText(obj.station_name, 480, obj.y + 80, 106)

  //画头像
  const img = wx.createImage();
  img.src = obj.avatarUrl === '' ? 'openDataContext/assets/head_default.png' : obj.avatarUrl;
  img.onload = () => {
    context.save()
    context.beginPath()
    context.arc(136, obj.y + 55, 36, 0, Math.PI * 2, false);
    context.closePath()
    context.clip()
    context.drawImage(img, 100, obj.y + 19, 72, 72)
    context.restore()
  }

  context.fillStyle = '#f0f0f0';
  context.fillRect(0, obj.y + 110, 600, 1);
}


//画选项
function canvas_owner(obj) {
  context.drawImage(assets['self_bg'], 0, 0, 600, 110);

  if (obj.rank <= 3) {
    context.drawImage(assets['icon_' + obj.rank], 36, obj.y + 30, 36, 46)
  } else {
    context.drawImage(assets['rank_bg'], 36, obj.y + 40, 36, 36)
    context.font = "24px SimHei";
    context.fillStyle = '#99908E';
    context.fillText(obj.rank, 54, obj.y + 67);
  }

  //画昵称
  context.font = "normal bold 28px SimHei";
  context.textAlign = 'left';
  context.fillStyle = "#595453";
  context.fillText(obj.nickname, 194, obj.y + 65, 250);

  //画分数
  context.font = "24px SimHei";
  context.textAlign = 'center';
  let text = "- 第" + obj.max_score + "站 -"
  context.fillStyle = "#595453";
  context.fillText(text, 480, obj.y + 46, 106)

  //画站点
  context.fillStyle = "#595453";
  context.font = "30px SimHei";
  context.fillText(obj.station_name, 480, obj.y + 80, 106)

  //画头像
  const img = wx.createImage();
  img.src = obj.avatarUrl === '' ? 'openDataContext/assets/head_default.png' : obj.avatarUrl;
  img.onload = () => {
    context.save()
    context.beginPath()
    context.arc(136, obj.y + 55, 36, 0, Math.PI * 2, false);
    context.closePath()
    context.clip()
    context.drawImage(img, 100, obj.y + 19, 72, 72)
    context.restore()
  }
}

function canvas_next(obj) {
  //画头像
  const img = wx.createImage();
  img.src = obj.avatarUrl === '' ? 'openDataContext/assets/head_default.png' : obj.avatarUrl;
  img.onload = () => {
    context.save()
    roundedRect(context, 0, 0, 108, 108, 16);
    context.clip()
    context.drawImage(img, 0, 0, 108, 108)
    context.restore()
  }
}


function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
  ctx.lineTo(x + width - radius, y + height);
  ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  ctx.lineTo(x + width, y + radius);
  ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
  ctx.lineTo(x + radius, y);
  ctx.quadraticCurveTo(x, y, x, y + radius);
  ctx.closePath()
}

wx.onMessage((param) => {
  console.log('===================================微信开放域===========================================')
  console.log('param', param)
  switch (param.command) {
    case 'rank_list':
      clear()
      context.width = param.data.width;
      context.height = param.data.height;

      let len = friend.rank_key.length
      for (let i = 0; i < len; i++) {
        canvas_item({
          isSelf: user.openid === friend.rank_key[i] ? true : false,
          openid: friend.data[friend.rank_key[i]].openid,
          rank: i + 1,
          nickname: friend.data[friend.rank_key[i]].nickname,
          avatarUrl: friend.data[friend.rank_key[i]].avatarUrl,
          max_score: friend.data[friend.rank_key[i]].kv.max_score,
          station_name: friend.data[friend.rank_key[i]].kv.station_name,
          x: 0,
          y: 110 * i
        })
      }
      break;
    case 'rank_owner':
      clear()
      context.width = param.data.width;
      context.height = param.data.height;

      let size = friend.rank_key.length
      for (let i = 0; i < size; i++) {
        if (user.openid == friend.rank_key[i]) {
          canvas_owner({
            isSelf: true,
            openid: friend.data[friend.rank_key[i]].openid,
            rank: i + 1,
            nickname: friend.data[friend.rank_key[i]].nickname,
            avatarUrl: friend.data[friend.rank_key[i]].avatarUrl,
            max_score: friend.data[friend.rank_key[i]].kv.max_score,
            station_name: friend.data[friend.rank_key[i]].kv.station_name,
            x: 0,
            y: 0
          });
          break;
        }
      }
      break;
    case "next_friend":
      clear()

      let size2 = friend.rank_key.length

      let next;
      for (let i = 0; i < size2; i++) {
        if (user.openid == friend.rank_key[i]) {
          console.log("即将超越：", next);
          canvas_next({
            avatarUrl: next.avatarUrl,
          });
          break;
        }
        next = friend.data[friend.rank_key[i]]
      }
      break;
    case 'user':

      if (param.openid !== undefined)
        user.openid = param.openid

      if (param.score !== undefined)
        user.kv.max_score = param.score

      if (param.station_name !== undefined)
        user.kv.station_name = param.station_name

      console.log("user", user);

      if (friend.data[user.openid] === undefined) {
        friend.data[user.openid] = user;
        setScore(user.kv.max_score, user.kv.station_name)
      } else {
        if (friend.data[user.openid].kv.max_score < user.kv.max_score) {
          friend.data[user.openid].kv.max_score = user.kv.max_score;
          friend.data[user.openid].kv.station_name = user.kv.station_name;
          setScore(user.kv.max_score, user.kv.station_name);
        }
      }
      console.log("friend:", friend);

      rank()
      break;
    case 'set_score':
      if (friend.data[user.openid].kv.max_score < param.score) {
        friend.data[user.openid].kv.max_score = param.score;
        friend.data[user.openid].kv.station_name = param.station_name;

        user.kv.max_score = param.score;
        user.kv.station_name = param.station_name;
        setScore(user.kv.max_score, user.kv.station_name);
      }
      console.log("friend.data[user.openid]", friend.data[user.openid]);
      rank()
      break;
    default:
      break;
  }
})