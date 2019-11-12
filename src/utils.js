/**
 * 工具函数
 * @module utils
 * @ignore
 */

import ajax from 'jraiser/ajax/1.5/ajax';
import md5 from 'jraiser/crypto/1.1/md5';

/**
 * 动态计算合理的分片大小
 * @param {Number} fileSize 文件大小，单位为Bytes
 * @returns {Number}
 */
export function getPartSize(fileSize) {
  let partSize = 2 * 1024 * 1024;
  if (fileSize <= 2 * 1024 * 1024 * 1024) {
    partSize = 2 * 1024 * 1024;
  } else if (fileSize <= 5 * 1024 * 1024 * 1024) {
    partSize = Math.ceil(fileSize / 2000);
  } else if (fileSize <= 10 * 1024 * 1024 * 1024) {
    partSize = Math.ceil(fileSize / 4000);
  } else if (fileSize <= 20 * 1024 * 1024 * 1024) {
    partSize = Math.ceil(fileSize / 8000);
  } else if (fileSize <= 30 * 1024 * 1024 * 1024) {
    partSize = Math.ceil(fileSize / 10000);
  }
  return partSize;
}

/**
 * 初始化视频信息
 * @param {UserDate} userData 用户信息
 * @param {FileData} fileData 文件信息
 * @returns {Promise}
 */
export function initUpload(userData, fileData) {
  const data = {
    ptime: userData.ptime,
    sign: userData.sign,
    hash: userData.hash,

    title: fileData.title,
    describ: fileData.desc,
    cataid: fileData.cataid,
    tag: fileData.tag,
    luping: fileData.luping,
    keepsource: fileData.keepsource,
    filesize: fileData.filesize,
    state: fileData.state,

    autoid: 1, // 自动生成vid，无需在请求参数中传vid
    uploadType: 'js_sdk_chunk_v1',
    compatible: 1
  };
  const url = `//api.polyv.net/v2/uploadvideo/${userData.userid}/init`;
  return ajax.send(url, { method: 'POST', data: data });
}

/**
 * 获取token
 * @param {UserData} userData 用户信息
 * @returns {Promise}
 */
export function getToken(userData) {
  const data = {
    ptime: userData.ptime,
    sign: userData.sign,
    hash: userData.hash,
    compatible: 1
  };
  const url = `//api.polyv.net/v2/uploadvideo/${userData.userid}/token`;
  return ajax.send(url, { method: 'GET', data: data });
}

/**
 * 保存checkpoint信息
 * @param {String} key 不同文件的唯一标识
 * @param {*} checkpoint 断点续传过程返回的断点信息
 */
export function setLocalFileInfo(key, checkpoint) {
  try {
    localStorage.setItem(key, JSON.stringify(checkpoint));
  } catch (e) {
    console.info(e);
  }
}

/**
 * 获取checkpoint信息
 * @param {String} key 不同文件的唯一标识
 * @returns {Object}
 */
export function getLocalFileInfo(key) {
  const checkpointStr = localStorage.getItem(key) || 'null';
  return JSON.parse(checkpointStr);
}

/**
 * 移除指定文件的checkpoint信息
 * @param {String} key 不同文件的唯一标识
 */
export function clearLocalFileInfo(key) {
  localStorage.removeItem(key);
}

// 根据文件信息及用户信息对每个不同的文件生成具有一定长度的唯一标识
function _generateFingerprint(fileData, userData) {
  const { cataid, file } = fileData;
  return md5(`polyv-${userData.userid}-${cataid}-${file.name}-${file.type}-${file.size}`);
}

/**
 * 过滤带尖括号的标签
 * @param {String} str 待处理的字符
 * @returns {String}
 */
export function cleanStript(str) {
  if (str && typeof str === 'string') {
    str = str.trim();
    str = str.replace(/<.+?>/g, '');
  }
  return str;
}

/**
 * 生成fileData对象
 * @param {File} file 文件对象
 * @param {Object} fileSetting 用户对文件的设置
 * @param {UserData} userData 用户信息
 * @returns {FileData}
 */
export function generateFileData(file, fileSetting, userData) {
  // 设置默认值
  const fileData = {
    desc: '',
    cataid: 1,
    tag: '',
    luping: 0,
    keepsource: 0,
    title: file.name.replace(/\.\w+$/, ''),
  };
  for (const key in fileSetting) {
    if (key === 'title') {
      if (typeof fileSetting.title !== 'string' || fileSetting.title.replace(/(^\s*)|(\s*$)/, '') === '') {
        continue;
      }
      fileData.title = cleanStript(fileSetting.title);
    } else {
      fileData[key] = fileSetting[key];
    }
  }
  Object.defineProperty(fileData, 'file', { value: file, writable: false, enumerable: false, configurable: false });
  Object.defineProperty(fileData, 'size', { value: file.size, writable: false, enumerable: false, configurable: false });
  Object.defineProperty(fileData, 'filesize', { value: file.size, writable: false, enumerable: false, configurable: false });
  Object.defineProperty(fileData, 'id', { value: _generateFingerprint(fileData, userData), writable: false, enumerable: false, configurable: false });

  return fileData;
}

function getAPIProtocol() {
  if (window.location.protocol === 'http:') {
    return 'http:';
  }
  return 'https:';
}

/**
 * 生成ossConfig对象
 * @param {Object} data init接口或获取token的接口返回的data
 * @returns {Object}
 */
export function generateOssConfig(data) {
  const protocol = getAPIProtocol();
  return {
    endpoint: protocol + '//' + data.domain,
    bucket: data.bucketName,
    accessKeyId: data.accessId,
    accessKeySecret: data.accessKey,
    stsToken: data.token,
    secure: protocol === 'https:',
    cname: true
  };
}

// 默认允许上传的文件类型
const DEFAULT_ACCEPTED_MIME_TYPE = 'video/avi,.avi,.f4v,video/mpeg,.mpg,video/mp4,.mp4,video/x-flv,.flv,video/x-ms-wmv,.wmv,video/quicktime,.mov,video/3gpp,.3gp,.rmvb,video/x-matroska,.mkv,.asf,.264,.ts,.mts,.dat,.vob,audio/mpeg,.mp3,audio/x-wav,.wav,video/x-m4v,.m4v,video/webm,.webm,.mod';
function _isContainFileMimeType(file, acceptedMimeType) {
  const acceptedList = acceptedMimeType.split(',');
  return acceptedList.indexOf(file.type) > -1 || acceptedList.indexOf(file.name.replace(/.+(\..+)$/, '$1')) > -1;
}

/**
 * 上传文件的文件类型是否在允许范围内
 * @param {File} file
 * @param {String} extraAcceptedMimeType 用户自定义的允许上传的文件类型，使用英文逗号分隔
 * @returns {Boolean}
 */
export function isContainFileMimeType(file, extraAcceptedMimeType) {
  const isContainDefaultFileMimeType = _isContainFileMimeType(file, DEFAULT_ACCEPTED_MIME_TYPE);
  // 无论用户是否自定义了上传文件类型，都应该首先符合点播后台要求的上传文件类型
  const isContainExtraFileMimeType = extraAcceptedMimeType ? _isContainFileMimeType(file, extraAcceptedMimeType) : true;
  return isContainDefaultFileMimeType && isContainExtraFileMimeType;
}
