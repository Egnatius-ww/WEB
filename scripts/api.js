(function () {
  // Базовый URL API: по умолчанию локальный бэкенд, можно переопределить
  // через localStorage ("buildmartApiBase") или глобальную переменную до подключения скрипта.
  var DEFAULT_BASE = "http://localhost:3000";
  var TOKEN_KEY = "buildmartApiToken";

  function baseUrl() {
    if (window.BUILDMART_API_BASE) return String(window.BUILDMART_API_BASE).replace(/\/+$/, "");
    try {
      var stored = window.localStorage.getItem("buildmartApiBase");
      if (stored) return String(stored).replace(/\/+$/, "");
    } catch (e) {}
    return DEFAULT_BASE;
  }

  function readToken() {
    try {
      return window.localStorage.getItem(TOKEN_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function writeToken(token) {
    try {
      if (token) window.localStorage.setItem(TOKEN_KEY, token);
      else window.localStorage.removeItem(TOKEN_KEY);
    } catch (e) {}
  }

  function ApiError(status, message, details) {
    this.name = "BuildmartApiError";
    this.status = status;
    this.message = message;
    this.details = details;
  }
  ApiError.prototype = Object.create(Error.prototype);

  function request(path, options) {
    options = options || {};
    var headers = { Accept: "application/json" };
    if (options.body !== undefined) headers["Content-Type"] = "application/json";
    var token = options.token !== undefined ? options.token : readToken();
    if (token) headers["Authorization"] = "Bearer " + token;

    return fetch(baseUrl() + path, {
      method: options.method || "GET",
      headers: headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    }).then(function (res) {
      return res
        .json()
        .catch(function () {
          return null;
        })
        .then(function (data) {
          if (!res.ok) {
            throw new ApiError(
              res.status,
              (data && data.message) || "Request failed (" + res.status + ")",
              data && data.details
            );
          }
          return data;
        });
    });
  }

  function buildQuery(params) {
    var search = new URLSearchParams();
    Object.keys(params || {}).forEach(function (key) {
      var v = params[key];
      if (v === undefined || v === null || v === "") return;
      search.set(key, String(v));
    });
    var s = search.toString();
    return s ? "?" + s : "";
  }

  window.BuildmartApi = {
    ApiError: ApiError,
    baseUrl: baseUrl,
    getToken: readToken,
    setToken: writeToken,
    request: request,

    // Auth
    register: function (email, password) {
      return request("/api/auth/register", { method: "POST", body: { email: email, password: password } });
    },
    login: function (email, password) {
      return request("/api/auth/login", { method: "POST", body: { email: email, password: password } });
    },

    // Products
    getProducts: function (params) {
      return request("/api/products" + buildQuery(params));
    },
    getProduct: function (id) {
      return request("/api/products/" + encodeURIComponent(id));
    },
    createProduct: function (data) {
      return request("/api/products", { method: "POST", body: data });
    },
    updateProduct: function (id, data) {
      return request("/api/products/" + encodeURIComponent(id), { method: "PATCH", body: data });
    },
    deleteProduct: function (id) {
      return request("/api/products/" + encodeURIComponent(id), { method: "DELETE" });
    },

    // Cart
    getCart: function () {
      return request("/api/cart");
    },
    addCartItem: function (productId, qty) {
      return request("/api/cart/items", { method: "POST", body: { product_id: productId, qty: qty || 1 } });
    },
    updateCartItem: function (itemId, qty) {
      return request("/api/cart/items/" + encodeURIComponent(itemId), { method: "PATCH", body: { qty: qty } });
    },
    removeCartItem: function (itemId) {
      return request("/api/cart/items/" + encodeURIComponent(itemId), { method: "DELETE" });
    },
    clearCart: function () {
      return request("/api/cart", { method: "DELETE" });
    },
    applyPromo: function (code) {
      return request("/api/cart/apply-promo", { method: "POST", body: { code: code } });
    },
  };
})();
