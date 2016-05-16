# Advanced Concepts

The following tutorials are made to be an extension of learning on what is covered in the [README.markdown][1] file.
It is highly recommended that you follow the instructions in the [README][1] file, before you follow this tutorial.

## Events
Copy and paste the following code block into your atlassian-connect.json file, replacing the previous "modules" object:

    {
        ...
        "modules": {
            "webPanels": [
                {
                    "url": "/features/event/sender.html",
                    "key": "event-sender",
                    "location": "atl.jira.view.issue.right.context",
                    "name": {
                        "value": "Static Tutorial - Event Sender"
                    }
                },
                {
                    "url": "/features/event/receiver.html",
                    "key": "event-receiver",
                    "location": "atl.jira.view.issue.right.context",
                    "name": {
                        "value": "Static Tutorial - Event Receiver"
                    }
                }
            ]
        }
    }

After these changes, you will once again need to re-install the add-on using the "Manage Add-ons" page in your local JIRA instance.

If you haven't done so, you will need to make a JIRA project and an issue to be able to see the changes in the descriptor shown above.

After creating the issue, go to the issue page, and on the right hand side, there should be two Web Panels labeled "Static Tutorial - Event Sender" and "Static Tutorial - Event Receiver"

The Sender has two buttons, "Subtract" and "Add". Currently only the Add button is functional.
Upon pressing the "Add" button, you will notice that the counter in the Receiver web panel increase.
This is happening from an event being emitted from the sender window, which the receiver is listening for.

In other words, 

    events.emit("staticTutorial-increase");

from 'features/event/sender.html', calls

    events.on('staticTutorial-increase', function() {

from 'features/event/receiver.html', by passing the event through the host frame.

For an exercise, wire up the "Subtract" button so that it takes away 1 from the receiver counter, every time it is pressed.


## Properties
### JIRA Entity Properties
Copy and paste the following code block into your atlassian-connect.json file, replacing the previous "modules" and "scopes" objects:

    "modules": {
        "webPanels": [
            {
                "url": "features/hosted-data/hosted-data.html?issueKey={issue.key}",
                "key": "hosted-data",
                "location": "atl.jira.view.issue.right.context",
                "name": {
                   "value": "Hosted-Data - JIRA Entity"
                }
            },
            {
                "url": "features/hosted-data/todo-list.html?issueKey={issue.key}",
                "key": "todo-list",
                "location": "atl.jira.view.issue.right.context",
                "name": {
                   "value": "Hosted-Data - My ToDoList"
                }
            }
        ]
    },
    "scopes": ["READ", "WRITE", "DELETE"]

After these changes, you will once again need to re-install the add-on using the "Manage Add-ons" page in your local JIRA instance.

If you haven't done so, you will need to make a JIRA project and an issue to be able to see the changes in the descriptor shown above.

After creating the issue, go to the issue page, and on the right hand side, there should be two Web Panels labeled "Hosted-Data - JIRA Entity" and "Hosted-Data - My ToDoList"

"Hosted-Data - JIRA Entity" is a web panel to enable you to create, update, get and delete entity properties saved to the JIRA issue that you currently have on your browser. You also use this to view all entity properties saved to the current project. This web panel is created from "features/hosted-data/hosted-data.html".

"Hosted-Data - My ToDoList" is a web panel to serve as a mock todo list tutorial. This consists of a table which all tasks saved to the issue are displayed. Underneath this is a text input box and a submit button to allow you to create tasks, and saves them to the issue. The Todo list currently will save new tasks, save the task if checked or un-checked, and re-load the state upon the browser being refreshed. Each task also has a delete button, this appears to remove the task, but doesnt not delete this from the issue.

For this tutorial, you will need to go into "/features/hosted-data/todo-list.html" And finish the Todo by making an AP.request with the appropriate HTML method, and url.


## Conditions

Conditions are a powerful tool to enable UI elements to be turned on and off depending on the user or even content stored by the add-on on the host product.
Conditions can be placed on most UI modules (with the main exception being Confluence Macros) but to see if the module you want to use can have conditions, check out the specific [module docs|http://connect.atlassian.com] on the left side panel.

Unlike the previous tutorials, this one has a much larger emphasis on the changes in the descriptor.

### Basic Conditions

For the first step, we will be looking at webPanels that only show up for users with specific instance permissions.
To do this, we will need to make a new user by going to `http://localhost:2990/jira/secure/admin/user/UserBrowser.jspa` and creating a user, and adding them to the JIRA groups that allow them to use the product (but not to "jira-administrators"!).

After this, modify the `atlassian-connect.json` file to have the modules listed below
    
    "modules": {
        "webPanels": [
            {
                "url": "features/conditions/admin-only.html",
                "key": "admin-condition",
                "location": "atl.jira.view.issue.right.context",
                "name": {
                    "value": "Conditions - Admin Only"
                },
                "conditions": [
                    {
                        "condition": "user_is_admin"
                    }
                ]
            },
            {
                "url": "features/conditions/user-only.html",
                "key": "user-condition",
                "location": "atl.jira.view.issue.right.context",
                "name": {
                    "value": "Conditions - User Only"
                },
                "conditions": [
                    {
                        "condition": "user_is_logged_in"
                    },
                    {
                        "condition": "user_is_admin",
                        "invert": true
                    }
               ]
            }
        ]
    },


What we now have, are two web panels that will appear on the right side panel of a JIRA tickets page. However, the conditions make it so you will never see both of these panels at the same time.

The top web panel in the descriptor segment above, specifies that it only wants to be shown for a page where the logged in user, has administrative rights. While being logged in with the credentials `admin/admin`, you should be able to see the web panel.

The second panel has two conditions, the first one being `user_is_logged_in`, which will mean any unauthenticated users will not see this. The second condition then asks for the inverse of "Does this user have administrative rights" meaning that we are actually hiding this web panel from them.

### Entity and Add-on Property Conditions

This example will go into how you can choose (or allow the end user) to dynamically turn on and off web panels with conditions

For this example, we will be loading in four issue page web

    "modules": {
        "webPanels": [
            {
                "url": "features/conditions/conditions-controller.html?projectKey={project.key}&issueKey={issue.key}",
                "key": "conditions-controller",
                "location": "atl.jira.view.issue.right.context",
                "name": {
                    "value": "Conditions Controller"
                }
            },
            {
                "url": "features/conditions/entity-issue-condition.html",
                "key": "entity-issue-cond",
                "location": "atl.jira.view.issue.right.context",
                "name": {
                    "value": "Conditions - Entity Issue"
                },
                "conditions": [
                    {
                        "condition": "entity_property_equal_to",
                        "params": {
                            "entity": "issue",
                            "propertyKey": "isEnabled",
                            "value": "true"
                        }
                    }
                ]
            },
            {
                "url": "features/conditions/entity-project.html",
                "key": "entity-project-cond",
                "location": "atl.jira.view.issue.right.context",
                "name": {
                    "value": "Conditions - Entity Project"
                },
                "conditions": [
                    {
                        "condition": "entity_property_equal_to",
                        "params": {
                            "entity": "project",
                            "propertyKey": "isEnabled",
                            "value": "true"
                        }
                    }
               ]
            },
            {
                "url": "features/conditions/addon-condition.html",
                "key": "addon-cond",
                "location": "atl.jira.view.issue.right.context",
                "name": {
                    "value": "Conditions - Add-on Property"
                },
                "conditions": [
                    {
                        "condition": "entity_property_equal_to",
                        "params": {
                            "entity": "addon",
                            "propertyKey": "isEnabled",
                            "value": "false"
                        },
                        "invert": true
                    }
                ]
            }
        ]
    },


Conditions Controller: Provides buttons to set and unset different properties saved on the host product, to allow conditions to change. Does not contain any conditions itself.

Conditions - Entity Issue: Contains a condition to means the web-panel will only show if the entity property tied to the current issue called `isEnabled` is set to `true`, meaning every issue can have the web-panel turned on and off independently.

Conditions - Entity Project: Same as "Entity Issue" but the condition is tied on a project level, meaning all issues within a project will have the web-panel shown based on the same value.

Conditions - Add-on Property: This condition is doing two things different from the above cases
    #. The web-panel is tied to a property in the "add-on" properties, meaning that the value is stored on a domain level, and will act exactly the same on every project and issue.
    #. The condition has an `invert` set to true, which allows the web-panel to show by default (even when the property isn't set! Unlike the last two examples).


## Further Reading 

* [Events](https://developer.atlassian.com/static/connect/docs/latest/javascript/module-Events.html)
* Properties
    * [Add-on Properties](https://developer.atlassian.com/static/connect/docs/latest/concepts/conditions.html)
    * [JIRA Entity Properties](https://developer.atlassian.com/static/connect/docs/latest/modules/jira/entity-property.html)
    * [Confluence Content Properties](https://developer.atlassian.com/static/connect/docs/latest/modules/confluence/content-property.html)
* [Conditions](https://developer.atlassian.com/static/connect/docs/latest/concepts/conditions.html)
* [Cloud Installation](https://developer.atlassian.com/static/connect/docs/latest/developing/cloud-installation.html)

[1]: [https://bitbucket.org/dhaden/ac-static-tutorial/overview]
