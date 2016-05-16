# Connect Trainning Exercise 1

## Prerequisites

You need to have the [Atlassian Plugins SDK][1] version 6.2.2 installed.

## Checkout this Repo

Go to your terminal, and paste:
    
    git clone git@bitbucket.org:dhaden/ac-static-tutorial.git
    cd atlassian-static-tutorial

*Important:* All of the remaining commands in this guide should be run from this directory.

## Starting the services

To run this addon locally first run JIRA:

    atlas-run-cloud --application jira-software

If this is not installed then you will need to install the [Atlassian Plugin SDK][1]. Make sure that
you have the latest version of the sdk.

When the JIRA instance is ready, the console will print out its url with port and extension. This
usually defaults to: http://localhost:2990/jira

Then, in a new window, run a http server that exposes all of these resources:

    ./http-server.bash

If it is working then you should be able to navigate to http://localhost:3311/atlassian-connect.json
and see your Atlassian Connect Descriptor.

## Installing the add-on, onto the instance

On your local JIRA instance (http://localhost:2990/jira logging in with credentials admin/admin), navigate to the "Manage add-ons" Page in the admin space. To do so the
fast way:

 1. Navigate to JIRA and click the '.' key on your keyboard.
 1. Type in 'Manage add-ons' and select that option from the dropdown.

This will take you to the "Manage add-ons" page.

Once you are on the Manage add-ons page, click the text labelled "Upload add-on", then paste in your 
working discriptor link from above (http://localhost:3311/atlassian-connect.json).

After pressing "Upload" in the dialog, JIRA will attempt to dowload the descriptor, and install the add-on for use straight away. 
(*Important:* You will need to refresh the page to see the effects of the reinstall)

There should now be a button in the top nav bar called 'Click me', clicking on this will load the "hello-you.html" document inside a JIRA General Page.

### Doing something useful

This section of the tutorial will be mainly focussed on the "hello-you.html" document.

Within the JavaScript segment of this page, we are downloading a script called "all.js" from the product instance.
    
    var allJS = Utils.getBaseUrl() + '/all.js';
    $.getScript(allJS, function () {
    ...

This script allows you to interact with the host product (JIRA) through the users web browser.

Just under this, is a block of code commented out. This uses the 'request' method to query for the current users name. Uncomment this code, and save the file.

Since your http-server is still running, this code will automatically be pushed to you browser on the next page refresh.
Note that if it didn't change anything, your local Chrome browser maybe caching the old version, and a hard refresh (cmd + shift + r) or opening dev tools (cmd + option + i) and turning on "Disable Caching" in the network panel will be required

However, you are now trying to read information from the instance, without ever having asked for permission.
To do this, we will need to update the descriptor and reinstall the add-on. 

In the root of the json descriptor, add the 'scopes' field:

    {
       ...other descriptor stuff...
       "scopes": [ "READ" ]
    }

This will declare that your addon requires read scope. Now save the descriptor and go back to the "Manage add-ons"
page and reinstall this add-on by re-uploading your descriptor file to jira. You do not need to
uninstall the addon first, installing your descriptor over the top of the old addon will be treated
as an upgrade.

After reinstalling the add-on, the new JavaScript code should work without exception.

## Further documentation

* [JavaScript API](https://developer.atlassian.com/static/connect/docs/latest/concepts/javascript-api.html)
* [Scopes Documentation](https://developer.atlassian.com/static/connect/docs/latest/scopes/scopes.html)
* [REST API Browser](https://jira.atlassian.com/plugins/servlet/restbrowser)

 [1]: https://developer.atlassian.com/docs/getting-started/set-up-the-atlassian-plugin-sdk-and-build-a-project
