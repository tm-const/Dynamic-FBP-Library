$(window).on('load', function() {
  // Arrays of data points
  let items = [
              'item1',
              'item2'
  ];    
  // Empty array that will have all of the selected products
  let pushMyOrder = [];

  // --------------------------------------------
  // searches for Location through zipcode
  // --------------------------------------------
  function findSomething() {
    for (var i=0; i<zips.length;i++) {
      if (zips[i]) {
        // Variable checks DOM for Zipzodes in zips array
        var countsNum = $('body > div:contains("'+zips[i]+'")').length > 0;
        if (countsNum) {
          // Will switch between each zips[i] condition to check which one is true
          switch (zips[i]) {
            case '33496':
              console.log('Boca Raton');
              fbq('track',  'ViewContent',  {
                content_name:  'Boca Raton',}
              ); 
              break;
            case '32608':
              console.log('Gainesville');
              fbq('track',  'ViewContent',  {
                content_name:  'Gainesville'}
              ); 
              break;
            default:
              console.log('The location you are looking for is not in our system');
          }
          console.log("Is there anything else you'd like?");
          // Once a valid zip code is found we break
          break;
        };
      } else {
        // Will alert that the page does not contain company zipcodes
        console.log("Zipcode Does Not Exist - Is there anything else you'd like?");
      }
    }
  }
  // Checks slug to contain = order/datetime.aspx?
  if(window.location.href.indexOf("order/datetime.aspx") > -1) {
    // Executes the main function to search location zips and locations
    findSomething();
  };

  // --------------------------------------------
  // Function that will check which products have been selected
  // --------------------------------------------
  function myOrderMenu() {
    for (var j=0;j<myOrder.length;j++) {
      var myOrderList = $('.order-list-container > div:contains("'+myOrder[j]+'")').length > 0;
      console.log(myOrderList);
      if (myOrderList) {
        pushMyOrder.push(myOrder[j]);
        console.log(myOrder[j]);
      }       
    }
    console.log(pushMyOrder);

    fbq('trackCustom',  'Menu', {
      content_name: pushMyOrder
    });
  }

  // --------------------------------------------
  // Checkout suggestion code - gets the products and value before checkout
  // --------------------------------------------
  function myOrderSuggestion() {
    for (var s=0;s<myOrder.length;s++) {
      var myOrderCheckout = $('.order-list-container > div:contains("'+myOrder[s]+'")').length > 0;
      console.log(myOrderCheckout);
      if (myOrderCheckout) {
        pushMyOrderCheckout.push(myOrder[s]);
      };
    };

    // Find the value of the total price of the order
    let numbersNum = $('div#ctl00_cph1_orderList_pnlOrder td:last b').html();
    pushTotalPrice.push(numbersNum);
    
    console.log(pushTotalPrice);
    // Shows order in array in console (Check Browser Console)
    console.log(pushMyOrderCheckout);

    fbq('track', 'AddToCart', {
      value: pushTotalPrice,
      currency: 'USD',
      content_name: pushMyOrderCheckout
    });
  };

  if(window.location.href.indexOf("order/suggest.aspx") > -1) {    
    // When Complete Order button is clicked - myOrderSuggestion function fires pixel code and adds data to pixel
    $('#ctl00_cph1_orderList_upnlOrderList').click(function() {
      myOrderSuggestion();
      console.log('Completed!');
    });
  };

  // --------------------------------------------
  // Submit-Order-Bolay-1.aspx | User will submit their card information here
  // --------------------------------------------
  function subnmitCardOrder() {
    // Find the value of the total price of the order
    let submitPrice = $('div#ctl00_cph1_orderList_pnlOrder td:last b').html();
    pushSubmitOrder.push(submitPrice);

    // Will send purchase order to Facebook
    fbq('track', 'Purchase', {
      value: pushSubmitOrder,
      currency: 'USD',
    });
  }

  // --------------------------------------------
  // Window URL match load
  // --------------------------------------------
  if(window.location.href.indexOf("order/submit.aspx") > -1) {    
    // This will track the exact price that the customer is checking out
    console.log("Submit-Order-Page-Bolay!");

    $('a#ctl00_cph1_btnSubmit').click(function() {
      subnmitCardOrder();
      console.log("Completed Total = " + pushSubmitOrder);
    });      
  }

  // --------------------------------------------
  // start button
  // --------------------------------------------
  const fbStartButton = document.getElementsByClassName('fb-start-button');
  [...fbStartButton].forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      fbq('trackCustom', 'StartNow');
      gtag('event', 'conversion', {'send_to': 'AW-**'});
      window.location = e.target.href;
    });
  });

  // --------------------------------------------
  // calculator
  // --------------------------------------------
  const fbPaymentProcessor = document.getElementById('paymentProcessor');
  fbPaymentProcessor && fbPaymentProcessor.addEventListener('change', () => {
    fbq('trackCustom', 'Calculator');
    gtag('event', 'conversion', {'send_to': 'AW-**'});
  })
  
  // --------------------------------------------
  // In this example, we will activate a ViewContent standard event on page load. When someone clicks "Add to Cart" button, we will activate an AddToCart standard event.
  // --------------------------------------------
  // To do this, first load Facebook Pixel code that you want to fire on page load:
  // Facebook Pixel Code
  fbq('track', 'ViewContent', {
    content_name: 'Really Fast Running Shoes',
    content_category: 'Apparel & Accessories > Shoes',
    content_ids: ['1234'],
    content_type: 'product',
    value: 0.50,
    currency: 'USD'
   });
  // End Facebook Pixel Code

  // <button id="addToCartButton">Add To Cart</button>
  // Add Pixel Events to the button's click handler
  var button = document.getElementById('addToCartButton');
  button.addEventListener(
    'click', 
    function() { 
      fbq('track', 'AddToCart', {
        content_name: 'Really Fast Running Shoes', 
        content_category: 'Apparel & Accessories > Shoes',
        content_ids: ['1234'],
        content_type: 'product',
        value: 4.99,
        currency: 'USD' 
      });          
    },
    false
  );

  // --------------------------------------------
  // Triggering events based on page length or percentage
  // --------------------------------------------
  // This first example is to track the length of the page which the user has read. 
  // In the example, we are firing off the lead pixel when user has read up to 500px length of the page.
  var executeWhenReachedPageLength = function(length, callback) {
    if (typeof length !== 'number') {
      console.error(
        'First parameter must be a number, got',
        typeof length,
        'instead',
      );
    }

    if (typeof callback !== 'function') {
      console.error(
        'Second parameter must be a function, got',
        typeof callback,
        'instead',
      );
    }

    function getWindowLength() {
      return window.innerHeight || 
        (document.documentElement || document.body).clientHeight;
    }

    function getCurrentScrolledLengthPosition() {
     return window.pageYOffset || 
       (document.documentElement || document.body.parentNode || document.body).scrollTop;
    }

    var executeCallback = (function() {
      var wasExecuted = false;
      return function() {
        if (!wasExecuted && getCurrentScrolledLengthPosition() > length) {
          wasExecuted = true;
          callback();
        }
      };
    })();

    if (getWindowLength() >= length) {
      callback();
    } else {
      window.addEventListener('scroll', executeCallback, false);
    }
  };

  executeWhenReachedPageLength(10, function() {
    fbq('track', 'Lead');
  });

  // --------------------------------------------
  // This second example is to track the percentage of the page which the user has read.
  // --------------------------------------------
  // In the example, we are firing off the lead pixel when user has read 75% of the page.
  var executeWhenReachedPagePercentage = function(percentage, callback) {
    if (typeof percentage !== 'number') {
      console.error(
        'First parameter must be a number, got',
        typeof percentage,
        'instead',
      );
    }

    if (typeof callback !== 'function') {
      console.error(
        'Second parameter must be a function, got',
        typeof callback,
        'instead',
      );
    }

    function getDocumentLength() {
      var D = document;
      return Math.max(
          D.body.scrollHeight, D.documentElement.scrollHeight,
          D.body.offsetHeight, D.documentElement.offsetHeight,
          D.body.clientHeight, D.documentElement.clientHeight
      )
    }

    function getWindowLength() {
      return window.innerHeight || 
        (document.documentElement || document.body).clientHeight;
    }

    function getScrollableLength() {
      if (getDocumentLength() > getWindowLength()) {
        return getDocumentLength() - getWindowLength();
      } else {
        return 0;
      }
    }

    var scrollableLength = getScrollableLength();

    window.addEventListener("resize", function(){
      scrollableLength = getScrollableLength();
    }, false)

    function getCurrentScrolledLengthPosition() {
     return window.pageYOffset || 
       (document.documentElement || document.body.parentNode || document.body).scrollTop;
    }

    function getPercentageScrolled() {
      if (scrollableLength == 0) {
        return 100;
      } else {
        return getCurrentScrolledLengthPosition() / scrollableLength * 100;
      }
    }

    var executeCallback = (function() {
      var wasExecuted = false;
      return function() {
        if (!wasExecuted && getPercentageScrolled() > percentage) {
          wasExecuted = true;
          callback();
        }
      };
    })();

    if (getDocumentLength() == 0 ||
      (getWindowLength()/getDocumentLength() * 100 >= percentage)) {
      callback();
    } else {
      window.addEventListener('scroll', executeCallback, false);
    }
  };

  executeWhenReachedPagePercentage(75, function() {
    fbq('track', 'Lead');
  });

  // --------------------------------------------
  // Delayed Pixel Fires
  // --------------------------------------------
  // Suppose you want to track users who interact with your website a few seconds before firing a pixel event.
  // You can do this with the setTimeout function.
  // Delay pixel fire by 3 seconds
  var seconds = 3;
  setTimeout(function() {
    fbq('track', 'Lead');
  }, seconds * 1000);

  // --------------------------------------------
  // Triggering events based on articles viewed per session
  // --------------------------------------------
  // If you want to know who viewed a certain number of articles from your site,you can have a session counter and load Facebook pixel code when this occurs.
  // Example counting only for the 6th article viewed
  if (site_request.sessionCountViews == 6) {
    fbq('track', "ViewContent", {
      sessionCountViews: site_request.sessionCountViews,
    });
  }

  // --------------------------------------------
  // Start Timer Syntax
  // --------------------------------------------
  setTimeout( "JavaScript Statements", milliseconds );
  // initialize your variables outside the function var count = 0; var clearTime; var seconds = 0, minutes = 0, hours = 0; var clearState; var secs, mins, gethours ; function startWatch( ) { /* check if seconds is equal to 60 and add a +1 to minutes, and set seconds to 0 */ if ( seconds === 60 ) { seconds = 0; minutes = minutes + 1; } /* you use the javascript tenary operator to format how the minutes should look and add 0 to minutes if less than 10 */ mins = ( minutes < 10 ) ? ( '0' + minutes + ': ' ) : ( minutes + ': ' ); /* check if minutes is equal to 60 and add a +1 to hours set minutes to 0 */ if ( minutes === 60 ) { minutes = 0; hours = hours + 1; } /* you use the javascript tenary operator to format how the hours should look and add 0 to hours if less than 10 */ gethours = ( hours < 10 ) ? ( '0' + hours + ': ' ) : ( hours + ': ' ); secs = ( seconds < 10 ) ? ( '0' + seconds ) : ( seconds ); // display the stopwatch var x = document .getElementById("timer"); x.innerHTML = 'Time: ' + gethours + mins + secs; /* call the seconds counter after displaying the stop watch and increment seconds by +1 to keep it counting */ seconds++; /* call the setTimeout( ) to keep the stop watch alive ! */ clearTime = setTimeout( "startWatch( )", 1000 ); } // startWatch( ) //create a function to start the stop watch 

  // Stop watch ( onClick="stopwatch.start();" ) The StopWatch Object will take several methods - start, reset, stop, lap, clear
  class Stopwatch {
    constructor(display, results) {
      this.running = false;
      this.display = display;
      this.results = results;
      this.laps = [];
      this.reset();
      this.print(this.times);
    }

    reset() {
      this.times = [0, 0, 0];
    }

    start() {
      if (!this.time) this.time = performance.now();
      if (!this.running) {
        this.running = true;
        requestAnimationFrame(this.step.bind(this));
      }
    }

    lap() {
      let times = this.times;
      let li = document.createElement('li');
      li.innerText = this.format(times);
      this.results.appendChild(li);
    }

    stop() {
      this.running = false;
      this.time = null;
    }

    restart() {
      if (!this.time) this.time = performance.now();
      if (!this.running) {
        this.running = true;
        requestAnimationFrame(this.step.bind(this));
      }
      this.reset();
    }

    clear() {
      clearChildren(this.results);
    }

    step(timestamp) {
      if (!this.running) return;
      this.calculate(timestamp);
      this.time = timestamp;
      this.print();
      requestAnimationFrame(this.step.bind(this));
    }

    calculate(timestamp) {
      var diff = timestamp - this.time;
      // Hundredths of a second are 100 ms
      this.times[2] += diff / 10;
      // Seconds are 100 hundredths of a second
      if (this.times[2] >= 100) {
        this.times[1] += 1;
        this.times[2] -= 100;
      }
      // Minutes are 60 seconds
      if (this.times[1] >= 60) {
        this.times[0] += 1;
        this.times[1] -= 60;
      }
    }

    print() {
      this.display.innerText = this.format(this.times);
    }

    format(times) {
      return `\
      ${pad0(times[0], 2)}:\
      ${pad0(times[1], 2)}:\
      ${pad0(Math.floor(times[2]), 2)}`;
    }
  }

  function pad0(value, count) {
    var result = value.toString();
    for (; result.length < count; --count)
    result = '0' + result;
    return result;
  }

  function clearChildren(node) {
    while (node.lastChild)
    node.removeChild(node.lastChild);
  }

  let stopwatch = new Stopwatch(
  document.querySelector('.stopwatch'),
  document.querySelector('.results'));


  // --------------------------------------------
  // Track youtube video status (via Youtube API)
  // --------------------------------------------
  // HTML Syntax for Yvideo
  // <div id='player'></div>

  // <script async>
    // var tag = document.createElement('script');
   
    // tag.src = 'https://www.youtube.com/iframe_api';
    // var firstScriptTag = document.getElementsByTagName('script')[0];
    // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  // </script>

  //set video values
  var video = "9PGfL4t-uqE";
  video.h = "390";
  video.w = "640";
  var player;
  var tag = document.createElement("script");
  tag.src = "http://www.youtube.com/player_api";
  var firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  function onYouTubePlayerAPIReady() {
    player = new YT.Player("player", {
      height: video.h,
      width: video.w,
      videoId: video,
      events: {
        onStateChange: onPlayerStateChange,
        onError: onPlayerError
      }
    });
  }
  function onPlayerStateChange(event) {
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        if (cleanTime() == 0) {
          console.log("started " + cleanTime()); // console logs status
          ga("send", "event", "video", "started", video);
        } else {
          console.log("playing " + cleanTime()); // console logs status
          ga(
            "send",
            "event",
            "video",
            "played",
            "v: " + video + " | t: " + cleanTime()
          );
        }
        break;
      case YT.PlayerState.PAUSED:
        if (player.getDuration() - player.getCurrentTime() != 0) {
          console.log("paused" + " @ " + cleanTime()); // console logs status
          ga(
            "send",
            "event",
            "video",
            "paused",
            "v: " + video + " | t: " + cleanTime()
          );
        }
        break;
      case YT.PlayerState.ENDED:
        console.log("ended "); // console logs status
        ga("send", "event", "video", "ended", video);
        break;
    }
  }

  function onPlayerError(event) {
    switch (event.data) {
      case 2:
        //console.log('' + video.id)
        ga("send", "event", "video", "invalid id", video);
        break;
      case 100:
        ga("send", "event", "video", "not found", video);
        break;
      case 101 || 150:
        ga("send", "event", "video", "not allowed", video);
        break;
    }
  }

  //utility
  function cleanTime() {
    return Math.round(player.getCurrentTime());
  }

  // --------------------------------------------
  // Multi steps form -- PARSLY
  // --------------------------------------------
  // Resources:
  // code.jquery.com/jquery-2.1.3.js
  // cdn.jsdelivr.net/gh/guillaumepotier/Parsley.js@2.9.1/dist/parsley.js
  var $sections = $('.form-section');

  function navigateTo(index) {
    // Mark the current section with the class 'current'
    $sections
      .removeClass('current')
      .eq(index)
        .addClass('current');
    // Show only the navigation buttons that make sense for the current section:
    $('.form-navigation .previous').toggle(index > 0);
    var atTheEnd = index >= $sections.length - 1;
    $('.form-navigation .next').toggle(!atTheEnd);
    $('.form-navigation [type=submit]').toggle(atTheEnd);
  }

  function curIndex() {
    // Return the current index by looking at which section has the class 'current'
    return $sections.index($sections.filter('.current'));
  }

  // Previous button is easy, just go back
  $('.form-navigation .previous').click(function() {
    navigateTo(curIndex() - 1);
  });

  // Next button goes forward iff current block validates
  $('.form-navigation .next').click(function() {
    $('.demo-form').parsley().whenValidate({
      group: 'block-' + curIndex()
    }).done(function() {
      navigateTo(curIndex() + 1);
    });
  });

  // Prepare sections by setting the `data-parsley-group` attribute to 'block-0', 'block-1', etc.
  $sections.each(function(index, section) {
    $(section).find(':input').attr('data-parsley-group', 'block-' + index);
  });
  navigateTo(0); // Start at the beginning

  // --------------------------------------------
  // Call a function after leaving input field -- LEAVE INPUT
  // --------------------------------------------
  function exitField() {
      var x = document.getElementById("elmnt");
      console.log(x.value);
  }
  // OR
  $("input[name="input_email"]").focusout(function(){
      alert("I left the field");
  });
  // OR
  $("#input_email").focusout(function(){
    alert("I left the field");
  });

  // --------------------------------------------
  // Validating email addresses -- VALIDATE INPUT EMAIL 
  // --------------------------------------------
  // Requirements:
  // cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
  // cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.1/jquery.validate.min.js

  // Validation Methods:
  // required – Makes the element required.
  // remote – Requests a resource to check the element for validity.
  // minlength – Makes the element require a given minimum length.
  // maxlength – Makes the element require a given maximum length.
  // rangelength – Makes the element require a given value range.
  // min – Makes the element require a given minimum.
  // max – Makes the element require a given maximum.
  // range – Makes the element require a given value range.
  // step – Makes the element require a given step.
  // email – Makes the element require a valid email
  // url – Makes the element require a valid url
  // date – Makes the element require a date.
  // dateISO – Makes the element require an ISO date.
  // number – Makes the element require a decimal number.
  // digits – Makes the element require digits only.
  // equalTo – Requires the element to be the same as another one
  // ADDON Features:---------------------------------------------
  // accept – Makes a file upload accept only specified mime-types.
  // creditcard – Makes the element require a credit card number.
  // extension – Makes the element require a certain file extension.
  // phoneUS – Validate for valid US phone number.
  // require_from_group – Ensures a given number of fields in a group are complete.
  var form = $( "#myform" );
  form.validate();
  $( "button" ).click(function() {
    console.log( "Valid: " + form.valid() );
  });

  // --------------------------------------------
  // Validating email addresses -- VALIDATE INPUT PHONE
  // --------------------------------------------
  // Requirements:
  // <link rel="stylesheet" href="https://jqueryvalidation.org/files/demo/site-demos.css">
  // <script src="https://code.jquery.com/jquery-1.11.1.min.js"></script>
  // <script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/jquery.validate.min.js"></script>
  // <script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/additional-methods.min.js"></script>
  jQuery.validator.setDefaults({
    debug: true,
    success: "valid"
  });
  $( "#myform" ).validate({
    rules: {
      field: {
        required: true,
        phoneUS: true
      }
    }
  });

  // --------------------------------------------
  // Calculate Scroll Percentage
  // --------------------------------------------
  function amountscrolled(){
    var winheight= window.innerHeight || (document.documentElement || document.body).clientHeight
    var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
    var trackLength = winheight
    var pctScrolled = Math.floor(scrollTop/trackLength * 10 *2) // gets percentage scrolled (ie: 80 or NaN if tracklength == 0)
    console.log(pctScrolled + '% scrolled')
    if ( pctScrolled >= 50) {
      console.log("FBQ - Facebook Pixel Fire Here Demo")
    }
  }

  window.addEventListener("scroll", function(){
      amountscrolled()
  }, false)

  // *----------------------------------------
  // Refernce Vimeo API:
  // https://github.com/vimeo/player.js/blob/master/README.md#getduration-promisenumber-error
  // *----------------------------------------
  var iframe = document.querySelector('iframe');
  var player = new Vimeo.Player(iframe);

  player.on('play', function() {

    var timesRun = 0;
    var interval = setInterval(function(){
      player.getDuration().then(function(duration) {
        player.getCurrentTime().then(function(seconds) {

          if (seconds <= duration) {
            // seconds = the current playback position
            let ioTime = Math.trunc(seconds);
            if (ioTime == 5) {
              console.log("Fire here at: " + Math.trunc(seconds) +" seconds");
            }
            console.log(seconds);
          }

          // Stops interval - if timesRun equals duration count
          timesRun += 1;
          if(timesRun === duration){
            console.log("End Video")
            clearInterval(interval);
          }
        }).catch(function(error) {
          // an error occurred
        });
      }).catch(function(error) {
          // an error occurred
      });
    }, 1000);

    console.log('played the video!');
  };

  // *----------------------------------------
  // WebinarJAM HTML 5 Video Duration Tracking
  // *----------------------------------------
  document.getElementById("user_start_broadcast_overlay").addEventListener("click", function() {
    setInterval(function(){ 
      let innerTXTT = document.querySelector('.vjs-current-time-display .vjs-control-text');
      innerTXTT.innerText = innerTXTT.innerText.replace("Current Time","");
      let vid = document.querySelector(".vjs-current-time-display").innerText;

      vid = vid.replace(/:/g,''); // remove ":" from string

      // Tracking time settings
      let toNumbersSaw50Pct = '03000';
      let toNumbersSawCTA = '05000';

      // Current video Duration
      let st = vid.trim();

      // Tracking execution conditions
      if (st === toNumbersSaw50Pct ) {
        console.log("Fire At: 0:30:00");
        // fbq('trackCustom', 'Saw50Pct');
      }

      if (st === toNumbersSawCTA ) {
        console.log("Fire At: 0:50:00");
        // fbq('trackCustom', 'SawCTA');
      }

    }, 1000);
  });

  // *----------------------------------------
  // Facebook VIdeo API : Track Video Duration
  // *----------------------------------------
  // <script>
window.fbAsyncInit = function() {
  FB.init({
    appId      : 'APP-ID-Number',
    xfbml      : true,
    version    : 'v3.2'
  });
  let my_video_player;
  FB.Event.subscribe('xfbml.ready', function(msg) {
    if (msg.type === 'video') {
      my_video_player = msg.instance;
    }
    my_video_player.play();
    my_video_player.unmute();
    let myEventHandlerStartPlay = my_video_player.subscribe('startedPlaying', function(e) {
      const fullVideoDuration = Math.floor( my_video_player.getDuration()  / 60 );
      let interval = setInterval(function(){
        const time = new Date(null);
        time.setSeconds( my_video_player.getCurrentPosition() );
        let minutes = time.getMinutes() + "" +time.getSeconds();
        if (minutes == 1650) {
          fbq('trackCustom', 'Viewed50');
        }
        if (minutes == 260) {
          fbq('trackCustom', 'SawCTA');
        }
        if (minutes == 3259) {
          clearInterval(interval);
        }
        let myEventHandler = my_video_player.subscribe('paused', function(e) {
          clearInterval(interval);
        });
      }, 1000);
    });
  });
};
  // </script>
  // <style type="text/css">
  //   .elCustomJS_code {
  //     display: -webkit-box;      
  //     display: -moz-box;         
  //     display: -ms-flexbox;      
  //     display: -webkit-flex;     
  //     display: flex;             
  //     justify-content: center;
  //   }
  // </style>
  // <div id="fb-root"></div>
  // <script async defer src="https://connect.facebook.net/en_US/sdk.js"></script>
  // <div style="background:url('https://scontent-sea1-1.xx.fbcdn.net/v/t15.5256-10/p180x540/67687689_2431646303622375_1399409441501085696_n.jpg?_nc_cat=106&_nc_oc=AQlmC3FvXXoGu3YCjbg6C-eaJe3FsPeV4OGx1nEKmdI8ZrSF2DdOTRiYMpwPsypZuMo&_nc_ht=scontent-sea1-1.xx&oh=91ff32a11d0e572bc741b03f457c7414&oe=5DEFCA45');background-size:cover;background-position: center;background-repeat: no-repeat;width:900px;" 
  //   class="fb-video" 
  //   data-href="https://www.facebook.com/FCIFranchiseOpp/videos/Video-ID/" 
  //   data-width="900"
  //   data-allowfullscreen="true"
  //   data-controls="false"></div>

});



// *----------------------------------------
// Scroll Percentage
// *----------------------------------------

var executeWhenReachedPagePercentage = function(percentage, callback) {
    if (typeof percentage !== 'number') {
      console.error(
        'First parameter must be a number, got',
        typeof percentage,
        'instead',
      );
    }

    if (typeof callback !== 'function') {
      console.error(
        'Second parameter must be a function, got',
        typeof callback,
        'instead',
      );
    }

    function getDocumentLength() {
      var D = document;
      return Math.max(
          D.body.scrollHeight, D.documentElement.scrollHeight,
          D.body.offsetHeight, D.documentElement.offsetHeight,
          D.body.clientHeight, D.documentElement.clientHeight
      )
    }

    function getWindowLength() {
      return window.innerHeight || 
        (document.documentElement || document.body).clientHeight;
    }

    function getScrollableLength() {
      if (getDocumentLength() > getWindowLength()) {
        return getDocumentLength() - getWindowLength();
      } else {
        return 0;
      }
    }

    var scrollableLength = getScrollableLength();

    window.addEventListener("resize", function(){
      scrollableLength = getScrollableLength();
    }, false)

    function getCurrentScrolledLengthPosition() {
     return window.pageYOffset || 
       (document.documentElement || document.body.parentNode || document.body).scrollTop;
    }

    function getPercentageScrolled() {
      if (scrollableLength == 0) {
        return 100;
      } else {
        return getCurrentScrolledLengthPosition() / scrollableLength * 100;
      }
    }

    var executeCallback = (function() {
      var wasExecuted = false;
      return function() {
        if (!wasExecuted && getPercentageScrolled() > percentage) {
          wasExecuted = true;
          callback();
        }
      };
    })();

    if (getDocumentLength() == 0 ||
      (getWindowLength()/getDocumentLength() * 100 >= percentage)) {
      callback();
    } else {
      window.addEventListener('scroll', executeCallback, false);
    }
  };

  executeWhenReachedPagePercentage(25, function() {
    fbq('trackCustom', '25PS', {
      content_name: 'flc, salespage',
    });
  });
  executeWhenReachedPagePercentage(50, function() {
    fbq('trackCustom', '50PS', {
      content_name: 'flc, salespage',
    });
  });
  executeWhenReachedPagePercentage(75, function() {
    fbq('trackCustom', '75PS', {
      content_name: 'flc, salespage',
    });
  });
  executeWhenReachedPagePercentage(90, function() {
    fbq('trackCustom', '100PS', {
      content_name: 'flc, salespage',
    });

  });

// *----------------------------------------
// Refernce Vimeo API:
// https://github.com/vimeo/player.js/blob/master/README.md#getduration-promisenumber-error
// *----------------------------------------


<script charset="ISO-8859-1" src="//fast.wistia.com/assets/external/E-v1.js" async></script>
<style>#height-of-video{width:100%;max-width:840px;height:470px}@media all and (max-width:767px){#height-of-video{height:470px}}@media all and (max-width:567px){#height-of-video{height:300px!important}}@media all and (max-width:487px){#height-of-video{height:280px!important}}@media all and (max-width:378px){#height-of-video{height:220px!important}}</style>
<div id="height-of-video" class="wistia_embed wistia_async_WISTIA_ID_HERE autoPlay=true" style="margin:0 auto;background:url('');background-position:center;background-size:cover;background-repeat:no-repeat;">&nbsp;</div>
<script>
  window._wq = window._wq || [];
  _wq.push({ id: "zlljan5es0", onReady: function(video) {


  let videoFullDuration = '02:04:33';
   let contet_name = 'chase diamond, vsl';
   let sawCTA = 1477;
   let attended = 60;

    String.prototype.toHHMMSS = function () {
      var sec_num = parseInt(this, 10); // don't forget the second param
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      return hours+':'+minutes+':'+seconds;
    }
    let videoFullDuration = '02:04:33';
    let a = videoFullDuration.split(':');
    let total = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

   let Viewed25 = total / 4;
   let Viewed50 = total / 2;
   let Viewed75 = Viewed25 * 3;
   let n99Percent1 = total*.95;
   let n99Percent2 = total - n99Percent1;
   let Viewed95 =  total - n99Percent2;
   let v25=Math.floor(Viewed25);let num25=v25.toString();
   let v50=Math.floor(Viewed50);let num50=v50.toString();
   let v75=Math.floor(Viewed75);let num75=v75.toString();
   let v95=Math.floor(Viewed95);let num95=v95.toString();
   let numCTA=sawCTA.toString();
   let numATT=attended.toString();

  console.log('Total Video Duration : ' + videoFullDuration);
  console.log('Viewed_25 will trigger at : ' + num25.toHHMMSS());
  console.log('Viewed_50 will trigger at : ' + num50.toHHMMSS());
  console.log('Viewed_75 will trigger at : ' + num75.toHHMMSS());
  console.log('Viewed_95 will trigger at : ' + num95.toHHMMSS());
  console.log('-------------------------' );
  console.log('SawCTA will trigger at : ' + numCTA.toHHMMSS());
  console.log('Attended will trigger at : ' + numATT.toHHMMSS());
  console.log('-------------------------' );

  video.bind('secondchange', function(s) {
   console.log("Seconds:" + s);
    if (s === v25) {
      fbq('trackCustom', 'Viewed25', 
        {content_name: contet_name});
    }
    if (s === v50) {
      fbq('trackCustom', 'Viewed50', 
        {content_name: contet_name});
    }
    if (s === v75) {
      fbq('trackCustom', 'Viewed75', 
        {content_name: contet_name});
    }
    if (s === v95) {
      fbq('trackCustom', 'Viewed95', 
        {content_name: contet_name});
    }
    // CTAs
    if (s === sawCTA) {
    fbq('trackCustom', 'SawCTA', 
        {content_name: contet_name});
    }
    if (s === attended) {
    fbq('trackCustom', 'Attended', 
        {content_name: contet_name});
    }
    // CTAs
  });
  wistiaPlaylist.currentVideo().play()
  }});
</script>




