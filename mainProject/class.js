function toLocalStorage() {
  if (!localStorage.arrayOfTweets) {
    const array = [
      {
        _id: "1",
        _author: "Anton",
        _text: "Бла бла",
        _createdAt: new Date(2022, 0, 1),
        _comments: [],
      },
      {
        _id: "2",
        _author: "Vladimir",
        _text: "Бла бла",
        _createdAt: new Date(2022, 0, 2),
        _comments: [],
      },
      {
        _id: "3",
        _author: "Sergey",
        _text: "Бла бла",
        _createdAt: new Date(2022, 0, 3),
        _comments: [],
      },
    ];
    localStorage.setItem("arrayOfTweets", JSON.stringify(array));
  }

  if (!localStorage.baseOfUsers) {
    const regestraitedUsers = [
      { userName: "Anton", password: "12345678" },
      { userName: "Vladimir", password: "22222222" },
      { userName: "Sergey", password: "33333333" },
    ];
    localStorage.setItem("baseOfUsers", JSON.stringify(regestraitedUsers));
  }
}

let identifier = 0;

class TweetsController {
  constructor() {
    this._tweetFeedView = new TweetFeedView("mainPage");
    this._headerView = new HeaderView("username");
    this._tweetView = new TweetView("mainPage");
    this._filterView = new FilterView("mainPage");
    this._logInView = new LogInView("mainPage");
    this._regestrationView = new RegestrationView("mainPage");
    this._tweetsCollection = new TweetsCollection();
    this._baseOfUsers = new UserCollection();

    this._tweetsCollection.restore();
    this._baseOfUsers.restore();
  }

  setCurrentUser(user = undefined) {
    if (user !== undefined && user.trim === "") {
      return false;
    }
    this._tweetsCollection.changeUser = user;
    if (user) {
      this._headerView.display(user, this._tweetsCollection.user);
    } else {
      this._headerView.display("Guest", user);
    }
    this.getFeed();
    return true;
  }

  addTweet(text) {
    if (this._tweetsCollection.add(text)) {
      this.getFeed();
      return true;
    }
    return false;
  }

  editTweet(id, text) {
    if (this._tweetsCollection.edit(id, text)) {
      this.getFeed();
      return true;
    }
    return false;
  }

  removeTweet(id) {
    if (this._tweetsCollection.remove(id)) {
      this.getFeed();
      return true;
    }
    return false;
  }

  addComments(id, text) {
    if (this._tweetsCollection.addComment(id, text)) {
      this.showTweet(id);
      return true;
    }
    return false;
  }

  getFeed(skip = 0, top = 10, filterConfig = {}) {
    this._tweetFeedView.display(
      this._tweetsCollection.getPage(skip, top, filterConfig),
      this._tweetsCollection.user,
      this._tweetsCollection._collectionOfTweets.length
    );

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
          tweetsController.showTweet(
            `${currentTarget.closest(".tweet").dataset.idoftweet}`
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
          tweetsController.getFeed(
            0,
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
      tweetsController.getFeed(0, 10, filterConfig);
    });

    document.forms.filters.reset.addEventListener("click", function (event) {
      let filterConfig = {};
      tweetsController.getFeed(0, 10, filterConfig);
    });
  }

  showTweet(id) {
    let tweet = this._tweetsCollection.get(id);
    if (tweet) {
      this._tweetView.display(tweet, this._tweetsCollection);
      if (document.forms.writecomment) {
        document.forms.writecomment.submit.addEventListener(
          "click",
          function (event) {
            event.preventDefault();
            if (document.forms.writecomment.message.value) {
              tweetsController.addComments(
                `${document.querySelector(".tweet").dataset.idoftweet}`,
                `${document.forms.writecomment.message.value}`
              );
            }
          }
        );
      }
      return true;
    }

    return false;
  }

  logIn() {
    this.setCurrentUser();
    this._logInView.display();
    const form = document.forms.logInForm;
    form.submit.addEventListener("click", function (event) {
      event.preventDefault();
      let userName = tweetsController._baseOfUsers.userCollection.reduce(
        function (key, user) {
          if (
            user.userName === form.inputusername.value &&
            user.password === form.inputpassword.value
          ) {
            key++;
          }
          return key;
        },
        0
      );

      if (userName) {
        tweetsController.setCurrentUser(`${form.inputusername.value}`);
        alert("Вы вошли!");
        return true;
      }
      alert("Неверный логин или пароль!");
      return false;
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
      let userName = tweetsController._baseOfUsers.userCollection.reduce(
        function (key, user) {
          if (user.userName === form.inputNewUser.value) {
            key++;
          }
          return key;
        },
        0
      );
      if (!form.inputNewUser.value) {
        alert("Вы не ввели имя!");
        return false;
      }
      if (!userName) {
        if (
          form.inputNewPassword.value &&
          form.inputAgain.value === form.inputNewPassword.value
        ) {
          tweetsController._baseOfUsers.addUserToCollection({
            userName: `${form.inputNewUser.value}`,
            password: `${form.inputNewPassword.value}`,
          });
          tweetsController.setCurrentUser(`${form.inputNewUser.value}`);
          alert("Вы успешно зарегистрировались и вошли!");
          return true;
        } else {
          alert("Пароли не совпадают!");
          return false;
        }
      }

      alert("Пользователь с таким именем уже существует!");
      return false;
    });
  }
}

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

  display(tweetsCollection, onlyView, lengthOfArray) {
    let tweets = "";
    tweetsCollection.forEach((tweet) => {
      let textOfTweet = tweet._text.split(" ");
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
            <div class="tweet" data-idOfTweet="${tweet._id}">
              <div class="tweet-head">
              <div class="icon-name">
              <span class="iconify user-photo" data-icon="ant-design:user-outlined"></span>
                <div class="name-time">
                  <p>${tweet._author}</p>
                  <p class="time">${tweet._createdAt}</p>
                </div></div>
                `;
      if (onlyView === tweet._author) {
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
                        tweet._comments.length
                      }</span></div>
            </div></div>`;
    });
    document.getElementById("tweetsField").innerHTML = tweets;

    if (
      document.getElementById("tweetsField").querySelectorAll(".tweet")
        .length !== lengthOfArray
    ) {
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
    this.filterField.querySelector(
      ".filterField"
    ).innerHTML = `<form id="filters" class="filter" name="filters">
      Date from<br />
      <input type="date" name="dateFrom"><br />
      Date To<br />
      <input type="date" name="dateTo"><br />
      Author name<br />
      <input type="text" name="author" placeholder="input author name"><br />
      Hashtag #<br />
      <input type="text" name="hashtag" placeholder="input #hashtag"><br />
      Text<br />
      <input type="text" name="text" placeholder="input text"><br />
      <div class="button-filter">
          <button type="reset" class="button" name="reset">Reset</button>
          <button type="submit" class="button" name="submit">Filter</button>
      </div>
  </form>`;
    const filters = this.filterField.firstChild.querySelectorAll("input");
    if (filterConfig !== undefined) {
      if (filterConfig.dateFrom) {
        filters[0].insertAdjacentHTML(
          "afterend",
          `<p class="filterElement">${filterConfig.dateFrom}</p>`
        );
      }
      if (filterConfig.dateTo) {
        filters[1].insertAdjacentHTML(
          "afterend",
          `<p class="filterElement">${filterConfig.dateTo}</p>`
        );
      }
      if (filterConfig.author) {
        filters[2].insertAdjacentHTML(
          "afterend",
          `<p class="filterElement">${filterConfig.author}</p>`
        );
      }
      if (filterConfig.hashtags) {
        filters[3].insertAdjacentHTML(
          "afterend",
          `<p class="filterElement">${filterConfig.hashtags}</p>`
        );
      }
      if (filterConfig.text) {
        filters[4].insertAdjacentHTML(
          "afterend",
          `<p class="filterElement">${filterConfig.text}</p>`
        );
      }
    }
  }
}

class TweetView {
  constructor(containerId) {
    this.tweetPage = document.getElementById(containerId);
  }

  display(tweet, onlyView) {
    let currentTweet = "";
    currentTweet += `
    <div class="tweet" data-idoftweet="${tweet._id}">
        <div class="tweet-head">
        
        <div class="icon-name">
        <span class="iconify user-photo" data-icon="ant-design:user-outlined"></span>
          <div class="name-time">
            <p>${tweet._author}</p>
            <p class="time">${tweet._createdAt}</p>
          </div></div>`;
    if (onlyView.user === tweet._author) {
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
          ${tweet._text}
        </div></div></div>`;
    this.tweetPage.innerHTML = `<div id="tweetf">` + currentTweet;

    if (tweet._comments && tweet._comments.length !== 0) {
      let comments = "";
      tweet._comments.forEach((comment) => {
        comments += `
    <div class="comment">
      <div class="tweet-head">
        <div class="icon-name">
          <span id="user-photo" class="iconify" data-icon="ant-design:user-outlined">
          </span>
          <div class="name-time">
            <p>${comment._author}</p>
            <p class="time">${comment._createdAt}</p>
          </div>
        </div>
      </div>
      <div class ="text">
        ${comment._text}
      </div>
    </div>`;
      });

      document.getElementById(
        "tweetf"
      ).innerHTML += `<div class="commentsFields">
    ${comments}
    </div>`;
    }
    if (onlyView.user) {
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
    <span>LogIn WAC-WAC</span>
    <form class="flex" name="logInForm">
    <input type="text" class="inputField" name="inputusername">
    <input type="text" name="inputpassword" class="inputField">
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
    <span>Regestrate in WAC-WAC</span>
    <form class="flex" name="regestration">
    <input type="text" id="input-new-user-name" class="inputField" name="inputNewUser">
    <input type="text" id="input-new-password" class="inputField" name="inputNewPassword">
    <input type="text" id="input-again-password" class="inputField" name="inputAgain">
    <button id="applyRegestration" class="button" type="submit" name="submit">Regestrate</button>
    </form>
    <span>Have an account? click <a class="to-reg-login" onclick="tweetsController.logIn()">here</a> to LogIn!</span>
    </div>`;
  }
}

class TweetsCollection {
  constructor(arrayOfTweets = []) {
    this._collectionOfTweets = [];
    for (let tweet of arrayOfTweets) {
      if (Tweet.validate(tweet)) {
        this._collectionOfTweets.push(tweet);
      }
    }
    this._user = undefined;
  }

  get user() {
    return this._user;
  }

  set changeUser(user) {
    this._user = user;
  }

  addAll(arrayOfTweets) {
    let nonValidateTweets = [];
    for (let tweet of arrayOfTweets) {
      if (Tweet.validate(tweet)) {
        this._collectionOfTweets.push(tweet);
      } else {
        nonValidateTweets.push(tweet);
      }
    }
    this.save();
    return nonValidateTweets;
  }

  getPage(skip = 0, top = 10, filterConfig = {}) {
    function sortFunction(a, b) {
      return new Date(a._createdAt) < new Date(b._createdAt) ? 1 : -1;
    }
    this._collectionOfTweets.sort(sortFunction);
    let arrayFilter = [];
    let end = skip + top;

    if (
      !filterConfig.author &&
      !filterConfig.dateFrom &&
      !filterConfig.dateTo &&
      !filterConfig.hashtags &&
      !filterConfig.text
    ) {
      if (skip + top > this._collectionOfTweets.length) {
        end = this._collectionOfTweets.length;
      }
      return (arrayFilter = this._collectionOfTweets.slice(skip, end));
    }

    for (let i = 0, j = 0; i < this._collectionOfTweets.length; i++) {
      if (filterConfig.author) {
        if (this._collectionOfTweets[i]._author !== filterConfig.author) {
          continue;
        }
      }
      if (filterConfig.dateFrom) {
        if (this._collectionOfTweets[i]._createdAt <= filterConfig.dateFrom) {
          continue;
        }
      }
      if (filterConfig.dateTo) {
        if (this._collectionOfTweets[i]._createdAt >= filterConfig.dateTo) {
          continue;
        }
      }
      if (filterConfig.hashtags) {
        let hashtags = filterConfig.hashtags.split(" ");
        let includeHasgtag = false;
        for (let hashtag of hashtags) {
          if (this._collectionOfTweets[i]._text.includes(hashtag)) {
            includeHasgtag = true;
          }
        }
        if (!includeHasgtag) {
          continue;
        }
      }
      if (filterConfig.text) {
        if (!this._collectionOfTweets[i]._text.includes(filterConfig.text)) {
          continue;
        }
      }
      arrayFilter[j] = this._collectionOfTweets[i];
      j++;
    }

    if (end > arrayFilter.length) {
      end = arrayFilter.length;
    }

    return arrayFilter.slice(skip, end);
  }

  get(id) {
    for (let tweet of this._collectionOfTweets) {
      if (tweet._id === id) return tweet;
    }
    return undefined;
  }

  add(text) {
    let tweet = new Tweet(`${identifier}`, text.trim(), this._user);

    if (Tweet.validate(tweet) === true) {
      this._collectionOfTweets.push(tweet);
      identifier++;
      this.save();
      return true;
    }
    return false;
  }

  edit(id, text) {
    let i = this._collectionOfTweets.findIndex((tweet) => tweet._id === id);
    if (i !== -1 && this._collectionOfTweets[i]._author === this._user) {
      this._collectionOfTweets[i]._text = text;
      if (Tweet.validate(this._collectionOfTweets[i])) {
        this.save();
        return true;
      }
    }
    return false;
  }

  remove(id) {
    let i = this._collectionOfTweets.findIndex((tweet) => tweet._id === id);
    if (i !== -1) {
      if (this._collectionOfTweets[i]._author === this._user) {
        this._collectionOfTweets.splice(i, 1);
        this.save();
        return true;
      }
    }
    return false;
  }

  addComment(id, text) {
    let i = this._collectionOfTweets.findIndex((tweet) => tweet._id === id);

    if (i === -1) {
      return false;
    }

    let comment = new Comment(identifier, text, this._user);

    if (Comment.validate(comment)) {
      this._collectionOfTweets[i]._comments.push(comment);
      identifier++;
      this.save();
      return true;
    }

    return false;
  }

  save() {
    localStorage.setItem(
      "arrayOfTweets",
      JSON.stringify(this._collectionOfTweets)
    );
  }

  restore() {
    this._collectionOfTweets = JSON.parse(
      localStorage.getItem("arrayOfTweets")
    );
  }

  clear() {
    this._collectionOfTweets.length = 0;
    this._user = undefined;
  }
}

class UserCollection {
  constructor(userCollection = []) {
    this.userCollection = userCollection;
  }
  addUserToCollection(newUser) {
    this.userCollection.push(newUser);
    this.save();
  }

  save() {
    localStorage.setItem("baseOfUsers", JSON.stringify(this.userCollection));
  }

  restore() {
    this.userCollection = JSON.parse(localStorage.getItem("baseOfUsers"));
  }
}

class Publication {
  constructor(id, text, author) {
    this._id = id;
    this._author = author;
    this._text = text;
    this._createdAt = new Date();
  }
  static validate(publication) {
    if (
      publication._id === undefined ||
      publication._author === undefined ||
      publication._text === undefined ||
      publication._createdAt === undefined ||
      publication._id === "" ||
      publication._author === "" ||
      publication._text === "" ||
      publication._createdAt === "" ||
      publication._text.length > 280
    ) {
      return false;
    } else {
      return true;
    }
  }
  get id() {
    return this._id;
  }

  get author() {
    return this._author;
  }

  get text() {
    return this._text;
  }

  get createdAt() {
    return this._createdAt;
  }

  set text(text) {
    this._text = text;
  }
}

class Comment extends Publication {
  constructor(id, text, author) {
    super(id, text, author);
  }
}

class Tweet extends Publication {
  constructor(id, text, author) {
    super(id, text, author);
    this._comments = [];
  }

  static validate(tweet) {
    return super.validate(tweet) && Boolean(tweet._comments);
  }

  get comments() {
    return this._comments;
  }
}

toLocalStorage();
const tweetsController = new TweetsController();
identifier = tweetsController._tweetsCollection._collectionOfTweets.length + 1;
tweetsController.getFeed();
