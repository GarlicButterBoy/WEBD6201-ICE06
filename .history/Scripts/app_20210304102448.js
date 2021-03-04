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
            loadContent(router.ActiveLink, ActiveLinkCallBack(router.ActiveLink));
            $(`#${router.ActiveLink}`).addClass("active"); //adds highlighted link
            history.pushState({},"",router.ActiveLink); //replaces url 
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
       callBack();
      });
      
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
      
      console.log("Home Page Function Called");

      
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
      //TODO: Fix this, shouldn't load then reload on redirect
      AuthGuard();

      $("#contactListLink").attr("class", "nav-link active");
      
      //if the user is already logged in
    if (!sessionStorage.getItem("user"))
    {
      //redirect to the secure area
      location.href = "/login";
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
          location.href = "/edit" + $(this).val();
        });

        
        $("button.delete").on("click", function()
        {
          if(confirm("Are you sure?"))
          {
            localStorage.removeItem($(this).val());
          }
          location.href = "/contact-list";
        });

        $("#addButton").on("click", function()
        {
          location.href = "/edit";
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
         location.href = "/contact-list";
        }

      });
      //Cancel Button
      $("#cancelButton").on("click", function()
      {
        //return to contact-list.html
        location.href = "/contact-list";
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

            //Toggle login/logout
            toggleLogin();

            // redirect user to secure area - contact-list.html
            location.href = "/contact-list";
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
        location.href = "/index";
      });

    });

    //Cancel Button
    $("#cancelButton").on("click", function()
    {
      //clear the login form
      document.forms[0].reset();

      //return to contact-list.html
      location.href = "/index";
    });

    
  }

  function displayRegister()
  {
    
  }

  function display404()
  {

  }

  function toggleLogin()
  {
    
    if(sessionStorage.getItem("user"))
    {
      $("#login").html(
        `<a id="logout" class="nav-link" aria-current="page"><i class="fas fa-sign-out-alt"></i> Logout</a>`
      );

      $("#logout").on("click", function() {
        //perform logout
        sessionStorage.clear();
        //redirect to login
        location.href = "/login";
      });

      $("a").on("mouseover", function()
      {
        $(this).css("cursor", "pointer");
      });

      $(
        `<li  class="nav-item">
         <a id="contactListLink" class="nav-link" aria-current="page" href="/contact-list"><i class="fas fa-users fa-lg"></i> Contact List</a>
         </li>`
        ).insertBefore("#login");
    }
    else
    {

    }

    
  }

  function ActiveLinkCallBack(activeLink)
  {
    switch (activeLink) 
        {
          case "home": return displayHome;
          case "about": return displayAbout;
          case "projects": return displayProjects;
          case "services": return displayServices;
          case "contact": return displayContact;
          case "contact-list": return displayContactList;
          case "edit": return displayEdit;    
          case "login": return displayLogin;    
          case "register": return displayRegister;   
          case "404": return display404; 
          default:
            console.log("ERROR: callback does not exist: " + activeLink);
            break;
        }

  }

  function AuthGuard()
  {
    //if the user isn't logged in, redirect to login.html
    if (!sessionStorage.getItem("user"))
    {
      //redirect to the secure area
      location.href = "login.html";
    }
  }

    function Start()
    {
        console.log("App Started...");

        loadHeader(router.ActiveLink);

        loadContent(router.ActiveLink, ActiveLinkCallBack(router.ActiveLink));
  
        loadFooter();

        
        
        


    }

    window.addEventListener("load", Start);

    core.Start = Start;


})  (core || (core={}));