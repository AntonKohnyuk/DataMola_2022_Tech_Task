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
      let dateA = new Date(a.createdAt);
      let dateB = new Date(b.createdAt);
      return dateA > dateB ? 1 : -1;
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
    let arrayFilterSkip = arrayFilter.slice(skip, end);
    console.log(arrayFilter);
    console.log(arrayFilterSkip);

    return arrayFilterSkip;
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
    if (i !== -1) {
      if (this._collectionOfTweets[i].author === this._user) {
        this._collectionOfTweets[i].text = text;
        if (Tweet.validate(this._collectionOfTweets[i])) {
          return true;
        }
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
      console.log(i);
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

//проверки
let nonValidTweet1 = new Tweet("", "egsegeg", "34se");
let nonValidTweet2 = new Tweet("464364", "", "34se");
let nonValidTweet3 = new Tweet("25236526", "egsegeg", "");
let nonValidTweet4 = new Tweet();
let validTweet1 = new Tweet(identifier, "Hello hi good morning!", "anton");
identifier++;
let validTweet2 = new Tweet(identifier, "Hello hi good morning!", "boris");
identifier++;
let validTweet3 = new Tweet(identifier, "Hello hi good morning!", "kolya");
identifier++;
let collection1 = new TweetsCollection(arrayOfTweets);
let arr = [
  nonValidTweet1,
  nonValidTweet2,
  nonValidTweet3,
  validTweet1,
  nonValidTweet4,
  validTweet2,
  validTweet3,
];
console.log(collection1);
collection1.changeUser = "user_0";
console.log(collection1.user);
console.log(collection1.get("0"));
collection1.edit("0", "I edit here");
console.log(collection1.get("0"));
collection1.changeUser = "user_1";
collection1.remove("1");
console.log(collection1.get("1"));
console.log(collection1.addAll(arr));
