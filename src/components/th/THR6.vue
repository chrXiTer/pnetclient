<template>
  <div>
    <iframe id="external-frame" src="http://10.145.0.8:8000/env/1a5/infra/registries" width="100%" height="800px"></iframe>
  </div>
</template>

<script>
export default {
}
/*
function setIframeHeight(iframe) {
  if (iframe) {
    var iframeWin = iframe.contentWindow
    if (iframeWin.document.body) {
      iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
    }
  }
};

export default {
  mounted: function () {
    setIframeHeight(document.getElementById('external-frame'));
  }
}
*/
</script>
