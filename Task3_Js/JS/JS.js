function tweet(id, text, createDate, author) {
  this.id = id;
  this.text = text;
  this.createdAt = new Date(createDate);
  this.author = author;
  this.comments = [];
}

let date = new Date(2022, 0, 1);
const array_of_tweets = [];
let tweetsNumber = Math.floor(Math.random() * (32 - 20) + 20);
for (let i = 0; i < tweetsNumber; i++) {
  array_of_tweets[i] = new tweet(
    `${i}`,
    "HelloWorld #Js #id" + i,
    new Date(date.setDate(date.getDate() + 2)),
    "user_" + i
  );
}

const TweetsModule = (function () {
  let identifier = array_of_tweets.length;
  let user = undefined;

  const getTweets = function (skip = 0, top = 10, filterConfig = {}) {
    function sortFunction(a, b) {
      let dateA = new Date(a.createdAt).getTime();
      let dateB = new Date(b.createdAt).getTime();
      return dateA > dateB ? 1 : -1;
    }
    array_of_tweets.sort(sortFunction);
    let arrayFilter = [];
    let end;

    if (skip + top > array_of_tweets.length) {
      end = array_of_tweets.length;
    } else {
      end = skip + top;
    }

    if (
      filterConfig.author === undefined &&
      filterConfig.dateFrom === undefined &&
      filterConfig.dateTo === undefined &&
      filterConfig.hashtags === undefined &&
      filterConfig.text === undefined
    ) {
      return (arrayFilter = array_of_tweets.slice(skip, end));
    }

    for (let i = 0, j = 0; i < array_of_tweets.length; i++) {
      if (filterConfig.author !== undefined) {
        if (array_of_tweets[i].author !== filterConfig.author) {
          continue;
        }
      }
      if (filterConfig.dateFrom !== undefined) {
        if (array_of_tweets[i].createdAt <= filterConfig.dateFrom) {
          continue;
        }
      }
      if (filterConfig.dateTo !== undefined) {
        if (array_of_tweets[i].createdAt >= filterConfig.dateTo) {
          continue;
        }
      }
      if (filterConfig.hashtags !== undefined) {
        let hashtags = filterConfig.hashtags.split(" ");
        let includeHasgtag = false;
        for (let hashtag of hashtags) {
          if (array_of_tweets[i].text.includes(hashtag)) {
            includeHasgtag = true;
          }
        }
        if (!includeHasgtag) {
          continue;
        }
      }
      if (filterConfig.text !== undefined) {
        if (!array_of_tweets[i].text.includes(filterConfig.text)) {
          continue;
        }
      }
      arrayFilter[j] = array_of_tweets[i];
      j++;
    }
    if (end > arrayFilter.length) {
      end = arrayFilter.length;
    }
    let arrayFilterSkip = arrayFilter.slice(skip, end);
    return arrayFilterSkip;
  };

  const getTweet = function (id) {
    for (let tweet of array_of_tweets) {
      if (tweet.id === id) return tweet;
    }
    return undefined;
  };

  const validateTweet = function (tweet) {
    if (
      tweet.id === undefined ||
      tweet.author === undefined ||
      tweet.text === "" ||
      tweet.text === undefined ||
      tweet.createdAt === undefined ||
      tweet.text.length > 280 ||
      tweet.comments === undefined ||
      tweet.author === "" ||
      tweet.id === ""
    ) {
      return false;
    }
    return true;
  };

  const addTweet = function (text) {
    let tweet = {
      id: `${identifier}`,
      text: text.trim(),
      createdAt: new Date(),
      author: user,
      comments: [],
    };

    if (validateTweet(tweet) === true && getTweet(tweet.id) === undefined) {
      array_of_tweets.push(tweet);
      identifier++;
      return true;
    }
    return false;
  };

  const editTweet = function (id, text) {
    let i = array_of_tweets.findIndex((tweet) => tweet.id === id);
    if (i !== -1) {
      if (array_of_tweets[i].author === user) {
        array_of_tweets[i].text = text;
        if (validateTweet(array_of_tweets[i]) == true) return true;
      }
    }
    return false;
  };

  const removeTweet = function (id) {
    let i = array_of_tweets.findIndex((tweet) => tweet.id === id);
    if (i !== -1) {
      if (array_of_tweets[i].author === user) {
        array_of_tweets.splice(i, 1);
        return true;
      }
    }
    return false;
  };

  const changeUser = function (usr) {
    user = usr.trim();
    console.log(user);
  };

  const validateComment = function (com) {
    if (
      com.id === undefined ||
      com.author === undefined ||
      com.createdAt === undefined ||
      com.text.length > 280 ||
      com.text === "" ||
      com.text === undefined ||
      com.id === "" ||
      com.author === ""
    )
      return false;
    return true;
  };

  const addComment = function (id, text) {
    let i = array_of_tweets.findIndex((tweet) => tweet.id === id);
    if (i === -1) {
      return false;
    }

    let comment = {
      id: `${identifier}`,
      text: text,
      createdAt: new Date(),
      author: user,
    };
    if (validateComment(comment) === true) {
      array_of_tweets[i].comments.push(comment);
      identifier++;
      return true;
    }
    return false;
  };

  return {
    getTweets,
    getTweet,
    validateTweet,
    addTweet,
    editTweet,
    removeTweet,
    changeUser,
    addComment,
    validateComment,
  };
})();

///Tests
TweetsModule.addComment("0", "awfawfawgawg");
console.log(array_of_tweets[0].comments);
TweetsModule.changeUser("user_0");
TweetsModule.addComment("0", "awfawfawgawg");
console.log(array_of_tweets[0].comments);
console.log(array_of_tweets[0]);
TweetsModule.editTweet("0", "huweuoawuoawo wegsg");
console.log(array_of_tweets[0]);
TweetsModule.removeTweet("0");
console.log(array_of_tweets[0]);
TweetsModule.addTweet("awhoauw OIOH1");
console.log(array_of_tweets);
TweetsModule.addTweet("");
TweetsModule.getTweet("15");
TweetsModule.getTweet("100000");
TweetsModule.getTweets(0, 10, { text: "id1" });
TweetsModule.getTweets(10, 10);
