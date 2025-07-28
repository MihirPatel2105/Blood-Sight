import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Activity,
  Brain,
  FileText,
  Shield,
  Zap,
  ChevronRight,
  User,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Smart OCR Analysis",
      description:
        "Advanced OCR technology extracts data from blood report images and PDFs with high accuracy.",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered RAG",
      description:
        "Retrieval-Augmented Generation using medical knowledge bases for comprehensive analysis.",
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Disease Detection",
      description:
        "Detects Anemia, Diabetes, Leukemia, and Thalassemia using scientific thresholds.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description:
        "Your medical data is processed securely and deleted after analysis.",
    },
  ];

  const diseases = ["Anemia", "Diabetes", "Leukemia", "Thalassemia"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">BloodAI</span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate("/profile")}
                  className="gap-2"
                >
                  <User className="h-4 w-4" />
                  {user?.name || "Profile"}
                </Button>
                <Button onClick={() => navigate("/analysis")} className="gap-2">
                  Start Analysis <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Sign In
                </Button>
                <Button onClick={() => navigate("/signup")} className="gap-2">
                  Get Started <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Zap className="h-3 w-3 mr-1" />
            AI-Powered Medical Analysis
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Blood Report Analyser
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Upload your blood report and get instant AI-powered analysis for
            disease detection. Our advanced RAG system uses medical knowledge
            bases to provide accurate insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/analysis")}
              className="text-lg px-8 py-6 gap-2"
            >
              Analyze Blood Report <ChevronRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/learn-more")}
              className="text-lg px-8 py-6"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Disease Detection Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Disease Detection</h2>
          <p className="text-muted-foreground text-lg">
            Our AI system can detect and analyze these blood-related conditions
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {diseases.map((disease, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Activity className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold">{disease}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">
            Advanced AI technology for comprehensive blood report analysis
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <div className="text-primary">{feature.icon}</div>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Analyze Your Blood Report?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Get instant AI-powered insights from your blood test results. Upload
            your report and receive detailed analysis in seconds.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/analysis")}
            className="text-lg px-8 py-6 gap-2"
          >
            Start Free Analysis <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
                <Activity className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">BloodAI</span>
              <span className="text-muted-foreground">
                - AI-Powered Blood Report Analysis
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 BloodAI. For research purposes only. Consult healthcare
              professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
