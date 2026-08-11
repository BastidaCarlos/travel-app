import { Link } from "react-router";

function Navbar() {
   return(
    <div>
      <nav>
        <Link to={"/"}>Landing</Link> |
        <Link to={"/login"}>Login</Link> |
        <Link to={"/itineraries"}>Itineraries</Link> 
      </nav>
    </div>
   ) 
}

export default Navbar;