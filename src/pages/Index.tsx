
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Award, Clock, CheckCircle, Shield, Timer } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Prep Vault</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
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
          <h2 className="text-4xl font-light text-foreground mb-6">
            Professional Exam Preparation Platform
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Take your certification exams with confidence. Our platform provides 
            a seamless, secure, and professional testing environment designed for success 
            across various technologies and certifications.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex justify-center mb-16">
            <Button size="lg" onClick={() => setShowRegister(true)} className="text-lg px-8 py-3">
              Start Your Journey
            </Button>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center text-foreground mb-8">Why Choose Prep Vault?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-foreground">Authentic Experience</h4>
              <p className="text-muted-foreground">Real exam conditions with the same interface and timing as official certifications</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-foreground">Secure & Reliable</h4>
              <p className="text-muted-foreground">Enterprise-grade security with session persistence and automatic progress saving</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <Timer className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-foreground">Instant Results</h4>
              <p className="text-muted-foreground">Get immediate feedback with detailed performance analysis and improvement suggestions</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-center text-foreground mb-8">Platform Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-medium">Timed Exams</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Professional timed testing environment with session persistence and auto-save
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-medium">Demo Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Practice with answer reveals, explanations, and unlimited attempts
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-medium">Question Pools</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Randomized questions from comprehensive, updated question banks
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
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
        <div className="text-center bg-muted rounded-2xl p-8">
          <h3 className="text-2xl font-semibold text-foreground mb-4">Ready to Get Certified?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
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
