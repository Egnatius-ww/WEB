(function () {
  var main = document.getElementById("card-gallery-main");
  var thumbs = Array.prototype.slice.call(document.querySelectorAll(".card-page__thumb"));
  var prevBtn = document.getElementById("card-gallery-prev");
  var nextBtn = document.getElementById("card-gallery-next");
  if (!main || !thumbs.length) return;

  function getActiveIndex() {
    for (var i = 0; i < thumbs.length; i++) {
      if (thumbs[i].classList.contains("is-active")) {
        return i;
      }
    }
    return 0;
  }

  function activateAt(index) {
    var n = thumbs.length;
    if (!n) return;
    var i = ((index % n) + n) % n;
    var btn = thumbs[i];
    var src = btn.getAttribute("data-full-src");
    if (src) main.src = src;
    thumbs.forEach(function (t, j) {
      var on = j === i;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  thumbs.forEach(function (btn, j) {
    btn.addEventListener("click", function () {
      activateAt(j);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      activateAt(getActiveIndex() - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      activateAt(getActiveIndex() + 1);
    });
  }
})();
