function youtube_present() {
  for (var e = document.getElementsByTagName('iframe'), x = e.length; x--;)
    if (/youtube.com\/embed/.test(e[x].src)) {
      return true;
    }
  return false;
}
utag.data['youtube_present'] = youtube_present();