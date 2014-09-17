YAAH.js
======
---
__Yet Another Ajax Helper__ (pronounced [Yaah!](http://goo.gl/P4BzG4))

YAAH helps to easily handle:

* simple ajax requests
* infinite load more
* content lazy loader
* url rewrite on ajax and history (>=IE 10)
---

Dependencies
------------
Needs `jQuery`, `Modernizr`

How to
------
`class="yaah-js"`: Bind the event to the desired element  
`data-ya-href`: Link to the content to insert (can be href if the element is an a)

Options
-----------
#### Triggers: `data-ya-trigger` 
>  - `always`: Always trigger the request (default)
>  - `once`: Trigger the request one time only
>  - `autoload`: Autoload the request on DOMReady
>  - `submit`: Submit Form in AJAX
>  - `scroll`: Autoload on scroll
 
#### Location:  `data-ya-location`
> - `replace` Replace the element
> - `after`: Place after element
> - `before`: Place before element
> - `inner`: Place inside element
> - `remove`: Remove element

#### Target: `data-ya-target`
> - `#CSS .Selector`: Can be whatever CSS Selector you like but most of the time you'll want it unique. If empty, clicked element.

#### Redirect `data-ya-redirect`
> - `http://path/to/url`: Redirect after AJAX to the url (page reload)

#### Confirm `data-ya-confirm`
> - `JavaScript! Do you speak it ?`: Display the message in a confirm box, trigger AJAX on confirm only.

#### Url Update History `data-ya-pushstate`
> - `url/to/push`: url to push to the history

#### AJAX Request Data `data-ya-post`
> - `serializedData`: String of serialized data to pass to the AJAX request


To Do
-----
* Scroll
* Touch support
