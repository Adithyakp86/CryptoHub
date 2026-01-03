import "./Signup.css";
import { FiLogIn } from 'react-icons/fi';

function Signup({ loginWithRedirect }) {

  return (
    <button
      onClick={() => loginWithRedirect({ 
        authorizationParams: {
          screen_hint: "signup",
          redirect_uri: window.location.origin + "/callback",
        }, 
      })}
      className="signup-btn"
    >
      <span>Sign Up</span>
      <FiLogIn size={20} />
    </button>
  );
}

export default Signup;
