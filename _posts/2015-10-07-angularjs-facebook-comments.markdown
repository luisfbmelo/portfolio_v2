---
layout: post
title:  "AngularJS - Implementing Facebook Comments plugin"
page-section: Blog
date:   2015-10-07 21:24:00
categories:
- coding
- angularjs
images: 
- url: /images/blog/2015-07-29-welcome/welcome.jpg
  alt: Welcome
thumbnail:
- url: /images/blog/2015-07-29-welcome/thumb/welcome_thumb.jpg
  alt: Welcome
---
<p class="text-center">I'm here to present to you a problem and solution that I encountered in my latest project, implementing Facebook Comments.</p>

<!--more-->
![Welcome!](/images/blog/2015-07-29-welcome/welcome.jpg)

#Context
Recently I developed an online platform that gathers a list of Portuguese descendent artists from all around the world for [Miraceta Arts](http://mirateca.com/ "Miraceta Arts"). One of the user stories for this project describes the need to provide a comment section for the events that are shown.

The thing is, Facebook loads it's comments asynchronous, and so does AngularJS but they don't work together. The result of this lack of coordination is a blank space in the HTML since Facebook loads everything when the page finishes loading, but not knowing if AngularJS did also. To workaround this issue, it is necessary to combine them.

#Solution
There are several steps needed to solve the problem:

* [Create a Facebook API Key](https://developers.facebook.com/){:target="_blank"}{:rel="external"} for your application;
* Place the provided code from Facebok inside the body tag;
* Make use of AngularJS directives in order to force the plugin load.

###Create a Facebook API Key
There is a simple process to create a API Key:

1. Login to Facebook
2. Access the [Developers Section](https://developers.facebook.com/){:target="_blank"}{:rel="external"}
3. In the **My Apps** menu, click in **Add a New App**, and choose your app platform
4. Provide your app name and choose the category.

###Place Facebook code inside the body tag
In order to initialize the Facebook Javascript SDK, it is necessary to place a specific code block at the begining of the *<body>* tag:

~~~~~~~~
<!--FACEBOOK SDK-->
<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '<YOUR API KEY>',
      xfbml      : true,
      version    : 'v2.4'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/<lan_LAN>/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script>
<!--END FACEBOOK-->
~~~~~~~~