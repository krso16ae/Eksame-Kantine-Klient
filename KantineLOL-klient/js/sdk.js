const SDK = {
  serverURL: "http://localhost:8080/api",
  request: (options, cb) => {

   let headers = {};
    if (options.headers) {
      Object.keys(options.headers).forEach((h) => {
        headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
      });
    }

    $.ajax({
      url: SDK.serverURL + options.url,
      method: options.method,
      headers: headers,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(options.data),
      success: (data, status, xhr) => {
        cb(null, data, status, xhr);
      },
      error: (xhr, status, errorThrown) => {
        cb({xhr: xhr, status: status, error: errorThrown});
      }
    });

  },
  Product: {

      addToBasket: (product) => {
          let basket = SDK.Storage.load("basket");

          //Er noget blivet tilføjet til kurven før?
          if (!basket) {
              return SDK.Storage.persist("basket", [{
                  count: 1,
                  product: product
              }]);
          }

          //Sørger for at tælle op i vare antal
          let foundProduct = basket.find(p => p.product.productId === product.productId);
          if (foundProduct) {
              let i = basket.indexOf(foundProduct);
              basket[i].count++;
          } else {
              basket.push({
                  count: 1,
                  product: product
              });
          }

          SDK.Storage.persist("basket", basket);
      },

      create: (data, cb) => {
          SDK.request({
              method: "POST",
              url: "/user/create",
              data: data,
              headers: {authorization: 'tokenuser'+ SDK.Storage.load("usertoken")}
          }, cb);
      },

      getAllFoods: (cb) => {
          SDK.request({
              method: "GET",
              url: "/food",
          }, (err, food) => {
              if (err) return cb(err);
              console.log(2, food);
              cb(null, food)

          }, cb);
          },


      getAllDrinks: (cb) => {
          SDK.request({
              method: "GET",
              url: "/drink",

          }, (err, drink) => {
              if (err) return cb(err);
              console.log(1, drink);
              cb(null, drink)

          }, cb);
      },
  },
  Order: {
      //opretter en order ud fra userendpoint i severen
    orderRequest: (data, cb) => {
      SDK.request({
        method: "POST",
        url: "/users/order",
        data: data,
        headers: {authorization: SDK.Storage.load("usertoken")}
      }, cb);
    },
    findMine: (cb) => {
      SDK.request({
        method: "GET",
        url: "/users/order" + SDK.User.current().id + "/history",
        headers: {
          authorization: SDK.Storage.load("usertoken")
        }
      }, cb);
    }
  },
  User: {
      current: () => {
          return SDK.Storage.load("users");
      },
      logOut: () => {
          SDK.Storage.remove("usertoken");
          SDK.Storage.remove("userId");
          SDK.Storage.remove("user");
          window.location.href = "login.html";
      },
      login: (username, password, cb) => {
          SDK.request({
              data: {
                  username: username,
                  password: password
              },
              url: "/users/login",
              method: "POST"
          }, (err, data) => {

              //hvis der sker login-error
              if (err) return cb(err);
              SDK.Storage.persist("usertoken", data.token);
              SDK.Storage.persist("userId", data.userId);
              SDK.Storage.persist("user", data.user);

              cb(null, data);

          });
      },
      create: (username, password, cb) => {
          SDK.request({
              data: {
                  username: username,
                  password: password
              },
              url: "/users/create",
              method: "POST"
          }, (err, data) => {

              //On login-error
              if (err) return cb(err);
              cb(null, data);

          });
      },


      current: () => {
          return {
              id: SDK.Storage.load("id"),
              name: SDK.Storage.load("username"),
              token: SDK.Storage.load("usertoken"),
          }
      },


      loadNav: (cb) => {
          $("#nav-container").load("nav.html", () => {
              const currentUser = SDK.User.current();
              if (currentUser) {
                  $(".navbar-right").html(`
            <li><a href="home-page.html">Dine bestillinger</a></li>
            <li><a href="#" id="logout-link">Logout</a></li>
          `);
              } else {
                  $(".navbar-right").html(`
            <li><a href="login.html">Log-in <span class="sr-only">(current)</span></a></li>
          `);
              }
              $("#logout-link").click(() => SDK.User.logOut());
              cb && cb();
          });
      },

  },

  Storage: {
    prefix: "CBS--KantineApp",
    persist: (key, value) => {
      window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
    },
    load: (key) => {
      const val = window.localStorage.getItem(SDK.Storage.prefix + key);
      try {
        return JSON.parse(val);
      }
      catch (e) {
        return val;
      }
    },
    remove: (key) => {
      window.localStorage.removeItem(SDK.Storage.prefix + key);
    }
/*
      Encryption: {
          encryptDecrypt(input) {
              var ifEncrypted = true;
              if (input != null && input != "") {
                  if (ifEncrypted) {
                      var key = ['L', 'O', 'L'];
                      var output = [];

                      for (var i = 0; i < input.length; i++) {
                          var charCode = input.charCodeAt(i) ^ key[i % key.length].charCodeAt(0);
                          output.push(String.fromCharCode(charCode));
                      }

                      return output.join("");
                  }
                  else {
                      return input;
                  }
              }
              else {
                  return input;
              }
          }
      } */
  }
};

