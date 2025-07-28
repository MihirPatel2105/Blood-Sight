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
  ArrowLeft,
  Eye,
  Database,
  Microscope,
  Heart,
  AlertTriangle,
  BookOpen,
  Users,
  Lock,
  CheckCircle,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

export default function LearnMore() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const technologies = [
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Advanced OCR",
      description:
        "Optical Character Recognition using Tesseract and PaddleOCR to extract text from medical reports with 98%+ accuracy.",
      details: [
        "Supports JPG, PNG, PDF formats",
        "Multi-language detection",
        "Medical terminology recognition",
      ],
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "RAG Pipeline",
      description:
        "Retrieval-Augmented Generation combines large language models with medical knowledge databases for accurate analysis.",
      details: [
        "LangChain framework",
        "Vector embeddings with FAISS",
        "Medical literature database",
      ],
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Medical Knowledge Base",
      description:
        "Comprehensive database of medical references, WHO guidelines, and peer-reviewed research papers.",
      details: [
        "WHO clinical guidelines",
        "PubMed research articles",
        "Medical reference standards",
      ],
    },
    {
      icon: <Microscope className="h-6 w-6" />,
      title: "AI Analysis Engine",
      description:
        "Machine learning models trained on medical datasets to detect patterns and anomalies in blood work.",
      details: [
        "Scikit-learn algorithms",
        "Rule-based validation",
        "Explainable AI results",
      ],
    },
  ];

  const diseases = [
    {
      name: "Anemia",
      description:
        "Detects various types of anemia including iron deficiency, vitamin B12 deficiency, and chronic disease anemia.",
      indicators: [
        "Low hemoglobin levels",
        "Decreased red blood cell count",
        "Low hematocrit values",
        "Iron markers",
      ],
      prevalence: "~25% globally",
    },
    {
      name: "Diabetes",
      description:
        "Identifies diabetes and pre-diabetic conditions through glucose and HbA1c analysis.",
      indicators: [
        "Elevated glucose levels",
        "High HbA1c",
        "Insulin resistance markers",
        "Ketone presence",
      ],
      prevalence: "~11% of adults",
    },
    {
      name: "Leukemia",
      description:
        "Detects abnormal white blood cell patterns that may indicate various forms of leukemia.",
      indicators: [
        "Abnormal WBC count",
        "Blast cells presence",
        "Platelet abnormalities",
        "Lymphocyte patterns",
      ],
      prevalence: "~0.3% of population",
    },
    {
      name: "Thalassemia",
      description:
        "Identifies thalassemia trait and major forms through hemoglobin analysis.",
      indicators: [
        "Abnormal hemoglobin patterns",
        "Microcytic anemia",
        "Target cells",
        "Iron overload markers",
      ],
      prevalence: "~4.4% globally",
    },
  ];

  const researchSources = [
    {
      title: "MIMIC-III Clinical Database",
      description:
        "Large database of de-identified health data from ICU patients",
      type: "Clinical Dataset",
    },
    {
      title: "UCI Blood Transfusion Dataset",
      description: "Machine learning dataset for blood donation analysis",
      type: "ML Dataset",
    },
    {
      title: "WHO Laboratory Guidelines",
      description: "International standards for clinical laboratory testing",
      type: "Clinical Guidelines",
    },
    {
      title: "PubMed Medical Literature",
      description:
        "Peer-reviewed research articles on hematology and diagnostics",
      type: "Research Papers",
    },
  ];

  const workflow = [
    {
      step: 1,
      title: "Upload Report",
      description: "Upload your blood test report as an image or PDF file",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      step: 2,
      title: "OCR Processing",
      description:
        "Advanced OCR extracts text and numerical data from your report",
      icon: <Eye className="h-5 w-5" />,
    },
    {
      step: 3,
      title: "Data Parsing",
      description:
        "AI converts unstructured text into standardized medical data",
      icon: <Database className="h-5 w-5" />,
    },
    {
      step: 4,
      title: "Knowledge Retrieval",
      description: "System retrieves relevant medical guidelines and research",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      step: 5,
      title: "AI Analysis",
      description:
        "Machine learning models analyze patterns and detect anomalies",
      icon: <Brain className="h-5 w-5" />,
    },
    {
      step: 6,
      title: "Report Generation",
      description: "Comprehensive analysis report with recommendations",
      icon: <TrendingUp className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">BloodAI</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button onClick={() => navigate("/analysis")} className="gap-2">
                Start Analysis <ChevronRight className="h-4 w-4" />
              </Button>
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

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Lightbulb className="h-3 w-3 mr-1" />
            Learn About BloodAI
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Understanding AI-Powered
            <br />
            Blood Report Analysis
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            BloodAI represents the cutting edge of medical AI technology,
            combining advanced machine learning with clinical expertise to
            provide instant, accurate analysis of blood test results.
          </p>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How BloodAI Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our AI system processes your blood reports through a sophisticated
              6-step pipeline
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflow.map((item, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="text-primary">{item.icon}</div>
                    </div>
                    <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {item.step}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Advanced Technology</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built on state-of-the-art AI and machine learning technologies
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {technologies.map((tech, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-primary">{tech.icon}</div>
                  </div>
                  <CardTitle className="text-xl">{tech.title}</CardTitle>
                  <CardDescription className="text-base">
                    {tech.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tech.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Disease Detection */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Disease Detection Capabilities
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our AI can detect and analyze these major blood-related conditions
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {diseases.map((disease, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      {disease.name}
                    </CardTitle>
                    <Badge variant="secondary">{disease.prevalence}</Badge>
                  </div>
                  <CardDescription className="text-base">
                    {disease.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold mb-2">Key Indicators:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {disease.indicators.map((indicator, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        {indicator}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Research & Data Sources */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Research Foundation</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our AI is trained on the world's most comprehensive medical
              datasets and guidelines
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {researchSources.map((source, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{source.title}</CardTitle>
                    <Badge variant="outline">{source.type}</Badge>
                  </div>
                  <CardDescription>{source.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Privacy & Security</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your medical data security is our top priority
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Lock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>End-to-End Encryption</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All data is encrypted during transmission and processing using
                  industry-standard protocols.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Data Anonymization</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Personal identifiers are removed from medical data used for
                  research and model improvement.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>No Data Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Reports are processed and deleted after analysis. We don't
                  store your medical documents.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Important Disclaimers */}
        <section className="mb-16">
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                <CardTitle className="text-orange-800">
                  Important Medical Disclaimer
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-orange-700">
                <p className="mb-3">
                  <strong>
                    BloodAI is a research and educational tool designed to
                    assist in understanding blood test results. It is not
                    intended to replace professional medical advice, diagnosis,
                    or treatment.
                  </strong>
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-orange-600 rounded-full mt-2" />
                    Always consult with qualified healthcare professionals for
                    medical decisions
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-orange-600 rounded-full mt-2" />
                    This tool should not be used for emergency medical
                    situations
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-orange-600 rounded-full mt-2" />
                    Results are for informational purposes only and may contain
                    errors
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-orange-600 rounded-full mt-2" />
                    Different laboratories may have varying reference ranges
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Try BloodAI?</CardTitle>
              <CardDescription className="text-lg">
                Upload your blood report and experience the power of AI-driven
                medical analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <Button
                    size="lg"
                    onClick={() => navigate("/analysis")}
                    className="text-lg px-8 py-6 gap-2"
                  >
                    Start Analysis Now <ChevronRight className="h-5 w-5" />
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      onClick={() => navigate("/signup")}
                      className="text-lg px-8 py-6 gap-2"
                    >
                      Create Free Account <ChevronRight className="h-5 w-5" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate("/login")}
                      className="text-lg px-8 py-6"
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
