function toLocalStorage() {
  if (!localStorage.currentUser) {
    const currentUser = {
      userName: undefined,
      token: undefined,
    };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }
}

///
class TweetFeedApiService {
  constructor(url) {
    this.url = url;
  }

  getTweets(skip = 0, top = 10, filterConfig = {}) {
    fetch(
      this.filters(`${this.url}/tweet?from=${skip}&count=${top}`, filterConfig)
    )
      .then((response) => response.json())
      .then((arrayOfTweets) => {
        let key = 1;
        if (arrayOfTweets.length < top) {
          key = 0;
        }

        tweetsController.getFeed(
          skip,
          top,
          filterConfig,
          arrayOfTweets.slice(skip, top),
          JSON.parse(localStorage.getItem("currentUser")).userName,
          key
        );
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  login(name, password) {
    let reqBody = {
      login: name,
      password: password,
    };

    let requestOptions = {
      method: "POST",
      body: JSON.stringify(reqBody),
      redirect: "follow",
      headers: new Headers({
        accept: "application/json",
        "Content-Type": "application/json",
      }),
    };

    fetch(`${this.url}/login`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error(response.status);
        }
      })
      .then((response) => {
        const currentUser = {
          userName: name,
          token: response.token,
        };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        this.token = JSON.parse(localStorage.getItem("currentUser")).token;

        tweetsController.setCurrentUser(
          JSON.parse(localStorage.getItem("currentUser")).userName
        );
        this.getTweets();
      })
      .catch((error) => {
        if (error.message === "403") {
          alert(`Неверный логин или пароль!`);
        } else {
          tweetsController.showError(`${error.message}`);
        }
      });
  }

  registration(name, password) {
    let reqBody = {
      login: name,
      password: password,
    };

    let requestOptions = {
      method: "POST",
      body: JSON.stringify(reqBody),
      redirect: "follow",
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
    };

    fetch(`${this.url}/registration`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error(response.status);
        }
      })
      .then((response) => {
        alert("Вы успешно зарегистрировались и вошли!");

        this.login(name, password);
      })
      .catch((error) => {
        if (error.message === "409") {
          alert(`Такой пользователь уже существует!`);
        } else {
          tweetsController.showError(`${error.message}`);
        }
      });
  }

  logOut() {
    const currentUser = {
      userName: undefined,
      token: undefined,
    };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    tweetsController.setCurrentUser(
      JSON.parse(localStorage.getItem("currentUser")).userName
    );
    this.getTweets();
  }

  getTweetById(id, skip = 0, top = 10, filterConfig) {
    fetch(
      this.filters(`${this.url}/tweet?from=${skip}&count=${top}`, filterConfig)
    )
      .then((response) => response.json())
      .then((response) => {
        let currentTweet = response.find((tweet) => tweet.id === id);
        tweetsController.showTweet(currentTweet, top, filterConfig);
      })
      .catch((error) => {});
  }

  shareTweet(text) {
    let reqBody = {
      text: text,
    };

    let requestOptions = {
      method: "POST",

      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("currentUser")).token
        }`,
      }),

      body: JSON.stringify(reqBody),

      redirect: "follow",
    };

    fetch(`${this.url}/tweet`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error(response.status);
        }
      })
      .then((response) => {
        this.getTweets();
      })
      .catch((error) => {
        tweetsController.showError(error.message);
      });
  }

  editTweet(id, text) {
    let reqBody = {
      text: text,
    };

    let requestOptions = {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("currentUser")).token
        }`,
      }),

      body: JSON.stringify(reqBody),

      redirect: "follow",
    };

    fetch(`${this.url}/tweet/{${id}}`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.ok;
        }
      })
      .then((response) => {
        this.getTweets();
      })
      .catch((error) => {
        tweetsController.showError(error.message);
      });
  }

  removeTweet(id) {
    let requestOptions = {
      method: "DELETE",

      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("currentUser")).token
        }`,
      }),

      redirect: "follow",
    };

    fetch(`${this.url}/tweet/{${id}}`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.ok;
        } else {
          throw Error(response.status);
        }
      })
      .then((response) => {
        this.getTweets();
      })
      .catch((error) => {
        tweetsController.showError(error.message);
      });
  }

  addComment(id, text, top, filterConfig) {
    let reqBody = {
      text: text,
    };

    let requestOptions = {
      method: "POST",

      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("currentUser")).token
        }`,
      }),

      body: JSON.stringify(reqBody),

      redirect: "follow",
    };

    fetch(`${this.url}/tweet/{${id}}/comment`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.ok;
        } else {
          throw Error(response.status);
        }
      })
      .then((response) => {
        this.getTweetById(id, top, filterConfig);
      })
      .catch((error) => {
        tweetsController.showError(error.message);
      });
  }

  filters(url, filters) {
    if (filters) {
      if (filters.author) {
        url += `&author=${filters.author}`;
      }
      if (filters.text) {
        url += `&text=${filters.text}`;
      }
      if (filters.dateFrom) {
        url += `&dateFrom=${filters.dateFrom}`;
      }
      if (filters.dateTo) {
        url += `&dateTo=${filters.dateTo}`;
      }
      if (filters.hashtags) {
        url += `&hashtags=${filters.hashtags}`;
      }
      return url;
    } else {
      return url;
    }
  }
}

class TweetsController {
  constructor() {
    this._tweetFeedView = new TweetFeedView("mainPage");
    this._headerView = new HeaderView("username");
    this._tweetView = new TweetView("mainPage");
    this._filterView = new FilterView("mainPage");
    this._logInView = new LogInView("mainPage");
    this._errorView = new ErrorView("mainPage");
    this._regestrationView = new RegestrationView("mainPage");
  }

  setCurrentUser(user = undefined) {
    if (user !== undefined && user.trim === "") {
      return false;
    }
    if (user !== undefined) {
      this._headerView.display(user, user);
    } else {
      this._headerView.display("Guest", user);
    }
    return true;
  }

  addTweet(text) {
    tweetFeedApiService.shareTweet(text);
    return true;
  }

  editTweet(id, text) {
    tweetFeedApiService.editTweet(id, text);
  }

  removeTweet(id) {
    tweetFeedApiService.removeTweet(id);
  }

  addComments(id, text) {
    tweetFeedApiService.addComment(id, text);
  }

  getFeed(
    skip = 0,
    top = 10,
    filterConfig = {},
    arrayOfTweets,
    onlyView,
    arrayOfTweetsLength
  ) {
    this._tweetFeedView.display(arrayOfTweets, onlyView, arrayOfTweetsLength);

    document
      .getElementById("tweetsField")
      .addEventListener("click", function (event) {
        let currentTarget = event.target;
        if (currentTarget.closest(".edit-button")) {
          let text = prompt(
            "Введите изменения!",
            `${currentTarget
              .closest(".tweet")
              .querySelector(".text")
              .innerHTML.split()}`
          );

          tweetsController.editTweet(
            `${currentTarget.closest(".tweet").dataset.idoftweet}`,
            text
          );
        } else if (currentTarget.closest(".delete-button")) {
          if (confirm("Вы уверены?")) {
            tweetsController.removeTweet(
              `${currentTarget.closest(".tweet").dataset.idoftweet}`
            );
          }
        } else if (currentTarget.closest(".tweet")) {
          tweetFeedApiService.getTweetById(
            `${currentTarget.closest(".tweet").dataset.idoftweet}`,
            skip,
            top,
            filterConfig
          );
        } else {
          return;
        }
      });

    if (document.getElementById("addTweetField")) {
      const form = document.forms.addtweet;

      form.submit.addEventListener("click", function (event) {
        event.preventDefault();
        if (form.message.value) {
          tweetsController.addTweet(`${form.message.value}`);
        }
      });
    }

    if (document.getElementById("loadMore")) {
      document
        .getElementById("loadMore")
        .addEventListener("click", function (event) {
          tweetFeedApiService.getTweets(
            skip,
            document.getElementById("tweetsField").querySelectorAll(".tweet")
              .length + 10,
            filterConfig
          );
        });
    }

    this._filterView.display(filterConfig);

    document.forms.filters.submit.addEventListener("click", function (event) {
      event.preventDefault();
      let filterConfig = {
        author: `${document.forms.filters.author.value}`,
        text: `${document.forms.filters.text.value}`,
        dateFrom: `${document.forms.filters.dateFrom.value}`,
        dateTo: `${document.forms.filters.dateTo.value}`,
        hashtags: `${document.forms.filters.hashtag.value}`,
      };
      tweetFeedApiService.getTweets(skip, top, filterConfig);
    });

    document.forms.filters.reset.addEventListener("click", function (event) {
      let filterConfig = {};
      tweetFeedApiService.getTweets(skip, top, filterConfig);
    });
  }

  showTweet(tweet, top, filterConfig) {
    if (tweet) {
      this._tweetView.display(tweet);
      if (document.forms.writecomment) {
        document.forms.writecomment.submit.addEventListener(
          "click",
          function (event) {
            event.preventDefault();
            if (document.forms.writecomment.message.value) {
              tweetsController.addComments(
                `${document.querySelector(".tweet").dataset.idoftweet}`,
                `${document.forms.writecomment.message.value}`,
                top,
                filterConfig
              );
            }
          }
        );
      }
    }

    document
      .querySelector(".tweet")
      .addEventListener("click", function (event) {
        let currentTarget = event.target;
        if (currentTarget.closest(".edit-button")) {
          let text = prompt(
            "Введите изменения!",
            `${currentTarget
              .closest(".tweet")
              .querySelector(".text")
              .innerHTML.split()}`
          );

          tweetsController.editTweet(
            `${currentTarget.closest(".tweet").dataset.idoftweet}`,
            text
          );
        } else if (currentTarget.closest(".delete-button")) {
          if (confirm("Вы уверены?")) {
            tweetsController.removeTweet(
              `${currentTarget.closest(".tweet").dataset.idoftweet}`
            );
          }
        } else {
          return;
        }
      });
  }

  logIn() {
    this._logInView.display();
    const form = document.forms.logInForm;
    form.submit.addEventListener("click", function (event) {
      event.preventDefault();
      tweetFeedApiService.login(
        `${form.inputusername.value}`,
        `${form.inputpassword.value}`
      );
    });
  }

  logOut() {
    this.setCurrentUser();
    return true;
  }

  regestration() {
    this._regestrationView.display();
    const form = document.forms.regestration;

    form.submit.addEventListener("click", function (event) {
      event.preventDefault();
      if (!form.inputNewUser.value) {
        alert("Вы не ввели имя!");
        return false;
      }

      if (
        form.inputNewPassword.value &&
        form.inputAgain.value === form.inputNewPassword.value
      ) {
        tweetFeedApiService.registration(
          `${form.inputNewUser.value}`,
          `${form.inputNewPassword.value}`
        );
      } else {
        alert("Пароли не совпадают!");
        return false;
      }
    });
  }

  showError(message) {
    this._errorView.display(message);
  }
}

///
class HeaderView {
  constructor(containerId) {
    this.divUser = document.getElementById(containerId);
  }

  display(user, onlyView) {
    this.divUser.innerHTML = user;
    if (onlyView) {
      document.getElementById("log-button-in").style.display = "none";
      document.getElementById("log-button-out").style.display = "flex";
    } else {
      document.getElementById("log-button-in").style.display = "flex";
      document.getElementById("log-button-out").style.display = "none";
    }
  }
}

class TweetFeedView {
  constructor(containerId) {
    this.tweetsFeild = document.getElementById(containerId);
  }

  display(tweetsCollection, onlyView, arrayOfTweetsLength) {
    let tweets = "";
    tweetsCollection.forEach((tweet) => {
      let textOfTweet = tweet.text.split(" ");
      let text = textOfTweet.reduce(function (tweetText, aWord) {
        if (aWord.includes("#")) {
          return tweetText + " " + `<span class="hashtag">${aWord}</span>`;
        } else {
          return tweetText + " " + aWord;
        }
      }, "");
      let addTweetF = "";
      if (onlyView) {
        addTweetF = `<div id="addTweetField">
        <form class="write-tweet" name="addtweet">
            <textarea name="message" placeholder="Write your Twit here!" maxlength="280"
                class="style"></textarea>
            <button type="submit" class="button" name="submit">Share</button>
        </form>
    </div>`;
      }
      this.tweetsFeild.innerHTML = `<div class="main">
                ${addTweetF}
                <div class="tweets-filters">
                    <div id="tweetsField"></div>
                    <div class="filterField">
                    </div>
                </div>
            </div>`;

      tweets += `
            <div class="tweet" data-idOfTweet="${tweet.id}">
              <div class="tweet-head">
              <div class="icon-name">
              <span class="iconify user-photo" data-icon="ant-design:user-outlined"></span>
                <div class="name-time">
                  <p>${tweet.author}</p>
                  <p class="time">${new Date(
                    Date.parse(tweet.createdAt)
                  ).toLocaleString()}</p>
                </div></div>
                `;
      if (onlyView === tweet.author) {
        tweets += `<div>
                <button type="button" class="edit-button">
                  <span id="edit" class="iconify" data-icon="eva:edit-outline"></span>
                </button>
                <button type="button" class="delete-button">
                  <span id="delete" class="iconify" data-icon="bx:trash"></span>
                </button>
              </div>`;
      }

      tweets += `</div>
              <div class ="text">
                ${text.split()}
              </div>
              <div class="flex-center"><span id="comm" class="iconify"
                      data-icon="akar-icons:comment"></span><span>${
                        tweet.comments.length
                      }</span></div>
            </div></div>`;
    });
    document.getElementById("tweetsField").innerHTML = tweets;

    if (arrayOfTweetsLength) {
      document.getElementById(
        "tweetsField"
      ).innerHTML += `<button class="button" id="loadMore">Load more</button>`;
    }
  }
}

class FilterView {
  constructor(containerId) {
    this.filterField = document.getElementById(containerId);
  }

  display(filterConfig) {
    let filter = this.filterField.querySelector(".filterField");

    filter.innerHTML = `
      <form id="filters" class="filter" name="filters">
        <div class="header-of-filter">Date from</div>
        <input type="date" name="dateFrom">
        <div class="header-of-filter">Date To</div>
        <input type="date" name="dateTo">
        <div class="header-of-filter">Author name</div>
        <input type="text" name="author" placeholder="input author name" autocomplete="off">
        <div class="header-of-filter">Hashtag</div>
        <input type="text" name="hashtag" placeholder="input hashtag" autocomplete="off">
        <div class="header-of-filter">Text</div>
        <input type="text" name="text" placeholder="input text" autocomplete="off">
        <div class="button-filter">
          <button type="reset" class="button" name="reset">Reset</button>
          <button type="submit" class="button" name="submit">Filter</button>
        </div>
      </form>`;
    filter.innerHTML += `<div class="points"></div>`;
    if (filterConfig !== undefined) {
      let points = this.filterField.querySelector(".points");
      if (filterConfig.dateFrom) {
        points.innerHTML += `<p><span class="filter-element">From: ${filterConfig.dateFrom}</span></p>`;
      }
      if (filterConfig.dateTo) {
        points.innerHTML += `<p><span class="filter-element">To: ${filterConfig.dateTo}</span></p>`;
      }
      if (filterConfig.author) {
        points.innerHTML += `<span class="filter-element">Author: ${filterConfig.author}</span>`;
      }
      if (filterConfig.hashtags) {
        points.innerHTML += `<span class="filter-element">#: ${filterConfig.hashtags}</span>`;
      }
      if (filterConfig.text) {
        points.innerHTML += `<span class="filter-element">Text: ${filterConfig.text}</span>`;
      }
    }
  }
}

class TweetView {
  constructor(containerId) {
    this.tweetPage = document.getElementById(containerId);
  }

  display(tweet) {
    let currentTweet = "";
    currentTweet += `
    <div class="tweet" data-idoftweet="${tweet.id}">
        <div class="tweet-head">
        
        <div class="icon-name">
        <span class="iconify user-photo" data-icon="ant-design:user-outlined"></span>
          <div class="name-time">
            <p>${tweet.author}</p>
            <p class="time">${new Date(
              Date.parse(tweet.createdAt)
            ).toLocaleString()}</p>
          </div></div>`;
    if (
      JSON.parse(localStorage.getItem("currentUser")).userName === tweet.author
    ) {
      currentTweet += `<div>
              <button type="button" class="edit-button">
                <span id="edit" class="iconify" data-icon="eva:edit-outline"></span>
              </button>
              <button type="button" class="delete-button">
                <span id="delete" class="iconify" data-icon="bx:trash"></span>
              </button>
            </div>`;
    }
    currentTweet += `</div>
        <div class ="text">
          ${tweet.text}
        </div></div></div>`;
    this.tweetPage.innerHTML = `<div id="tweetf">` + currentTweet;

    if (tweet.comments && tweet.comments.length !== 0) {
      let comments = "";
      tweet.comments.forEach((comment) => {
        comments += `
    <div class="comment">
      <div class="tweet-head">
        <div class="icon-name">
          <span id="user-photo" class="iconify" data-icon="ant-design:user-outlined">
          </span>
          <div class="name-time">
            <p>${comment.author}</p>
            <p class="time">${new Date(
              Date.parse(comment.createdAt)
            ).toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div class ="text">
        ${comment.text}
      </div>
    </div>`;
      });

      document.getElementById(
        "tweetf"
      ).innerHTML += `<div class="commentsFields">
    ${comments}
    </div>`;
    }
    if (JSON.parse(localStorage.getItem("currentUser")).userName) {
      document.getElementById("tweetf").innerHTML += `
    <div class="tweet-form">
    <form class="write-tweet" name="writecomment">
        <textarea name="message" placeholder="Write your comment here!" maxlength="280"
            class="style"></textarea>
        <button type="submit" class="button" name="submit">Share</button>
    </form>
    </div>`;
    }
  }
}

class LogInView {
  constructor(containerId) {
    this.logDiv = document.getElementById(containerId);
  }

  display() {
    this.logDiv.innerHTML = `
    <div id="loginField" class="log-field">
    <img alt="WAC-WAC" src="images/Logo.svg" alt="Logo" class="logo">
    <span class="log-text">LogIn WAC-WAC</span>
    <form class="flex" name="logInForm">
    <input type="text" class="inputField" name="inputusername" required placeholder="input UserName" maxlength="16">
    <input type="password" name="inputpassword" class="inputField" required placeholder="input Password" autocomplete="off" maxlength="10">
    <button name="submit" class="button" type="submit">LOGIN</button>
    </form>
    <span>Dont have an account? click <a class="to-reg-login" onclick="tweetsController.regestration()">here</a>!</span>
    </div>`;
  }
}

class RegestrationView {
  constructor(containerId) {
    this.regDiv = document.getElementById(containerId);
  }

  display() {
    this.regDiv.innerHTML = `
    <div id="logoutField" class="log-field">
    <img alt="WAC-WAC" src="images/Logo.svg" alt="Logo" class="logo">
    <span class="log-text">Registrate in WAC-WAC</span>
    <form class="flex" name="regestration">
    <input type="text" id="input-new-user-name" class="inputField" name="inputNewUser" required placeholder="input UserName" maxlength="16">
    <input type="password" id="input-new-password" class="inputField" name="inputNewPassword" autocomplete="off" required placeholder="input Password" maxlength="10">
    <input type="password" id="input-again-password" class="inputField" name="inputAgain" autocomplete="off" required placeholder="input Password again" maxlength="10">
    <button id="applyRegestration" class="button" type="submit" name="submit">Regestrate</button>
    </form>
    <span>Have an account? click <a class="to-reg-login" onclick="tweetsController.logIn()">here</a> to LogIn!</span>
    </div>`;
  }
}

class ErrorView {
  constructor(containerId) {
    this.errorDiv = document.getElementById(containerId);
  }
  display(message) {
    this.errorDiv.innerHTML = `
    <div id="loginField" class="log-field error-field">
    <img alt="WAC-WAC" src="images/Logo.svg" alt="Logo" class="logo">
    <div class="errortext">
    <p>Oooops.....</p>
    <p>Что-то пошло не так!</p>
    <p id="errorMessage">${message}</p>
    </div>
    </div>`;
  }
}

toLocalStorage();
const tweetsController = new TweetsController();
const tweetFeedApiService = new TweetFeedApiService(
  "https://jslabapi.datamola.com"
);
tweetsController.setCurrentUser(
  JSON.parse(localStorage.getItem("currentUser")).userName
);
tweetFeedApiService.getTweets();
