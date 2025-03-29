import { useState } from "react";
import AuthForm from "@/components/ui/auth-form";

export default function SignupPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignupSuccess = () => {
    setIsAuthenticated(true); // Set authentication state to true after signup success
  };

  return (
    <div>
      {isAuthenticated ? (
        // Redirect to Home or show the HomeContent if authenticated
        <div>Redirecting...</div> // Placeholder until you handle redirection
      ) : (
<AuthForm defaultTab="signup" onLoginSuccess={handleSignupSuccess} />

      )}
    </div>
  );
}
