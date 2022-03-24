
class Comment {
    constructor(id, text, author) {
        this._id = String(id);
        this._author = String(author);
        this.text = String(text);
        this._createdAt = new Date();
    }

    static validate(comment) {
        if ((comment.getId === undefined || comment.getAuthor === undefined
            || comment.getText === undefined
            || comment.getCreatedAt === undefined)
            || (comment.getId === '' || comment.getAuthor === ''
                || comment.getText === ''
                || comment.getCreatedAt === '')
            || comment.getText.length > 280) {
            return false;
        } else {
            return true;
        }
    }

    get getId() {
        return this._id;
    }

    get getAuthor() {
        return this._author;
    }

    get getText() {
        return this.text;
    }

    get getCreatedAt() {
        return this._createdAt;
    }

    set setText(text) {
        this.text = text;
    }
}

class Tweet extends Comment {
    constructor(id, text, author) {
        super(id, text, author);
        this.comments = [];
    }

    static validate(tweet) {

        if (super.validate(tweet)) {
            if (tweet.comments === undefined) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }

    }

    get getComments() {
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

    get getUser() {
        return this._user;
    }

    set setUser(user) {
        this._user = user;
    }

    addAll(arrayOfTweets) {
        let nonValidateTweets = [];
        for (let tweet of arrayOfTweets) {
            if (Tweet.validate(tweet) === true) {
                this._collectionOfTweets.push(tweet);
            } else {
                nonValidateTweets.push(tweet);
            }
        }
        return nonValidateTweets;
    }

    getPage(skip = 0, top = 10, filterConfig = {}) {
        function sortFunction(a, b) {
            let dateA = new Date(a.getCreatedAt).getTime();
            let dateB = new Date(b.getCreatedAt).getTime();
            return dateA > dateB ? 1 : -1;
        }
        this._collectionOfTweets.sort(sortFunction);
        let arrayFilter = [];
        let end;

        if (skip + top > this._collectionOfTweets.length) {
            end = this._collectionOfTweets.length;
        } else {
            end = skip + top;
        }

        if (filterConfig.author === undefined
            && filterConfig.dateFrom === undefined
            && filterConfig.dateTo === undefined
            && filterConfig.hashtags === undefined
            && filterConfig.text === undefined) {
            return arrayFilter = this._collectionOfTweets.slice(skip, end);
        }

        for (let i = 0, j = 0; i < this._collectionOfTweets.length; i++) {

            if (filterConfig.author !== undefined) {
                if (this._collectionOfTweets[i].getAuthor !== filterConfig.author) {
                    continue;
                }
            }
            if (filterConfig.dateFrom !== undefined) {
                if (this._collectionOfTweets[i].getCreatedAt <= filterConfig.dateFrom) {
                    continue;
                }
            }
            if (filterConfig.dateTo !== undefined) {
                if (this._collectionOfTweets[i].getCreatedAt >= filterConfig.dateTo) {
                    continue;
                }
            }
            if (filterConfig.hashtags !== undefined) {
                if (!this._collectionOfTweets[i].getText.includes(filterConfig.hashtags)) {
                    continue;
                }
            }
            if (filterConfig.text !== undefined) {
                if (!this._collectionOfTweets[i].getText.includes(filterConfig.text)) {
                    continue;
                }
            }
            arrayFilter[j] = this._collectionOfTweets[i];
            j++;
            top--;
            if (top === 0) break;
        }
        return arrayFilter;
    }

    get(id) {
        for (let tweet of this._collectionOfTweets) {
            if (tweet.getId === id)
                return tweet;
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
        let i = this._collectionOfTweets.findIndex(tweet => tweet.getId === id)
        if (i !== -1) {
            if (this._collectionOfTweets[i].getAuthor === this._user) {
                this._collectionOfTweets[i].setText(text);
                if (Tweet.validate(this._collectionOfTweets[i])) {
                    return true;
                }
            }
        }
        return false;
    }

    remove(id) {
        let i = this._collectionOfTweets.findIndex(tweet => tweet.getId === id)
        if (i !== -1) {
            if (this._collectionOfTweets[i].getAuthor === this._user) {
                this._collectionOfTweets.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    addComment(id, text) {
        let i = this._collectionOfTweets.findIndex(tweet => tweet.getId === id);

        if (this.get(id) === undefined) {
            return false;
        }

        let comment = new Comment(identifier, text, this._user);

        if (Comment.validate(comment)) {
            this._collectionOfTweets[i].comments.push(comment);
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
    arrayOfTweets[i] = new Tweet(`${i}`, "HelloWorld #Js #id" + i, "user_" + i);
    arrayOfTweets[i]._createdAt = date.setDate(date.getDate() + 2);
}

let identifier = arrayOfTweets.length;

//проверки
let nonValidTweet1 = new Tweet('', 'egsegeg', '34se');
let nonValidTweet2 = new Tweet('464364', '', '34se');
let nonValidTweet3 = new Tweet('25236526', 'egsegeg', '');
let nonValidTweet4 = new Tweet();
let validTweet1 = new Tweet(identifier, 'Hello hi good morning!', 'anton');
identifier++;
let validTweet2 = new Tweet(identifier, 'Hello hi good morning!', 'boris');
identifier++;
let validTweet3 = new Tweet(identifier, 'Hello hi good morning!', 'kolya');
identifier++;
let colletion1 = new TweetsCollection(arrayOfTweets);
let arr = [nonValidTweet1, nonValidTweet2, nonValidTweet3, validTweet1, nonValidTweet4, validTweet2, validTweet3];
console.log(colletion1);
colletion1.setUser = 'user_0';
console.log(colletion1.getUser);
console.log(colletion1.get('0'));
colletion1.edit('0', 'I edit here');
console.log(colletion1.get('0'));
colletion1.setUser = 'user_1';
colletion1.remove('1');
console.log(colletion1.get('1'));
console.log(colletion1.addAll(arr));