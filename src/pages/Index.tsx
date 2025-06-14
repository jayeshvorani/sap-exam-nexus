
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Award, Clock } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  if (showLogin) {
    return <LoginForm onBack={() => setShowLogin(false)} onRegister={() => { setShowLogin(false); setShowRegister(true); }} />;
  }

  if (showRegister) {
    return <RegisterForm onBack={() => setShowRegister(false)} onLogin={() => { setShowRegister(false); setShowLogin(true); }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">SAP Exam Nexus</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setShowLogin(true)}>
                Sign In
              </Button>
              <Button onClick={() => setShowRegister(true)}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-6">
            Professional Exam Platform
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Take your SAP certification exams with confidence. Our platform provides 
            a seamless, secure, and professional testing environment.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg font-medium">Timed Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Professional timed testing environment with session persistence
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg font-medium">Demo Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Practice with answer reveals and unlimited attempts
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg font-medium">Question Pools</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Randomized questions from comprehensive question banks
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg font-medium">Instant Results</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Immediate feedback with detailed performance analysis
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
