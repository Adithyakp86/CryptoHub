import "./Login.css";
import { FiLogIn } from 'react-icons/fi';

function Login({ loginWithRedirect }) {

  return (
    <button
      onClick={() => loginWithRedirect({
        authorizationParams: {
          redirect_uri: window.location.origin + "/callback",
        },
      })}
      className="login-btn"
    >
      <span>Log In</span>
      <FiLogIn size={20} />
    </button>
  );
}

export default Login;