import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Logo component
export const Logo = () => {
  return (
    <div className="text-3xl text-center py-4 font-heading">
      GeniusWriter
      <FontAwesomeIcon icon={faBrain} className="text-3xl text-slate-300  pl-1"></FontAwesomeIcon>
    </div>
  );
};
