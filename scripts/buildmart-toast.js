(function () {
  var HIDE_MS = 3200;
  var TRANS_OUT_MS = 280;
  var MAX_VISIBLE = 5;
  var PEEK_PX = 10;
  var SWIPE_THRESHOLD = 44;

  function toastInnerHtml() {
    return (
      '<div class="buildmart-toast__inner">' +
      '<span class="buildmart-toast__icon" aria-hidden="true">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="11" fill="#0a0a0a" />' +
      '<path d="M8 12.5l2.2 2.2L16 9" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />' +
      "</svg></span>" +
      '<p class="buildmart-toast__text"></p>' +
      "</div>"
    );
  }

  function ensureStack() {
    var el = document.getElementById("buildmart-toast-stack");
    if (el) return el;
    el = document.createElement("div");
    el.id = "buildmart-toast-stack";
    el.className = "buildmart-toast-stack";
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-relevant", "additions text");
    document.body.appendChild(el);
    return el;
  }

  function updateStackOverlap() {
    var stack = document.getElementById("buildmart-toast-stack");
    if (!stack) return;
    var firstInner = stack.querySelector(".buildmart-toast-item:first-child .buildmart-toast__inner");
    if (!firstInner) {
      stack.style.removeProperty("--buildmart-toast-overlap");
      return;
    }
    var h = firstInner.offsetHeight;
    if (!h) return;
    var overlap = Math.max(40, h - PEEK_PX);
    stack.style.setProperty("--buildmart-toast-overlap", overlap + "px");
  }

  function clearAutoHide(item) {
    if (item._buildmartToastHideT) {
      window.clearTimeout(item._buildmartToastHideT);
      item._buildmartToastHideT = null;
    }
  }

  function scheduleAutoHide(item) {
    clearAutoHide(item);
    item._buildmartToastHideT = window.setTimeout(function () {
      item._buildmartToastHideT = null;
      removeItem(item);
    }, HIDE_MS);
  }

  function removeItem(item) {
    if (!item || !item.parentNode) return;
    if (item._buildmartSwipeAc) {
      item._buildmartSwipeAc.abort();
      item._buildmartSwipeAc = null;
    }
    clearAutoHide(item);
    if (item.classList.contains("buildmart-toast-item--out")) return;
    item.classList.remove("buildmart-toast-item--in");
    item.classList.add("buildmart-toast-item--out");
    window.setTimeout(function () {
      if (item.parentNode) item.parentNode.removeChild(item);
      updateStackOverlap();
    }, TRANS_OUT_MS);
  }

  function bindSwipeDismiss(item) {
    var inner = item.querySelector(".buildmart-toast__inner");
    if (!inner) return;

    var startY = 0;
    var startX = 0;
    var active = false;
    var captured = false;

    function resetInner(animate) {
      item.classList.remove("buildmart-toast-item--dragging");
      if (animate) {
        inner.style.transition = "transform 0.2s ease, opacity 0.2s ease";
        inner.style.transform = "translateY(0)";
        inner.style.opacity = "1";
        window.setTimeout(function () {
          inner.style.transition = "";
          inner.style.transform = "";
          inner.style.opacity = "";
          inner.style.removeProperty("will-change");
        }, 220);
      } else {
        inner.style.transition = "";
        inner.style.transform = "";
        inner.style.opacity = "";
        inner.style.removeProperty("will-change");
      }
    }

    function point(e) {
      if (e.touches && e.touches[0]) return e.touches[0];
      if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0];
      return e;
    }

    function onStart(e) {
      if (!item.classList.contains("buildmart-toast-item--in")) return;
      if (e.isPrimary === false) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      var p = point(e);
      startY = p.clientY;
      startX = p.clientX;
      active = true;
      item.classList.add("buildmart-toast-item--dragging");
      if (e.pointerId != null && item.setPointerCapture) {
        try {
          item.setPointerCapture(e.pointerId);
          captured = true;
        } catch (err) {
          captured = false;
        }
      }
    }

    function onMove(e) {
      if (!active) return;
      var p = point(e);
      var dy = p.clientY - startY;
      var dx = p.clientX - startX;
      if (Math.abs(dy) > Math.abs(dx) && dy < -4) {
        inner.style.willChange = "transform, opacity";
        inner.style.transition = "none";
        inner.style.transform = "translateY(" + dy + "px)";
        var o = 1 + dy / 220;
        inner.style.opacity = o < 0.35 ? "0.35" : String(Math.min(1, o));
        if (e.cancelable) e.preventDefault();
      }
    }

    function onEnd(e) {
      if (!active) return;
      active = false;
      var p = point(e);
      var dy = p.clientY - startY;
      if (captured && e.pointerId != null && item.releasePointerCapture) {
        try {
          item.releasePointerCapture(e.pointerId);
        } catch (err2) {}
        captured = false;
      }
      inner.style.opacity = "";
      if (dy < -SWIPE_THRESHOLD) {
        inner.style.transition = "";
        inner.style.transform = "";
        inner.style.opacity = "";
        inner.style.removeProperty("will-change");
        clearAutoHide(item);
        removeItem(item);
        return;
      }
      resetInner(true);
    }

    var ac = new AbortController();
    item._buildmartSwipeAc = ac;
    var sig = { signal: ac.signal };

    if (window.PointerEvent) {
      item.addEventListener("pointerdown", onStart, sig);
      item.addEventListener("pointermove", onMove, Object.assign({ passive: false }, sig));
      item.addEventListener("pointerup", onEnd, sig);
      item.addEventListener("pointercancel", onEnd, sig);
    } else {
      item.addEventListener(
        "touchstart",
        function (e) {
          onStart(e);
        },
        Object.assign({ passive: true }, sig)
      );
      item.addEventListener(
        "touchmove",
        function (e) {
          onMove(e);
        },
        Object.assign({ passive: false }, sig)
      );
      item.addEventListener(
        "touchend",
        function (e) {
          onEnd(e);
        },
        Object.assign({ passive: true }, sig)
      );
      item.addEventListener(
        "touchcancel",
        function (e) {
          onEnd(e);
        },
        Object.assign({ passive: true }, sig)
      );
    }
  }

  window.showBuildmartToast = function (message) {
    var text = typeof message === "string" ? message.trim() : "";
    if (!text) return;

    var stack = ensureStack();

    while (stack.children.length >= MAX_VISIBLE) {
      var last = stack.lastElementChild;
      if (last) stack.removeChild(last);
    }

    var item = document.createElement("div");
    item.className = "buildmart-toast-item";
    item.setAttribute("role", "status");
    item.innerHTML = toastInnerHtml();
    var textEl = item.querySelector(".buildmart-toast__text");
    if (textEl) textEl.textContent = text;

    stack.insertBefore(item, stack.firstChild);
    updateStackOverlap();
    bindSwipeDismiss(item);

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        item.classList.add("buildmart-toast-item--in");
        updateStackOverlap();
      });
    });

    scheduleAutoHide(item);
  };

  var resizeOverlapTimer;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeOverlapTimer);
    resizeOverlapTimer = window.setTimeout(updateStackOverlap, 120);
  });
})();
