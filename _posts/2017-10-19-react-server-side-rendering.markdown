---
layout: post
title:  "ReactJS - Server Side Rendering"
page-section: Blog
date:   2017-10-19 22:30:00
categories:
- coding
- reactjs
- devlog
- ssr
images: 
- url: /images/blog/2017-10-19-react-server-side-rendering/react-ssr.jpg
  alt: ReactJS - Server Side Rendering
thumbnail:
- url: /images/blog/2017-10-19-react-server-side-rendering/thumb/react-ssr.jpg
  alt: ReactJS - Server Side Rendering
---
<p class="text-center">A NodeJS solution to implement Server Side Rendering in a ReactJS application without any extra framworks.</p>

<!--more-->
![Welcome!](/images/blog/2017-10-19-react-server-side-rendering/react-ssr.jpg)

# Context
Recently I developed an online platform that gathers a list of Portuguese descendent artists from all around the world for [Miraceta Arts](http://mirateca.com/ "Miraceta Arts"). One of the user stories for this project describes the need to provide a comment section for the events that are shown.

The thing is, Facebook loads it's comments asynchronous, and so does AngularJS but they don't work together. The result of this lack of coordination is a blank space in the HTML since Facebook loads everything when the page finishes loading, but not knowing if AngularJS did also. To workaround this issue, it is necessary to combine them.

# Solution
There are several steps needed to solve the problem:

* [Create a Facebook API Key](https://developers.facebook.com/){:target="_blank"}{:rel="external"} for your application;
* Place the provided code from Facebook inside the body tag;
* Make use of AngularJS directives to render the comments section.

### Create a Facebook API Key
There is a simple process to create a API Key:

1. Login to Facebook
2. Access the [Developers Section](https://developers.facebook.com/){:target="_blank"}{:rel="external"}
3. In the **My Apps** menu, click in **Add a New App**, and choose your app platform
4. Provide your app name and choose the category.

### Place Facebook code inside the body tag
In order to initialize the Facebook Javascript SDK, it is necessary to place a specific code block at the begining of the *\<body\>* tag:

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

Have in mind that you must replace *\<YOUR API KEY\>* with the API key provided at the [Facebook developers section](https://developers.facebook.com/ "Facebook developers section"){:target="_blank"}{:rel="external"}, and the *\<lan_LAN\>* with the correct language that will be used for the localization (e.g., "en_EN").

### AngularJS directives to render the comments section
Now that we have the required scripts to use the Facebook API, it is time to create our AngularJS directive for the comments section.
This directive will have other child directive that will be responsible to watch the page status and build the plugin. In order to reuse it, we must define the first directive:

~~~~~~~~
var appDirectives = angular.module('appDirectives');

appDirectives.directive('facebookComments', ['$location', function ($location) {
  return {
      restrict: 'E',
      templateUrl: "scripts/directives/facebookComments.html",
      scope:{},
      replace: true,
      link: function(scope, el, attr){
        scope.curPath = $location.absUrl();
      }
   };
}]);
~~~~~~~~

In the previous code, we are creating a directive as an element *(E)* with a template that will have the child directive. In order to avoid any scope conflicts, this directive will have a isolated one.
The most important part of this code is the link function. As this function will only be executed after finish compiling the directive, here we set the current path through the current absolute URL. This information will be used to inform the Facebook plugin which webpage the comments will be associated to.

The second step consists in the directive template:

~~~~~~~~
{% raw %}
<div class="fb-comments" dyn-fb-comment-box page-href="{{curPath}}" data-numposts="5" data-colorscheme="light" data-width="100%"></div>
{% endraw %}
~~~~~~~~  

In this case, we are going to use this template that will have as attributes the required parameters to initialize the comments plugin. As you can see, we are defining a set of important parameters:

* **curPath** variable from the parent directive scope to inform what will be the URL for the plugin;
* **data-numposts** that will set the number of posts to be shown;
* **data-colorscheme** to set the theme for the plugin;
* **data-width** to 100% to make it responsive.
* Make this div a directive through the **dyn-fb-comment-box** attribute (directive name as attribute - *A*) responsible for the plugin rendering.

With this, it is time to set the child directive:

~~~~~~~~
var appDirectives = angular.module('appDirectives');
appDirectives.directive('dynFbCommentBox',['$timeout', function ($timeout) {
    function createHTML(href, numposts, colorscheme, width) {
        return '<div class="fb-comments" ' +
                       'data-href="' + href + '" ' +
                       'data-numposts="' + numposts + '" ' +
                       'data-colorsheme="' + colorscheme + '" ' +
                       'data-width="' + width + '">' +
               '</div>';
    }

    return {
        restrict: 'A',
        scope: {},
        link: function postLink(scope, elem, attrs) {
          //
          // Use timeout in order to be called after all watches are done and FB script is loaded
          //
          attrs.$observe('pageHref', function (newValue) {
              var href        = newValue;
              var numposts    = attrs.numposts    || 5;
              var colorscheme = attrs.colorscheme || 'light';
              var width = attrs.width || '100%';
              elem.html(createHTML(href, numposts, colorscheme, width));
              $timeout(function () {
                if (typeof FB != 'undefined'){
                    FB.XFBML.parse(elem[0]);
                  }
              });
          });

          
        }
    };
}]);
~~~~~~~~  
<br/>
Let's analyze this directive.
As I stated before, this will be an attribute directive for the sake of simplicity with an isolated scope to avoid any conflicts with the parent. This directive has the purpose to watch/observe the *pageHref* attribute to understand when the page has changed and gather all the necessary information from the directive attributes. Each attribute will then be passed as parameters to the function *createHtml()*

This function will then overwrite the original html with a markup that is more *"Facebook plugin friendly"*, i.e., to be recognized by the Facebook API and render the final script.

In the end, we must call the *FB.XFBML.parse(\<HTML\>)* to force the plugin to render after all the html and scripts finalize all rendering. To do this, the *$timeout()* comes to action. By setting no delay, we can ensure that all the code inside it will be executed after everything finishes. Otherwise, the plugin would render, but since AngularJS is on its digest cycle and still rendering, the result will be a blank space.

I hope this small tutorial will help anyone in need and difficulties with this plugin, and if you have any other better solutions, please share with everyone in the comments section bellow :smiley:.

<br/>
**Resources**   
*Project Repo:* [Github](https://github.com/luisfbmelo/artistasluso){:target="_blank"}{:rel="external"}
