
"use client"

import { useState } from "react"
// import { useRouter } from "next/navigation"
import AuthForm from "@/components/ui/auth-form"
import HomeContent from "@/components/ui/home-content"

export default function LoginPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // const router = useRouter()

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
  }

  if (isAuthenticated) {
    return <HomeContent />
  }

  // return (
  //   <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
  //     <Card className="w-[450px] sm:w-[500px] lg:w-[550px]"> {/* Increased width and responsiveness */}
  //       <CardHeader>
  //         <CardTitle>Welcome</CardTitle>
  //         <CardDescription>Login or create an account to continue</CardDescription>
  //       </CardHeader>
  //       <CardContent>
  //         <Tabs defaultValue="login">
  //           <TabsList className="grid w-full grid-cols-2 gap-4">
  //             <TabsTrigger value="login" className="py-2 text-lg font-semibold">Login</TabsTrigger>
  //             <TabsTrigger value="signup" className="py-2 text-lg font-semibold">Sign Up</TabsTrigger>
  //           </TabsList>
  //           <TabsContent value="login">
  //             <AuthForm type="login" onLoginSuccess={handleAuthSuccess} />
  //           </TabsContent>
  //           <TabsContent value="signup">
  //             <AuthForm type="signup" onLoginSuccess={handleAuthSuccess} />
  //           </TabsContent>
  //         </Tabs>
  //       </CardContent>
  //     </Card>
  //   </div>
  // )
  return <AuthForm onLoginSuccess={handleAuthSuccess} />
}
