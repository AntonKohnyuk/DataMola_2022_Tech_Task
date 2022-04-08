//работа с DOM

//глобальные функции
function setCurrentUser(user) {
  if (user === undefined || user.trim() === "") {
    return false;
  }
  collection1.changeUser = user;
  headerView.display(user);
  getFeed();
  return true;
} //ready

function addTweet(text) {
  if (collection1.add(text)) {
    tweetFeedView.display(collection1.getPage(), collection1);
    return true;
  }
  return false;
}

function editTweet(id, text) {
  if (collection1.edit(id, text)) {
    tweetFeedView.display(collection1.getPage(), collection1);
    return true;
  }
  return false;
}

function removeTweet(id) {
  if (collection1.remove(id)) {
    tweetFeedView.display(collection1.getPage(), collection1);
    return true;
  }
  return false;
}

function getFeed(skip = 0, top = 10, filterConfig = {}) {
  tweetFeedView.display(
    collection1.getPage(skip, top, filterConfig),
    collection1
  );
  filterView.display(filterConfig);
}

function showTweet(id) {
  let tweet = collection1.get(id);
  if (tweet) {
    tweetView.display(tweet, collection1);
    return true;
  }
  return false;
}

//классы view

class HeaderView {
  constructor(containerId) {
    this.divUser = document.getElementById(containerId);
  }

  display(user) {
    this.divUser.innerHTML = user;
  }
}

class TweetFeedView {
  constructor(containerId) {
    this.tweetsFeild = document.getElementById(containerId);
  }

  display(tweetsCollection, onlyView) {
    document.getElementById("mainPage").style.display = "flex";
    document.getElementById("tweetPage").style.display = "none";

    if (onlyView.user) {
      document.getElementById("addTweetField").style.display = "block";
    }

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

      tweets += `
      <div class="tweet">
        <div class="tweet-head">
        <div class="icon-name">
        <span class="iconify user-photo" data-icon="ant-design:user-outlined"></span>
          <div class="name-time">
            <p>${tweet.author}</p>
            <p class="time">${tweet.createdAt}</p>
          </div></div>
          <div>
              <button type="button" class="edit-button">
                <span id="edit" class="iconify" data-icon="eva:edit-outline"></span>
              </button>
              <button type="button" class="delete-button">
                <span id="delete" class="iconify" data-icon="bx:trash"></span>
              </button>
          </div>
        </div>
        <div class ="text">
          ${text.split()}
        </div>
        <div class="flex-center"><span id="comm" class="iconify"
                data-icon="akar-icons:comment"></span><span>${
                  tweet.comments.length
                }</span></div>
      </div></div>`;
    });
    this.tweetsFeild.innerHTML = tweets;
  }
}

class FilterView {
  constructor(containerId) {
    this.filterField = document.getElementById(containerId);
  }

  display(filterConfig) {
    this.filterField.innerHTML = `<form id="filters" class="filter">
    Date from<br />
    <input type="date" name="Date"><br />
    Date To<br />
    <input type="date" name="Date"><br />
    Author name<br />
    <input type="text" name="Author name" placeholder="input author name"><br />
    Hashtag #<br />
    <input type="text" name="# ..." placeholder="input #hashtag"><br />
    Text<br />
    <input type="text" name="text twit ..." placeholder="input text"><br />
    <div class="button-filter">
        <button type="reset" class="button">Reset</button>
        <button type="submit" class="button">Filter</button>
    </div>
</form>`;
    const filters = this.filterField.firstChild.querySelectorAll("input");
    if (filterConfig !== undefined) {
      if (filterConfig.dateFrom !== undefined) {
        filters[0].insertAdjacentHTML(
          "afterend",
          `<p>${filterConfig.dateFrom}</p>`
        );
      }
      if (filterConfig.dateTo !== undefined) {
        filters[1].insertAdjacentHTML(
          "afterend",
          `<p>${filterConfig.dateTo}</p>`
        );
      }
      if (filterConfig.author !== undefined) {
        filters[2].insertAdjacentHTML(
          "afterend",
          `<p>${filterConfig.author}</p>`
        );
      }
      if (filterConfig.hashtags !== undefined) {
        filters[3].insertAdjacentHTML(
          "afterend",
          `<p>${filterConfig.hashtags}</p>`
        );
      }
      if (filterConfig.text !== undefined) {
        filters[4].insertAdjacentHTML(
          "afterend",
          `<p>${filterConfig.text}</p>`
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
    document.getElementById("mainPage").style.display = "none";
    document.getElementById("tweetPage").style.display = "flex";
    this.tweetPage.innerHTML = `
    <div class="tweet">
        <div class="tweet-head">
        <div class="icon-name">
        <span class="iconify user-photo" data-icon="ant-design:user-outlined"></span>
          <div class="name-time">
            <p>${tweet.author}</p>
            <p class="time">${tweet.createdAt}</p>
          </div></div>
          <div>
              <button type="button" class="edit-button">
                <span id="edit" class="iconify" data-icon="eva:edit-outline"></span>
              </button>
              <button type="button" class="delete-button">
                <span id="delete" class="iconify" data-icon="bx:trash"></span>
              </button>
          </div>
        </div>
        <div class ="text">
          ${tweet.text}
        </div></div></div>`;
    if (tweet.comments && tweet.comments.length !== 0) {
      let comments = "";
      tweet.comments.forEach((comment) => {
        comments += `
    <div class="comment">
      <div class="tweet-head">
      <div class="icon-name">
      <span id="user-photo" class="iconify" data-icon="ant-design:user-outlined"></span>
        <div class="name-time">
          <p>${comment.author}</p>
          <p class="time">${comment.createdAt}</p>
        </div>
      </div>
      <div class ="text">
        ${comment.text}
      </div>
    </div></div>`;
      });
      this.tweetPage.innerHTML += `<div class="commentsFields">
    ${comments}
    </div>`;
    }
    if (onlyView.user) {
      this.tweetPage.innerHTML += `
    <div class="tweet-form">
    <form class="write-tweet">
        <textarea name="message" placeholder="Write your comment here!" maxlength="280"
            class="style"></textarea>
        <button type="submit" class="button">Share</button>
    </form>
    </div>`;
    }
  }
}

//
//коллекция твитов
//

class Publication {
  constructor(id, text, author) {
    this._id = id;
    this._author = author;
    this._text = text;
    this._createdAt = new Date();
  }
  static validate(publication) {
    if (
      publication.id === undefined ||
      publication.author === undefined ||
      publication.text === undefined ||
      publication.createdAt === undefined ||
      publication.id === "" ||
      publication.author === "" ||
      publication.text === "" ||
      publication.createdAt === "" ||
      publication.text.length > 280
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
    return super.validate(tweet) && Boolean(tweet.comments);
  }

  get comments() {
    return this._comments;
  }
}

class TweetsCollection {
  constructor(arrayOfTweets) {
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
    return nonValidateTweets;
  }

  getPage(skip = 0, top = 10, filterConfig = {}) {
    function sortFunction(a, b) {
      return new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1;
    }
    this._collectionOfTweets.sort(sortFunction);
    let arrayFilter = [];
    let end = skip + top;

    if (
      filterConfig.author === undefined &&
      filterConfig.dateFrom === undefined &&
      filterConfig.dateTo === undefined &&
      filterConfig.hashtags === undefined &&
      filterConfig.text === undefined
    ) {
      if (skip + top > this._collectionOfTweets.length) {
        end = this._collectionOfTweets.length;
      }
      return (arrayFilter = this._collectionOfTweets.slice(skip, end));
    }

    for (let i = 0, j = 0; i < this._collectionOfTweets.length; i++) {
      if (filterConfig.author !== undefined) {
        if (this._collectionOfTweets[i].author !== filterConfig.author) {
          continue;
        }
      }
      if (filterConfig.dateFrom !== undefined) {
        if (this._collectionOfTweets[i].createdAt <= filterConfig.dateFrom) {
          continue;
        }
      }
      if (filterConfig.dateTo !== undefined) {
        if (this._collectionOfTweets[i].createdAt >= filterConfig.dateTo) {
          continue;
        }
      }
      if (filterConfig.hashtags !== undefined) {
        let hashtags = filterConfig.hashtags.split(" ");
        let includeHasgtag = false;
        for (let hashtag of hashtags) {
          if (this._collectionOfTweets[i].text.includes(hashtag)) {
            includeHasgtag = true;
          }
        }
        if (!includeHasgtag) {
          continue;
        }
      }
      if (filterConfig.text !== undefined) {
        if (!this._collectionOfTweets[i].text.includes(filterConfig.text)) {
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
      if (tweet.id === id) return tweet;
    }
    return undefined;
  }

  add(text) {
    let tweet = new Tweet(identifier, text.trim(), this._user);

    if (Tweet.validate(tweet) === true) {
      this._collectionOfTweets.push(tweet);
      identifier++;
      return true;
    }
    return false;
  }

  edit(id, text) {
    let i = this._collectionOfTweets.findIndex((tweet) => tweet.id === id);
    if (i !== -1 && this._collectionOfTweets[i].author === this._user) {
      this._collectionOfTweets[i].text = text;
      if (Tweet.validate(this._collectionOfTweets[i])) {
        return true;
      }
    }
    return false;
  }

  remove(id) {
    let i = this._collectionOfTweets.findIndex((tweet) => tweet.id === id);
    if (i !== -1) {
      if (this._collectionOfTweets[i].author === this._user) {
        this._collectionOfTweets.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  addComment(id, text) {
    let i = this._collectionOfTweets.findIndex((tweet) => tweet.id === id);

    if (i === -1) {
      return false;
    }

    let comment = new Comment(identifier, text, this._user);

    if (Comment.validate(comment)) {
      this._collectionOfTweets[i]._comments.push(comment);
      identifier++;
      return true;
    }

    return false;
  }

  clear() {
    this._collectionOfTweets.length = 0;
    this._user = undefined;
  }
}
//

let date = new Date(2022, 0, 1);
const arrayOfTweets = [];

let tweetsNumber = Math.floor(Math.random() * (32 - 20) + 20);
for (let i = 0; i < tweetsNumber; i++) {
  arrayOfTweets[i] = new Tweet(
    `${i}`,
    `HelloWorld #Js${i} #id` + i,
    "user_" + i
  );
  arrayOfTweets[i]._createdAt = new Date(date.setDate(date.getDate() + 2));
}

let identifier = arrayOfTweets.length;

let collection1 = new TweetsCollection(arrayOfTweets);

const headerView = new HeaderView("username");

const tweetView = new TweetView("tweetf");

const tweetFeedView = new TweetFeedView("tweetsField");

const filterView = new FilterView("filterField");

getFeed();
