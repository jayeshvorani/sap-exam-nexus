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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      {/* Header */}
      <header className="header-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-subtitle gradient-text">Prep Vault</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button 
                variant="outline" 
                onClick={() => setShowLogin(true)} 
                className="border-primary/20 hover:border-primary/40 hover:bg-primary/5 hover:text-foreground transition-all"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => setShowRegister(true)} 
                className="btn-primary"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto section-padding">
        <div className="text-center content-spacing">
          <h2 className="text-headline gradient-text mb-6">
            Professional Exam Preparation Platform
          </h2>
          <p className="text-body text-muted-foreground mb-8 max-w-3xl mx-auto">
            Take your certification exams with confidence. Our platform provides 
            a seamless, secure, and professional testing environment designed for success 
            across various technologies and certifications.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex justify-center content-spacing">
            <Button 
              size="lg" 
              onClick={() => setShowRegister(true)} 
              className="btn-primary text-body px-8 py-3"
            >
              Start Your Journey
            </Button>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="content-spacing">
          <h3 className="text-title text-center gradient-text mb-8">Why Choose Prep Vault?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 status-success rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-subtitle mb-2 text-foreground">Authentic Experience</h4>
              <p className="text-body text-muted-foreground">Real exam conditions with the same interface and timing as official certifications</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 gradient-bg rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-subtitle mb-2 text-foreground">Secure & Reliable</h4>
              <p className="text-body text-muted-foreground">Enterprise-grade security with session persistence and automatic progress saving</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 status-warning rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <Timer className="w-8 h-8" />
              </div>
              <h4 className="text-subtitle mb-2 text-foreground">Instant Results</h4>
              <p className="text-body text-muted-foreground">Get immediate feedback with detailed performance analysis and improvement suggestions</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="content-spacing">
          <h3 className="text-title text-center gradient-text mb-8">Platform Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-elegant border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 status-info rounded-lg mx-auto mb-4 flex items-center justify-center shadow-md">
                  <Clock className="w-6 h-6" />
                </div>
                <CardTitle className="text-subtitle text-foreground">Timed Exams</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-body text-muted-foreground">
                  Professional timed testing environment with session persistence and auto-save
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-elegant border-success/20">
              <CardHeader>
                <div className="w-12 h-12 status-success rounded-lg mx-auto mb-4 flex items-center justify-center shadow-md">
                  <BookOpen className="w-6 h-6" />
                </div>
                <CardTitle className="text-subtitle text-foreground">Demo Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-body text-muted-foreground">
                  Practice with answer reveals, explanations, and unlimited attempts
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-elegant border-warning/20">
              <CardHeader>
                <div className="w-12 h-12 status-warning rounded-lg mx-auto mb-4 flex items-center justify-center shadow-md">
                  <Users className="w-6 h-6" />
                </div>
                <CardTitle className="text-subtitle text-foreground">Question Pools</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-body text-muted-foreground">
                  Randomized questions from comprehensive, updated question banks
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-elegant border-destructive/20">
              <CardHeader>
                <div className="w-12 h-12 status-error rounded-lg mx-auto mb-4 flex items-center justify-center shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <CardTitle className="text-subtitle text-foreground">Detailed Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-body text-muted-foreground">
                  Comprehensive performance analysis with strengths and improvement areas
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center card-elegant section-padding">
          <h3 className="text-title gradient-text mb-4">Ready to Get Certified?</h3>
          <p className="text-body text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of professionals who have successfully passed their certifications using our platform.
          </p>
          <Button 
            size="lg" 
            onClick={() => setShowRegister(true)} 
            className="btn-primary text-body px-8 py-3"
          >
            Create Your Account
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
