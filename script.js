document.addEventListener('DOMContentLoaded', function() {
  const query = URI(location.href).search(true);
  const url = query.url;
  if (url) {
    const name = query.name || URI(url).path().split('/').pop();
    const extension = name.split('.').pop();
    document.title = name;

    if (extension) {
      if (extension == 'pdf') {
        loadPdf(url);
      } else if (['jpg', 'jpeg', 'png', 'gif', 'ico', 'bmp'].indexOf(extension) >= 0) {
        loadImage(url);
      } else if (['mp4', 'mpeg4', 'ogv', '3gp', 'webm', 'mkv', 'avi'].indexOf(extension) >= 0) {
        loadVideo(url);
      } else if (['mp3', 'flac', 'wav'].indexOf(extension) >= 0) {
        loadAudio(url);
      } else if (['ppt', 'pptx', 'doc', 'docx', 'dotx', 'xls', 'xlsx', 'xltx'].indexOf(extension) >= 0) {
        loadMsOffice(url);
      } else if (['ods', 'sxc', 'csv', 'tsv'].indexOf(extension) >= 0) {
        loadZohoSheet(url, name);
      } else {
        loadGoogleDocs(url);
      }
    } else {
      loadGoogleDocs(url);
    }
  } else {
    document.body.style.background = '#FFF';
    document.body.innerHTML = '<br>Usage: <code>https://febalist.github.io/viewer/?url={URL}&name={FILENAME}</code>';
  }
});

function loadPdf(url) {
  redirect('https://mozilla.github.io/pdf.js/web/viewer.html?file=' + encodeURIComponent(url));
}

function loadImage(url) {
  $(function() {
    const viewer = new ImageViewer();
    viewer.show(url);
    const image = document.getElementsByClassName('iv-large-image')[0];
    elementAddEventListeners(image, url, 'load');
  });
}

function loadVideo(url) {
  document.body.innerHTML = '<video preload controls playsinline src="' + url + '"></video>';
  const video = document.getElementsByTagName('video')[0];
  const player = new Plyr(video);
  elementAddEventListeners(video, url, 'canplay');
}

function loadAudio(url) {
  document.body.innerHTML = '<audio preload controls src="' + url + '">Haru</audio>';
  const audio = document.getElementsByTagName('audio')[0];
  const player = new Plyr(audio);
  elementAddEventListeners(audio, url, 'canplay');
}

function elementAddEventListeners(element, url, success_type) {
  element.addEventListener(success_type, function() {
    document.body.style.background = '#4c4c4c';
  });
  element.addEventListener('error', function() {
    document.body.innerHTML = '';
    loadGoogleDocs(url);
  });
}

function loadGoogleDocs(url) {
  if (inIframe()) {
    redirect('https://docs.google.com/viewer?embedded=true&url=' + encodeURIComponent(url));
  } else {
    redirect('https://docs.google.com/viewer?url=' + encodeURIComponent(url));
  }
}

function loadMsOffice(url) {
  if (inIframe()) {
    redirect('https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(url));
  } else {
    redirect('https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(url));
  }
}

function loadZohoSheet(url, name) {
  redirect('https://sheet.zoho.com/sheet/view.do?&name=' + encodeURIComponent(name) + '&url=' + encodeURIComponent(url));
}

function loadFrame(url) {
  const reloadFrame = function() {
    document.getElementsByTagName('iframe')[0].src = url;
  };

  const interval = setInterval(reloadFrame, loadingTimeout());

  const iframe = document.createElement('iframe');
  document.body.appendChild(iframe);

  iframe.addEventListener('load', function() {
    clearInterval(interval);
  });

  reloadFrame();
}

function redirect(url) {
  location.href = url;
  setTimeout(function() {
    redirect(url);
  }, loadingTimeout());
}

function loadingTimeout() {
  let timeout = 2000;
  if (window.performance && window.performance.timing) {
    const loadDuration = Date.now() - window.performance.timing.requestStart;
    timeout = Math.max(timeout, loadDuration * 2);
  }
  return timeout;
}

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
