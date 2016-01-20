---
layout: post
title:  "AngularJS SEO with PHP"
page-section: Blog
date:   2015-12-04 21:24:00
categories:
- coding
- angularjs
- devlog
- seo
images: 
- url: /images/blog/2015-12-04-angularjs-seo-with-php/angular-seo.jpg
  alt: AngularJS and Facebook comments
thumbnail:
- url: /images/blog/2015-12-04-angularjs-seo-with-php/thumb/angular-seo.jpg
  alt: AngularJS and Facebook comments
---
<p class="text-center" markdown="1">
As a continuity of my last post about [Facebook Comments with AngularJS](http://luisfbmelo.com/blog/2015/10/31/angularjs-facebook-comments/ "Facebook Comments with AngularJS"), I present you a very common situation when developing a SPA (Single Page Application), **SEO**.
</p>

<!--more-->
![AngularJS SEO with PHP](/images/blog/2015-12-04-angularjs-seo-with-php/angular-seo.jpg)

#Context
When developing a SPA, the information provided in the HTML has to be requested via AJAX with Javascript. This has great advantages, such as client-side rendering, avoid page refresh, amazing flexibility with DOM manipulation, web components, and so on. But with this paradise comes a curse. At the time of this post, web crawlers are still unable to render Javascript (except Google as far as I know) and as a result, they can not read any content that makes your web app amazing and if this happens, we start facing some major SEO issues.

But why not, you ask? Well, if you have used AngularJS before you noticed the "#" character that shows up in the URL. This symbol is known as "fragment identifier" and the first intend when the internet showed up was to create anchors for links within a webpage, but now is also used to prevent page reload when dealing with AJAX-based webpages. 

Let's say that you have a user profile page that you want to be able to share on Facebook, Twitter or other platform. These crawlers make use of metatags to retrieve the necessary data to display in those platforms and since we are using AngularJS, the most probable way of achieving this is by using the expression syntax **\{\{ foo_bar \}\}**. As I said before, crawlers are unable to render Javascript and this is what will happen, e.g, in Facebook:

![Screwed up information from Facebook crawler](/images/blog/2015-12-04-angularjs-seo-with-php/screwed_post.png)
<p class="text-center" markdown="1" style="padding-bottom:20px;">
*From [StackOverflow](http://stackoverflow.com/questions/32380547/angularjs-spa-and-linking-from-social-media){:target="_blank"}{:rel="external"}*
</p>

Fear not, there are several solutions that can help you create a SEO Friendly SPAs.

*Note: this article is focused on a **PHP solution** since my projects are stored in **shared hosting** and I'm unable to install NodeJS or other specific technology that is not provided by the host.*

#Solution
The solution is in providing static "snapshots" of your html with all content ready to be shown. That is why server-side rendered webpages don't have this problem since it is all provided on each page load. In this example I will explain to you how this can be achieved with PHP (take a look also at the [PhantomJS Solution](http://www.yearofmoo.com/2012/11/angularjs-and-seo.html){:target="_blank"}{:rel="external"} for an automated solution, but that can not be applied in this example development environment).

There are several steps needed to solve the problem:

* Set AngularJS to use crawler friendly URLs in order to "contact" the server first as a hub;
* Configure Apache (.htaccess) to redirect all requests that come from crawlers;
* Request the content from the API and provide the filled HTML.

###Set AngularJS to use crawler friendly URLs
Right now, AngularJS is using the hash to provide content via Ajax. In order to start making direct *HTTP* requests to the server, we must activate the *HTML5* mode and start using *pushState*.

~~~~~~~~
var app = angular.module('myapp', []);

app.config(['$locationProvider', function($locationProvider) {

  //
  // Remove hash and use pushState
  //
  $locationProvider.html5Mode(true);

}]);
~~~~~~~~

By enabeling *HTML5* mode, the app will start making use of the *HTML5 History API* in order to provide nagivation between pages using URLs like **www.myapp.com/app-page** without any page reload.

Don't forget also to place the **<base href="/">** tag next to the **head** of your webpage, since the base URL is  used to resolve all relative URLs throughout the application regardless of the entry point into the app, unless you configure *$locationProvider* to not require a base tag by passing a definition object with *requireBase:false* to *$locationProvider.html5Mode()*:

~~~~~~~~
$locationProvider.html5Mode({
  enabled: true,
  requireBase: false
});
~~~~~~~~

So now we must take care of the requests server-side.

###Configure Apache
Since AngularJS now provides "normal" URLs (without the fragment identifier) and therefore, it is necessary to prepare it to respond.

*Before doing this, have in mind that there is necessary to have **mod_rewrite, mod_proxy and mod_proxy_http** modules installed on your web server.*

First of all, you need to specify what will be your main webpage for a normal user (non-crawler):

~~~~~~~~
<ifModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !index
  RewriteRule (.*) index.html [L]
</ifModule>
~~~~~~~~

What we are doing here is creating a set of rules, rewrite rules, that verifies if the request has the destination of a non-existing file, directory (line 3 and 4) in order to allow access to real files and checks if the request URL is different from "index".

If these conditions are not met, then redirect to index.html will happen, were our SPA is runnable. This way, we ensure that every *HTTP* request will redirect to the SPA and not to other file in the server if not intended.

Now that we have the app runing, we must check if the *HTTP* request comes from a crawler:

~~~~~~~~
RewriteCond %{HTTP_USER_AGENT} (facebookexternalhit/[0-9]|Twitterbot|Pinterest|Google.*snippet|Google)
RewriteRule myapp/page/(\d*)$ http://www.myapp.net/snapshots/page.php?id=$1 [P]
~~~~~~~~

In the first line, we have the ability to understand if the request comes from Facebook, Twitter, Pinterest or even Google. When true, we are able to write a set of rules that will provide information from a PHP file according to the requested URL. 
In the second line, by using the [P] we are also informing Apache to use a mod_proxy module, i.e., access page.php without the crawler knowing that a redirection has occured.

With this set up, we will have this **.htaccess** file:

~~~~~~~~
<ifModule mod_rewrite.c>
   RewriteEngine On

  # allow social media crawlers to work by redirecting them to a server-rendered static version on the page
  RewriteCond %{HTTP_USER_AGENT} (facebookexternalhit/[0-9]|Twitterbot|Pinterest|Google.*snippet|Google)
  RewriteRule myapp/page/(\d*)$ http://www.myapp.com/snapshots/page.php?id=$1 [P]

  RewriteCond %{HTTP_USER_AGENT} (facebookexternalhit/[0-9]|Twitterbot|Pinterest|Google.*snippet|Google)
  RewriteRule myapp/page2/(\d*)$ http://www.myapp.com/snapshots/page2.php?id=$1 [P]

  ...

  # Required to allow direct-linking of pages so they can be processed by Angular
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !index
  RewriteRule (.*) index.html [L]
</ifModule>
~~~~~~~~

Now we can prepare our PHP files to retrieve the necessary information.

###Provide the HTML
Assuming that you are using an API to get data, we are able to reuse it with the back-end script just like AngularJS does. Let's have an example of a profile page:

~~~~~~~~
<?php
$API = 'http://www.myapp.com/api/';
$siteRoot = 'http://www.myapp.com/';
$imagesUrl = 'http://www.myapp.com/images/';

$jsonData = getData($API);
makePage($jsonData, $siteRoot, $imagesUrl);

// Request data from the API
function getData($api) {
    $id = (isset($_GET['id']) && ctype_digit($_GET['id'])) ? $_GET['id'] : 1;
    $rawData = file_get_contents($api.'users/'.$id);
    return json_decode($rawData);
}

// Prepare variables for HTML
function makePage($data, $siteRoot, $imagesUrl) {
    $imageUrl = $imagesUrl . $data->image->url;
    $pageUrl = $siteRoot . "user/details/" . $data->id;
    $title = 'User - '.$data->name;
    $description = strip_tags($data->description);
?>
~~~~~~~~

We start by defining all paths necessary to make the requests and print some specific data. After this, a request for the necessary data is executed through the API and the variables that will be used in our HTML are prepared.

Now let's fill the HTML:

~~~~~~~~
<!DOCTYPE html>
<html>
<head>
  <base href="/">
  <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no">
    <title>My App</title>

    <!--META-->
    <!--facebook-->
    <meta property="fb:app_id" content="{YOUR_APP_KEY}">
    <meta property="fb:admins" content="{YOUR_ADMIN_KEY}"/>

    <!--SEO-->
    <meta name="description" content="<?php echo $description; ?>">
    <meta name="keywords" content="">
    <meta name="author" content="My App">

    <!-- Schema.org markup for Google+ -->
    <meta itemprop="name" content="<?php echo $title; ?>">
    <meta itemprop="description" content="<?php echo $description; ?>">
    <meta itemprop="image" content="<?php echo $imageUrl; ?>">

    <!-- Twiter Cards -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:site" content="@myapp"> 
    <meta name="twitter:title" content="<?php echo $title; ?>">
    <meta name="twitter:description" content="<?php echo $description; ?>">
    <meta name="twitter:image:src" content="<?php echo $imageUrl; ?>">
    <!--/ Twiter Cards -->

    <!-- Open Graph -->
    <meta property="og:site_name" content="My App">
    <meta property="og:type" content="website">
    <meta property="og:title" content="<?php echo $title; ?>" />
    <meta property="og:url" content="<?php echo $pageUrl; ?>">
    <meta property="og:description" content="<?php echo $description; ?>">
    <meta property="og:image" content="<?php echo $imageUrl; ?>">
    <!--/ Open Graph -->

</head>
<body>
  <img src="<?php echo $imageUrl; ?>">
  <h1><?php echo $title; ?></h1>
  <p><?php echo $description; ?></p>      
</body>
</html>
~~~~~~~~

In this example I provide the most common meta tags for the digital social media crawlers. Since Google crawler also gives a lot of relevance to content, it is equaly essencial to fill the body tag with the right semantic and information, boosting your rating and providing credibility to the crawler.

#Lets test this out
With everything set up, it is time to see if this solution is really working. There are tools online that provide some kind of validation:

* [Facebook Open Graph Object Debugger](https://developers.facebook.com/tools/debug/){:target="_blank"}{:rel="external"}
* [Twitter Card Validator](https://dev.twitter.com/docs/cards/validation/validator){:target="_blank"}{:rel="external"}
* [Pinterest Rich Pin Validator](https://developers.pinterest.com/rich_pins/validator/){:target="_blank"}{:rel="external"}
* [Google Structured Data Testing tool](http://www.google.com/webmasters/tools/richsnippets){:target="_blank"}{:rel="external"}

Have in mind that this is a final solution, and there are other alternatives that could suit you better and automate this process.
It is a major drawback that crawlers are still not ready to deal with these technologies that are transforming the internet and for now, we have to deal with it. Have also look at other solutions such as [Prerender.io](https://prerender.io/){:target="_blank"}{:rel="external"} or [PhantomJS](http://phantomjs.org/){:target="_blank"}{:rel="external"}.

If you have other ideas and solutions, please be free to share because this is a problem that will chase us for a while.