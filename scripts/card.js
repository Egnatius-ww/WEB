(function () {
  var main = document.getElementById("card-gallery-main");
  var thumbs = Array.prototype.slice.call(document.querySelectorAll(".card-page__thumb"));
  var prevBtn = document.getElementById("card-gallery-prev");
  var nextBtn = document.getElementById("card-gallery-next");
  var qtyInput = document.getElementById("card-qty");
  var qtyDec = document.getElementById("card-qty-decrease");
  var qtyInc = document.getElementById("card-qty-increase");

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

  if (main && thumbs.length) {
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
  }

  function readQty() {
    return Math.max(1, parseInt(qtyInput.value, 10) || 1);
  }

  if (qtyInput) {
    qtyInput.addEventListener("change", function () {
      qtyInput.value = String(readQty());
    });
  }

  if (qtyDec && qtyInput) {
    qtyDec.addEventListener("click", function () {
      qtyInput.value = String(Math.max(1, readQty() - 1));
    });
  }
  if (qtyInc && qtyInput) {
    qtyInc.addEventListener("click", function () {
      qtyInput.value = String(readQty() + 1);
    });
  }
})();
