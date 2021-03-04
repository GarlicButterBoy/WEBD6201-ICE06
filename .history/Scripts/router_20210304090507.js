"use strict";

(function (core) 
{
    class Router 
    {
        //Constructors 
        constructor() 
        {
            this.ActiveLink = "";
        }

        //Public PRoperties (Accessors and Mutators/Getters and Setters)
        
        get ActiveLink() 
        {
            return this.m_activeLink;
        }

        set ActiveLink(link) 
        {
            this.m_activeLink = link;
        }


        //public methods
        /**
         * Adds a new route to the routing table
         * @param {String} route 
         * @returns {void}
         */
        Add(route) 
        {
            this.m_routingTable.push(route);
        }
        /**
         * Replaces existing routing table with a new one
         * Routes should begin with /
         * @param {*} routingTable 
         */
        AddTable(routingTable) 
        {
            this.m_routingTable = routingTable;
        }
        Find(route) 
        {
            return this.m_routingTable.indexOf(route);
        }
        Remove(route) 
        {
            const index = this.Find(route);
            if (index > -1) 
            {
                this.m_routingTable.splice(index, 1);
                return true;
            }
            else 
            {
                return false;
            }
        }

        ToString() 
        {
            return this.m_routingTable.toString();
        }
    }
    core.Router = Router;
})(core || (core = {}));

let router = new core.Router();
router.AddTable(["/", 
                 "/home", 
                 "/about", 
                 "/services", 
                 "/contact", 
                 "/contact-list", 
                 "/projects", 
                 "/register", 
                 "/login", 
                 "/edit"]);

