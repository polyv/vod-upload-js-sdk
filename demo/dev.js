import PlvVideoUpload from '../src/index';
const $ = window.jQuery;
const getPolyvAuthorization = '/getToken';

function fileDom(uploader) {
  return `<tr data-id="${uploader.id}">
    <td>${uploader.fileData.title}</td>
    <td>${uploader.id}</td>
    <td>${uploader.fileData.size}</td>
    <td>
      <div class="progress-wrap"><div class="progress"></div></div>
      <input type="button" value="开始" class="js-fileStart" />
      <input type="button" value="暂停" class="js-filePause" />
      <input type="button" value="删除" class="js-fileDelete" />
    </td>
  </tr>`;
}

function getUserData(videoUpload) {
  $.ajax({
    url: getPolyvAuthorization
  }).done(data => {
    videoUpload.updateUserData({
      userid: data.userid,
      ptime: data.ts,
      sign: data.sign,
      hash: data.hash
    });
  });
}

// 由于sign等用户信息有效期为3分钟，需要每隔3分钟更新一次
function autoUpdateUserData(timer, videoUpload) {
  getUserData(videoUpload);
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  timer = setTimeout(() => {
    autoUpdateUserData(timer, videoUpload);
  }, 3 * 50 * 1000);
}

const $uploadList = $('#uploadList');
const videoUpload = new PlvVideoUpload({
  parallelFileLimit: 5,
  events: {
    UploadComplete: onUploadComplete,
    Error: onError
  }
});
autoUpdateUserData(null, videoUpload);


// 事件回调
function onUploadComplete() {
  $('#progress').text('上传结束！');
  // 获取上传文件列表
  console.info('上传结束：', videoUpload.files);
}

function onError(err) {
  console.info(err);
  if (err.code) {
    // 110：文件重复，111：拦截文件类型不在acceptedMimeType中的文件，102：用户剩余空间不足
    let errMag = `（错误代码：${err.code}）${err.message}`;
    if (err.code === 110 || err.code === 111) {
      errMag += ` ${err.data.filename}`;
    }
    alert(errMag);
  } else {
    console.info(err);
  }
}

function onFileStarted({ uploaderid, fileData }) {
  console.info('开始上传', uploaderid, fileData);
  $uploadList.find(`[data-id=${uploaderid}] .progress`).text('0.00%');
}

function onFileProgress({ uploaderid, progress }) {
  const p = (progress * 100).toFixed(2);
  $uploadList.find(`[data-id=${uploaderid}] .progress`).css('min-width', `${p}%`).text(`${p}%`);
}

function onFileSucceed({ uploaderid, fileData }) {
  console.info(fileData);
  $uploadList.find(`[data-id=${uploaderid}] .progress`).css('min-width', '100%').text('上传完成');
}

function onFileFailed({ uploaderid }) {
  $uploadList.find(`[data-id=${uploaderid}] .progress`).text('上传失败');
}

function onFileStopped({ uploaderid }) {
  console.info('暂停上传 ' + uploaderid);
  console.info(videoUpload);
}

// 添加文件到上传列表
$('#select').on('change', (e) => {
  const files = e.target.files;
  if (!files || files.length <= 0) {
    return;
  }

  $('#progress').text('');

  $.makeArray(files).forEach((file) => {
    const fileSetting = {
      desc: 'demo中设置的描述',
      cataid: 1,
      tag: 'demo中设置的标签',
      luping: 0,
      keepsource: 0,
      title: '',
      state: 'test'
    };

    // 添加文件到上传列表
    const uploader = videoUpload.addFile(file, {
      FileStarted: onFileStarted,
      FileProgress: onFileProgress,
      FileSucceed: onFileSucceed,
      FileFailed: onFileFailed,
      FileStopped: onFileStopped,
    }, fileSetting);
    if (!uploader) {
      return;
    }

    const uploaderid = uploader.id;
    console.info(uploader);
    const $fileDom = $(fileDom(uploader));

    // 开始/恢复上传文件
    $fileDom.find('.js-fileStart').on('click', function() {
      videoUpload.resumeFile(uploaderid);
    });
    // 暂停上传文件
    $fileDom.find('.js-filePause').on('click', function() {
      videoUpload.stopFile(uploaderid);
    });
    // 删除文件
    $fileDom.find('.js-fileDelete').on('click', function() {
      videoUpload.removeFile(uploaderid);
      $fileDom.remove();
    });
    $uploadList.append($fileDom);
  });
});

// 开始/恢复上传所有文件
$('#start').on('click', function() {
  if (videoUpload) {
    videoUpload.startAll();
  }
});

// 暂停上传所有文件
$('#pause').on('click', function() {
  if (videoUpload) {
    videoUpload.stopAll();
  }
});

// 清除所有文件
$('#clear').on('click', function() {
  if (videoUpload) {
    videoUpload.clearAll();
  }
  document.getElementById('select').value = '';
  $uploadList.html('');
});

$('#update').on('click', function() {
  const fileSetting = {
    title: $('#title').val(),
  };
  console.info(fileSetting);
  videoUpload.updateFileData($('#uploaderid').val(), fileSetting);
});
