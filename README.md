YAAH.js v0.2
======
---
__Yet Another Ajax Helper__ (pronounced [Yaah!](http://goo.gl/Nu36Fl) or just [Ya!](http://goo.gl/P4BzG4))

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
`data-ya-href`: Link to the content to insert (can be href if the element is an anchor)

Options
-----------
#### Triggers: `data-ya-trigger` 
>  - `always`: Always trigger the request (default)
>  - `once`: Trigger the request one time only
>  - `submit`: Submit Form in AJAX with serialized data
>  - `autoload`: Autoload the request on DOMReady
 
#### Location:  `data-ya-location`
> - `replace` Replace the target element
> - `after`: Insert after the target element
> - `before`: Insert before the target element
> - `inner`: Replace the content inside the target element
> - `top`: Insert at the beginning of the target element
> - `bottom`: Insert at the end of the target element
> - `remove`: Remove the target element

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

#### AJAX Request Loop `data-ya-timer` 
> - `time in seconds`: Number of seconds between AJAX call


To Do
-----

* Touch support
* Scroll
