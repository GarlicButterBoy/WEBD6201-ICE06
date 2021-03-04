/* custom JavaScript goes here */

//IIFE - Immediately Invoked Function Expression
//AKA - Anonymous Self-Executing Function
//Closure - limits scope leak

"use strict";

((core) =>
{
    /**
     * Inject the nav bar into the header element and highlight active link based on pageName param
     * @param {string} pageName
     */
    function loadHeader(pageName)
    {
      
      //inject Header
      $.get("./Views/components/header.html", function(data)
        {
          $("header").html(data); //load the nav bar
          //highlight active link
          $(`#${pageName}`).addClass("active");

          //loop through each anchor tag in the unordered list and add an event listener
          //or handler to allow for content injection
          $("a").on("click", function()
          {
            $(`#${router.ActiveLink}`).removeClass("active"); //removes highlighted link

            router.ActiveLink = $(this).attr("id");
            loadContent(router.ActiveLink, );
            $(`#${router.ActiveLink}`).addClass("active"); //adds highlighted link

           // history.replaceState({}, '', activeLink); //replaces url with new url in browser

          });

          let anchorArray = document.getElementsByTagName("a");
          console.log(anchorArray.length);
        /*  for (const anchor of anchorArray) 
            {
                 anchor.addEventListener("mouseout", function()
                 {
                   console.log("Leaving a tag");
                 });
            }
          */  
          $("a").on("mouseover", function()
          {
            $(this).css("cursor", "pointer");
          });
        });
    }



    /**
     * @param   {string} pageName
     * @param   {function} callBack
     * @returns {void}
     */
    function loadContent(pageName, callBack)
    {


      //inject content
      $.get(`./Views/content/${pageName}.html`, function(data)
      {
       
       $("main").html(data);
        
      });

      callBack();
    }

    function loadFooter()
    {
      //inject footer
      $.get("./Views/components/footer.html", function(data)
      {
        $("footer").html(data);
      });
    }

    function displayHome()
    {
      


      
    }

    function displayAbout()
    {

    }

    function displayProjects()
    {

    }

    function displayServices()
    {

    }

    function displayContact()
    {
        TestFullName();
        TestContactNumber();
        TestEmailAddress();
        
        //let fullName = document.getElementById("fullName");
        //fullName.addEventListener("blur", function() {});
       
        $("#sendButton").on("click", (event)=>
        {
          if ($("#subscribeCheckbox")[0].checked)
          {
            let contact = new core.Contact(fullName.value, contactNumber.value, emailAddress.value);
            if(contact.serialize()) //checking if the serialized object exists
            {
              let key = contact.FullName.substring(0, 1) + Date.now();

              localStorage.setItem(key, contact.serialize());
            }
          }
        });


    }
    function displayContactList()
    {
      /*
      //Step 1: Create an XHR Object
      let XHR = new XMLHttpRequest();

      //Step 2: Open the connection to file/url
      XHR.open("GET", "./Data/contacts.json");

      //Step 3: Send request to the server
      XHR.send();

      //Step 4: Listen for a response
      XHR.addEventListener("readystatechange", function() 
      {
        let contactData = "";
        //Step 5: Ensure the server is ready and there are no errors
        if (XHR.readyState === 4 && XHR.status === 200)
        {
          let contacts = JSON.parse(XHR.responseText).contacts;

          
          let contactIndex = 0;

          //Step 6: Do something with the data
          for (const contact of contacts)
          {

            let newContact = new core.Contact();
            newContact.fromJSON(contact);
  
            contactData += `<tr>
                    <th scope="row">${contactIndex}</th>
                    <td>${newContact.FullName}</td>
                    <td>${newContact.ContactNumber}</td>
                    <td>${newContact.EmailAddress}</td>
                    <td class="text-center"><button class="btn btn-primary btn-sm edit" value="${contactIndex}"><i class="fas fa-sm fa-edit"></i> Edit</button></td>
                    <td class="text-center"><button class="btn btn-warning btn-sm delete" value="${contactIndex}"><i class="fas fa-sm fa-trash-alt"></i> Delete</button></td>
                    </tr>`;
            contactIndex++;
          }
          //console.log(JSON.parse(XHR.responseText));

          
        }

      });
      */

     
      $("#contactListLink").attr("class", "nav-link active");
      
      //if the user is already logged in
    if (!sessionStorage.getItem("user"))
    {
      //redirect to the secure area
      location.href = "login.html";
    }

    

      if(localStorage.length > 0)
      {
        
        //document.getElementById("#contactListLink").setAttribute("class", "nav-link active");

        let contactList = document.getElementById("contactList");

        let data = "";
        let keys = Object.keys(localStorage);
        
        let index = 1;

        for (const key of keys)
        {
          console.log(key);
          let contactData = localStorage.getItem((key).toString());

          console.log(contactData);

          let contact = new core.Contact();
          contact.deserialize(contactData);

          data += `<tr>
                  <th scope="row">${index}</th>
                  <td>${contact.FullName}</td>
                  <td>${contact.ContactNumber}</td>
                  <td>${contact.EmailAddress}</td>
                  <td class="text-center"><button class="btn btn-primary btn-sm edit" value="${key}"><i class="fas fa-sm fa-edit"></i> Edit</button></td>
                  <td class="text-center"><button class="btn btn-warning btn-sm delete" value="${key}"><i class="fas fa-sm fa-trash-alt"></i> Delete</button></td>
                  </tr>`;
          index++;
        }

        contactList.innerHTML = data;
        //TODO: Create an Edit page
        $("button.edit").on("click", function()
        {
          location.href = "edit.html#" + $(this).val();
        });

        
        $("button.delete").on("click", function()
        {
          if(confirm("Are you sure?"))
          {
            localStorage.removeItem($(this).val());
          }
          location.href = "contact-list.html";
        });

        $("#addButton").on("click", function()
        {
          location.href = "edit.html";
        })
      }


    }
    function displayEdit()
    {

      let key = location.hash.substring(1);

      let contact = new core.Contact();

      //Simple check to ensure the key is not empty
      if(key != "")
      {
        //get contact info from localStorage
        contact.deserialize(localStorage.getItem(key));
        //Display contact info
        $("#fullName").val(contact.FullName);
        $("#contactNumber").val(contact.ContactNumber);
        $("#emailAddress").val(contact.EmailAddress);
      }
      else
      {
        //modify the page so its an add, not an edit
        $("main>h1").text("Add Contact");
        $("#editButton").html(`<i class="fas fa-plus-square fa-lg"></i> Add`)

      }

      TestFullName();
      TestContactNumber();
      TestEmailAddress();

      //Edit Button
      $("#editButton").one("click", function()
      {

        if (document.forms[0].checkValidity()) 
        {
          //If key is empty, make new one
        if (key == "")
        {
          key = contact.FullName.substring(0, 1) + Date.now();
        }

        //Update the contact info using the newly typed data
        contact.FullName = $("#fullName").val();
        contact.ContactNumber = $("#contactNumber").val();
        contact.EmailAddress = $("#emailAddress").val();

        //Update localStorage
        localStorage.setItem(key, contact.serialize());
         //Navigate back to the contact-list.html
         location.href = "contact-list.html";
        }

      });
      //Cancel Button
      $("#cancelButton").on("click", function()
      {
        //return to contact-list.html
        location.href = "contact-list.html";
      });

    }

    function TestContactNumber()
    {
      let messageArea = $("#messageArea");
      let contactNumberPattern = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
      // form validation
      $("#contactNumber").on("blur", function() 
      {
  

        if(!contactNumberPattern.test($(this).val()))
          {
              //JQuery example of the lines below
             $(this).trigger("focus").trigger("select");
             messageArea.show().addClass("alert alert-danger").text("Please enter a valid phone number.");
          }
          else
          {
             //JQuery example of the line below
              messageArea.removeAttr("class").hide();
             //messageArea.hidden = true;
             //messageArea.removeAttribute("class");
          }
      });
    }

    function TestEmailAddress()
    {
      let messageArea = $("#messageArea");
      let emailAddressPattern = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;
      // form validation
      $("#emailAddress").on("blur", function() 
      {
  

        if(!emailAddressPattern.test($(this).val()))
          {
              //JQuery example of the lines below
             $(this).trigger("focus").trigger("select");
             messageArea.show().addClass("alert alert-danger").text("Please enter a valid email address.");
          }
          else
          {
             //JQuery example of the line below
              messageArea.removeAttr("class").hide();
             //messageArea.hidden = true;
             //messageArea.removeAttribute("class");
          }
      });
    }

    function TestFullName()
    {
      //This is the same as below
      let messageArea = $("#messageArea").hide();
      let fullNamePattern = /([A-Z][a-z]{1,25})+(\s|,|-)([A-Z][a-z]{1,25})+(\s|,|-)*/;
      // form validation
      $("#fullName").on("blur", function() 
      {
  

        if(!fullNamePattern.test($(this).val()))
          {
              //JQuery example of the lines below
             $(this).trigger("focus").trigger("select");
             messageArea.show().addClass("alert alert-danger").text("Please enter a valid Full Name. Must have a first and last name, starting with capital letters.");
          }
          else
          {
             //JQuery example of the line below
              messageArea.removeAttr("class").hide();
             //messageArea.hidden = true;
             //messageArea.removeAttribute("class");
          }
      });
  }

  function displayLogin()
  {
    

    let messageArea = $("#messageArea");
    messageArea.hide();

    $("#loginButton").on("click", function() 
    {
      let messageArea = $("#messageArea");
      messageArea.hide();

      $("#loginButton").on("click", function() 
      {
        let username = $("#username");
        let password = $("#password");
        let success = false;
        let newUser = new core.User();

        // use ajax to access the json file
        $.get("./Data/users.json", function(data)
        {
          // check each user in the users.json file  (linear search)
          for (const user of data.users) 
          {
            if(username.val() == user.Username && password.val() == user.Password)
            {
              newUser.fromJSON(user);
              success = true;
              break;
            }
          }

          // if username and password matches - success... then perform login
          if(success)
          {
            // add user to session storage
            sessionStorage.setItem("user", newUser.serialize());

            // hide any error message
            messageArea.removeAttr("class").hide();

            // redirect user to secure area - contact-list.html
            location.href = "contact-list.html";
          }
          else
          {
            // display an error message
            username.trigger("focus").trigger("select");
            messageArea.show().addClass("alert alert-danger").text("Error: Invalid login information");
          }
        });
      });

      $("#cancelButton").on("click", function()
      {
        // clear the login form
        document.forms[0].reset();
        // return to the home page
        location.href = "index.html";
      });

    });

    //Cancel Button
    $("#cancelButton").on("click", function()
    {
      //clear the login form
      document.forms[0].reset();

      //return to contact-list.html
      location.href = "index.html";
    });

    
  }

  function displayRegister()
  {
    
  }

  function toggleLogin()
  {
    
    if(sessionStorage.getItem("user"))
    {
      $("#login").html(
        `<a id="logout" class="nav-link" aria-current="page" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>`
      );

      $("#logout").on("click", function() {
        //perform logout
        sessionStorage.clear();
        //redirect to login
        location.href = "login.html";
      });

      $(
        `<li  class="nav-item">
         <a id="contactListLink" class="nav-link" aria-current="page" href="contact-list.html"><i class="fas fa-users fa-lg"></i> Contact List</a>
         </li>`
        ).insertBefore("#login");
    }

    
  }

  function ActiveLinkCallBack(activeLink)
  {
    switch (activeLink) 
        {
          case "home": return displayHome;
          case "about": return displayAbout;
          case "projects": return displayProjects;
          case "services": return  displayServices;
          case "contact": return  displayContact;
          case "contact-list": return  displayContactList;
          case "edit": return  displayEdit;    
          case "login": return  displayLogin;    
          case "register":return  displayRegister;    
        }

  }

    function Start()
    {
        console.log("App Started...");

        loadHeader(router.ActiveLink);

        loadContent(router.ActiveLink, );
  
        loadFooter();

        
        
        //Toggle login/logout
        toggleLogin();


    }

    window.addEventListener("load", Start);

    core.Start = Start;


})  (core || (core={}));