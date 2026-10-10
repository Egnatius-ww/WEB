(function () {
  // Состояние сессии поверх JWT из api.js: current user + merge гостевой корзины при входе.
  var USER_KEY = "buildmartUser";

  function readUser() {
    try {
      var raw = window.localStorage.getItem(USER_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      return data && data.id && data.email ? data : null;
    } catch (e) {
      return null;
    }
  }

  function writeUser(user) {
    try {
      if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
      else window.localStorage.removeItem(USER_KEY);
    } catch (e) {}
  }

  function emitChanged() {
    try {
      window.dispatchEvent(new CustomEvent("buildmart-auth-changed"));
    } catch (e) {}
  }

  function applySession(data) {
    window.BuildmartApi.setToken(data.token);
    writeUser(data.user);
  }

  // После входа локальная корзина гостя переливается в серверную
  function mergeLocalCartIntoServer() {
    var cart = window.BuildmartCart;
    var api = window.BuildmartApi;
    if (!cart || !api) return Promise.resolve();
    var lines = cart.read();
    if (!lines.length) return Promise.resolve();
    var promises = lines
      .filter(function (line) {
        return /^\d+$/.test(String(line.id));
      })
      .map(function (line) {
        return api.addCartItem(Number(line.id), line.qty).catch(function () {
          /* товар мог быть удалён — пропускаем */
        });
      });
    return Promise.all(promises).then(function () {
      cart.clear();
    });
  }

  window.BuildmartAuth = {
    currentUser: function () {
      return window.BuildmartApi.getToken() ? readUser() : null;
    },
    isAdmin: function () {
      var user = window.BuildmartAuth.currentUser();
      return !!user && user.role === "admin";
    },
    register: function (email, password) {
      return window.BuildmartApi.register(email, password).then(function (data) {
        applySession(data);
        return mergeLocalCartIntoServer().then(function () {
          emitChanged();
          return data.user;
        });
      });
    },
    login: function (email, password) {
      return window.BuildmartApi.login(email, password).then(function (data) {
        applySession(data);
        return mergeLocalCartIntoServer().then(function () {
          emitChanged();
          return data.user;
        });
      });
    },
    logout: function () {
      window.BuildmartApi.setToken("");
      writeUser(null);
      emitChanged();
    },
  };
})();
