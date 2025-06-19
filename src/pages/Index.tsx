
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, Award, Shield, Mail, Lock, User, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const Index = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({ 
    email: "", 
    password: "", 
    username: "", 
    fullName: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInData.email || !signInData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(signInData.email, signInData.password);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign In Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpData.email || !signUpData.password || !signUpData.username || !signUpData.fullName) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp(signUpData.email, signUpData.password, signUpData.username, signUpData.fullName);
      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign Up Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sap-page-container">
      {/* Header */}
      <header className="sap-page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">PrepVault</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gradient-primary mb-6">
              Master Your Exams with PrepVault
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A comprehensive exam preparation platform designed to help you succeed. 
              Practice with real exam questions, track your progress, and achieve your goals.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="sap-card animate-fade-in">
              <div className="sap-card-content text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Comprehensive Question Bank</h3>
                <p className="text-muted-foreground">
                  Access thousands of practice questions across various subjects and difficulty levels.
                </p>
              </div>
            </div>

            <div className="sap-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="sap-card-content text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Progress Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor your performance with detailed analytics and personalized insights.
                </p>
              </div>
            </div>

            <div className="sap-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="sap-card-content text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Expert Administration</h3>
                <p className="text-muted-foreground">
                  Managed by education professionals to ensure quality and relevance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/5">
        <div className="max-w-md mx-auto">
          <Card className="sap-card animate-slide-up">
            <CardHeader className="sap-card-header text-center">
              <CardTitle className="text-2xl font-semibold text-foreground">Get Started</CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent className="sap-card-content">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin" className="sap-nav-item">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="sap-nav-item">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="sap-form-group">
                      <Label htmlFor="signin-email" className="sap-form-label">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
                      </Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        className="sap-form-input"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="sap-form-group">
                      <Label htmlFor="signin-password" className="sap-form-label">
                        <Lock className="w-4 h-4 inline mr-2" />
                        Password
                      </Label>
                      <Input
                        id="signin-password"
                        type="password"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        className="sap-form-input"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full sap-btn-primary"
                      disabled={isSubmitting || loading}
                    >
                      {isSubmitting ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="sap-form-group">
                      <Label htmlFor="signup-fullname" className="sap-form-label">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name
                      </Label>
                      <Input
                        id="signup-fullname"
                        type="text"
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                        className="sap-form-input"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="sap-form-group">
                      <Label htmlFor="signup-username" className="sap-form-label">
                        <User className="w-4 h-4 inline mr-2" />
                        Username
                      </Label>
                      <Input
                        id="signup-username"
                        type="text"
                        value={signUpData.username}
                        onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                        className="sap-form-input"
                        placeholder="Choose a username"
                        required
                      />
                    </div>
                    <div className="sap-form-group">
                      <Label htmlFor="signup-email" className="sap-form-label">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        className="sap-form-input"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="sap-form-group">
                      <Label htmlFor="signup-password" className="sap-form-label">
                        <Lock className="w-4 h-4 inline mr-2" />
                        Password
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        className="sap-form-input"
                        placeholder="Create a password"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full sap-btn-primary"
                      disabled={isSubmitting || loading}
                    >
                      {isSubmitting ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Status Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-foreground mb-8">
            Why Choose PrepVault?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Secure & Reliable</h3>
                <p className="text-muted-foreground">
                  Your data is protected with enterprise-grade security measures.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Real-time Analytics</h3>
                <p className="text-muted-foreground">
                  Get instant feedback on your performance and areas for improvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border bg-card/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 PrepVault. Built for exam success.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
