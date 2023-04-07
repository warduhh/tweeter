/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
  //toggles the text area to appear when you click on 'Write a new tweet'
  $(".chevron").on("click", function () {
    $('.new-tweet').toggle();
    $('#tweet-text').focus();
  });

  //escape function takes in a string and sets the HTML contained within the element to to prevent XSS 
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  //createTweetElement function takes in a tweet object and is responsible for returning a tweet
  const createTweetElement = function (tweet) {
    // element containing the entire HTML structure of the tweet
    const $tweet = `
     <div class="box">
    <article class="article">
    <header class="old-tweet-header">
      <span class="name-container">
        <img class="avatar-container" 
        src="${tweet.user.avatars}">
        <p class="name">${tweet.user.name}</p>
      </span>
      <p class="handle">${tweet.user.handle}</p>
    </header> 
    <div class="content">${escape(tweet.content.text)}</div>
    <footer class="old-tweet-footer">
      <h5>${timeago.format(tweet.created_at)}</h5>
      <div class="post-reaction">
        <i class="fa-solid fa-flag"></i>
        <i class="fa-solid fa-retweet"></i>
        <i class="fa-solid fa-heart"></i>
      </div>
    </footer>
    </article>
    </div>`;
    return $tweet;
  };

  //renderTweets function takes in an array of tweet objects and then appending each one to the container
  const renderTweets = function (tweets) {
    // loops through tweets
    for (let tweet of tweets) {
      // calls createTweetElement for each tweet
      const $tweet = createTweetElement(tweet);
      // takes return value and appends it to the tweets container
      $('.old-tweets').prepend($tweet);
    }
  };

  const renderLatestTweet = function (tweets) {
    let lastTweet = tweets[tweets.length - 1];
    const $lastTweetElement = createTweetElement(lastTweet);
    $('.old-tweets').prepend($lastTweetElement);
  };


  function handlingTextError(text) {
    let flag = true;
    if (!text) {
      $('.new-tweet-error').text("❗Text is empty❗");
      $('.new-tweet-error').slideDown();
      flag = false;
    } else if (text.length > 140) {
      $('.new-tweet-error').text("❗Text is too many characters; limit 140 characters❗");
      $('.new-tweet-error').slideDown();
      flag = false;
    } else {
      $('.new-tweet-error').slideUp();
    }
    return flag;
  }
  // event listener that listens for when text changes
  $('#tweet-text').on("input", function () {
    const text = $(this).val();
    handlingTextError(text);
  });

  // event listener that listens for the submit event
  $('form').submit(function (event) {
    event.preventDefault();
    const text = $(`#tweet-text`).val();
    let flag = handlingTextError(text);
    if (flag) {
      // Serializes the form data
      const data = $(this).serialize();
      //sends the form data to the server as a query string.
      $.ajax({
        type: "POST",
        url: "/tweets",
        data: data,
      }).then(() => {
        //clears the textarea and resets the counter
        $('#tweet-text').val("");
        $('.counter').text(140);
        loadLatestTweet();
      });
    }
  });

  const loadLatestTweet = () => {
    $.ajax({
      url: "/tweets",
      success: "success",
    }).then((tweets) => {
      renderLatestTweet(tweets);
    });
  };

  // loadtweets function will use jQuery to make a request to /tweets and receive the array of tweets as JSON.
  const loadTweets = () => {
    $.ajax({
      url: "/tweets",
      success: "success",
    }).then((tweets) => {
      loadedTweets = tweets;
      renderTweets(tweets);
    });
  };

  loadTweets();
});