
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Chrome, Github, Facebook, CheckCircle, Users, Zap } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin = async (provider: string) => {
    setLoading(provider);
    try {
      await login(provider);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(null);
    }
  };

  const features = [
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      title: "Task Management",
      description: "Create, organize, and track your tasks efficiently"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: "Team Collaboration",
      description: "Share tasks and collaborate with your team members"
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Real-time Updates",
      description: "Get instant updates and stay synchronized"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Features */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Todo Task
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}Manager
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Organize your work and life, finally. Become focused, organized, and calm with our powerful task management platform.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-sm text-gray-500">
            This project is part of a hackathon run by{" "}
            <a href="https://www.katomaran.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              https://www.katomaran.com
            </a>
          </div>
        </div>

        {/* Right side - Login Card */}
        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-2 pb-8">
              <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
              <CardDescription className="text-gray-600">
                Sign in to access your tasks and collaborate with your team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => handleLogin('google')}
                disabled={loading === 'google'}
                className="w-full h-12 bg-red-500 hover:bg-red-600 text-white border-0 transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading === 'google' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <Chrome className="mr-3 h-5 w-5" />
                    Continue with Google
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => handleLogin('github')}
                disabled={loading === 'github'}
                className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white border-0 transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading === 'github' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <Github className="mr-3 h-5 w-5" />
                    Continue with GitHub
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => handleLogin('facebook')}
                disabled={loading === 'facebook'}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white border-0 transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading === 'facebook' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <Facebook className="mr-3 h-5 w-5" />
                    Continue with Facebook
                  </>
                )}
              </Button>

              <div className="text-center pt-4">
                <p className="text-xs text-gray-500">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
