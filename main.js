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


  
  // *----------------------------------------
  // Wistia VIdeo API : Track Video Duration
  // *----------------------------------------

  // <script charset="ISO-8859-1" src="//fast.wistia.com/assets/external/E-v1.js" async></script>
  // <div class="wistia_embed wistia_async_VIDEO-ID autoPlay=true" style="width:640px;height:360px;margin:0 auto;background:url('https://embedwistia-a.akamaihd.net/deliveries/8c91fe5b1a7a01652d06cde6463c31dbb5245857.jpg');background-position:center;background-size:cover;background-repeat:no-repeat;">&nbsp;</div>
  // <script>

  window._wq = window._wq || [];
  
  // target our video by the first 3 characters of the hashed ID
  _wq.push({ id: "VIDEO-ID", onReady: function(video) {

    video.bind('secondchange', function(s) {
      
      if (s === 10) {
        // Insert code to do something amazing here
        console.log("We just reached " + 10 + " Seconds!");
      }
      
      if (s === 720) {
        // Insert code to do something amazing here
        console.log("We just reached " + 12 + " Minutes!");
      }
      
    });
    
    wistiaPlaylist.currentVideo().play()
  }});

  // </script>

  // *----------------------------------------
  // Localstorage : Store Username is check if user has visited the website
  // *----------------------------------------

  if(localStorage.getItem("username")) {
    console.log(localStorage.getItem("username"))
      // Fire code here
  } else {
    // Fire code here
  }  

  // *----------------------------------------
  // Countdown 5 minute timer 
  // *----------------------------------------

  function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
      minutes = parseInt(timer / 60, 10)
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.innerHTML = "<div class='container-s'><ul style='padding:0!important;margin:0;'><li><span id='minutes'>" + minutes + "</span>Minutes</li><li><span id='seconds'>" + seconds + "</span>Seconds</li></ul></div>";

      if (--timer < 0) {
          timer = duration;
      }
    }, 1000);
  }
  var fiveMinutes = 60 * 5,
      display = document.querySelector('#time-two');
  startTimer(fiveMinutes, display);
  
  // *----------------------------------------
  // Javascript detect a mobile device
  // *----------------------------------------
  
  // -----------------
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
   // some code..
  }
  // -----------------
  
  // -----------------
  // Or you can combine them both to make it more accessible through jQuery...
  $.browser.device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
  //   Now $.browser will return "device" for all above devices
  //   Note: $.browser removed on jQuery v1.9.1. But you can use this by using jQuery migration plugin Code
  // -----------------
  
  // -----------------
  //   A more thorough version:
  var isMobile = false; //initiate as false
  // device detection
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
      isMobile = true;
  }
  // -----------------
  
  // -----------------
  // Utilized previously mentioned sequielo solution and added the function for width/height 
  // check (to avoid screen rotation mistake). For selecting min/max borders for mobile viewport, 
  // I use this resource https://www.mydevice.io/#compare-devices
  // -----------------
  function isMobile() {
      try{ document.createEvent("TouchEvent"); return true; }
      catch(e){ return false; }
  }

  function deviceType() {
      var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),screenType;
      if (isMobile()){
          if ((width <= 650 && height <= 900) || (width <= 900 && height <= 650))
              screenType = "Mobile Phone";
          else
              screenType = "Tablet";
      }
      else
          screenType = "Desktop";
    return screenType;
  }
  
});
