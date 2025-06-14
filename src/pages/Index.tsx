
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Award, Clock, CheckCircle, Shield, Timer } from "lucide-react";
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
              <h1 className="text-xl font-semibold text-gray-900">Prep Vault</h1>
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
            Professional Exam Preparation Platform
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Take your certification exams with confidence. Our platform provides 
            a seamless, secure, and professional testing environment designed for success 
            across various technologies and certifications.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" onClick={() => setShowRegister(true)} className="text-lg px-8 py-3">
              Start Your Journey
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Try Demo Exam
            </Button>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center text-gray-900 mb-8">Why Choose Prep Vault?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Authentic Experience</h4>
              <p className="text-gray-600">Real exam conditions with the same interface and timing as official certifications</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Secure & Reliable</h4>
              <p className="text-gray-600">Enterprise-grade security with session persistence and automatic progress saving</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Timer className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Instant Results</h4>
              <p className="text-gray-600">Get immediate feedback with detailed performance analysis and improvement suggestions</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-center text-gray-900 mb-8">Platform Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-medium">Timed Exams</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Professional timed testing environment with session persistence and auto-save
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
                  Practice with answer reveals, explanations, and unlimited attempts
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
                  Randomized questions from comprehensive, updated question banks
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg font-medium">Detailed Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive performance analysis with strengths and improvement areas
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Get Certified?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of professionals who have successfully passed their certifications using our platform.
          </p>
          <Button size="lg" onClick={() => setShowRegister(true)} className="text-lg px-8 py-3">
            Create Your Account
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
