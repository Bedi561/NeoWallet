// "use client"
// import { useState } from "react";
// import { useRouter } from "next/navigation"; // For navigation
// import AuthForm from "@/components/ui/auth-form";

// export default function LoginPage() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const router = useRouter();

//   const handleLoginSuccess = () => {
//     setIsAuthenticated(true);
//     router.push("/screens/home"); // Redirect to home screen after successful login
//   };

//   return (
//     <div>
//       {isAuthenticated ? (
//         <div>Redirecting...</div> // Show a loading or redirecting message
//       ) : (
//         <AuthForm type="login" onLoginSuccess={handleLoginSuccess} />
//       )}
//     </div>
//   );
// }
