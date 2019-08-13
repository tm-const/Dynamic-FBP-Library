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
  //   var tag = document.createElement('script');
   
  //   tag.src = 'https://www.youtube.com/iframe_api';
  //   var firstScriptTag = document.getElementsByTagName('script')[0];
  //   firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
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

});