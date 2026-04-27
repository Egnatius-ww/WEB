(function () {
  var KEY = "buildmartCart";
  var LEGACY = "buildmartCartHasItems";

  function readRaw() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return [];
      var data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function write(lines) {
    window.localStorage.setItem(KEY, JSON.stringify(lines));
    if (lines.length === 0) {
      window.localStorage.removeItem(LEGACY);
    }
    try {
      window.dispatchEvent(new CustomEvent("buildmart-cart-changed"));
    } catch (err) {
      /* ignore */
    }
  }

  function migrateLegacy() {
    if (window.localStorage.getItem(LEGACY) === "1" && readRaw().length === 0) {
      window.localStorage.removeItem(LEGACY);
    }
  }

  function read() {
    migrateLegacy();
    return readRaw();
  }

  function add(id, qty) {
    if (!id) return;
    var q = Math.max(1, parseInt(qty, 10) || 1);
    var lines = readRaw();
    var i;
    for (i = 0; i < lines.length; i++) {
      if (lines[i].id === id) {
        lines[i].qty = Math.max(1, (parseInt(lines[i].qty, 10) || 0) + q);
        write(lines);
        return;
      }
    }
    lines.push({ id: id, qty: q });
    write(lines);
  }

  function setQty(id, qty) {
    var q = Math.max(1, parseInt(qty, 10) || 1);
    var lines = readRaw();
    var i;
    for (i = 0; i < lines.length; i++) {
      if (lines[i].id === id) {
        lines[i].qty = q;
        write(lines);
        return;
      }
    }
  }

  function remove(id) {
    var lines = readRaw().filter(function (line) {
      return line.id !== id;
    });
    write(lines);
  }

  window.BuildmartCart = {
    read: read,
    add: add,
    setQty: setQty,
    remove: remove,
    clear: function () {
      write([]);
    },
    countLines: function () {
      return read().length;
    },
    countItems: function () {
      return read().reduce(function (sum, line) {
        return sum + (parseInt(line.qty, 10) || 0);
      }, 0);
    },
  };
})();
