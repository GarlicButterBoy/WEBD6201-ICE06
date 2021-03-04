"use strict";

let activeLink = "";

(function (core) 
{
    class Router 
    {
        //Constructors 
        constructor() 
        {
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
        //private methods
        //public methods
        AddRoute(route) 
        {
            this.m_routingTable.push(route);
        }
        Find(route) {
            return this.m_routingTable.indexOf(route);
        }
        RemoveRoute(route) {
            const index = this.Find(route);
            if (index > -1) {
                this.m_routingTable.splice(index, 1);
                return true;
            }
            else {
                return false;
            }
        }
    }
    core.Router = Router;
})(core || (core = {}));