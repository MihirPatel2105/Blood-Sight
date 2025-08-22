import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Upload,
  FileText,
  User,
  Activity,
  ArrowLeft,
  Info,
} from "lucide-react";

const Analysis = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    medicalHistory: "",
    currentMedications: "",
    symptoms: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please upload a file first");
      return;
    }

    setIsUploading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', selectedFile);

      const response = await fetch('http://localhost:5001/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        // Navigate to results page with API response data
        const analysisData = {
          fileName: result.filename,
          patientInfo: formData,
          extractedText: result.extracted_text,
          analysis: result.analysis
        };
        
        navigate("/analysis/results", { 
          state: { analysisData } 
        });
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Blood Report Analysis
            </h1>
            <p className="text-gray-600">
              Upload your blood report and provide your medical information
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex items-center space-x-2 ${
                    currentStep >= step ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep >= step
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  <span className="font-medium">
                    {step === 1 && "Personal Info"}
                    {step === 2 && "Medical History"}
                    {step === 3 && "Upload Report"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                {currentStep === 1 && <User className="h-5 w-5 mr-2" />}
                {currentStep === 2 && <Activity className="h-5 w-5 mr-2" />}
                {currentStep === 3 && <Upload className="h-5 w-5 mr-2" />}
                Step {currentStep}: {
                  currentStep === 1 ? "Personal Information" :
                  currentStep === 2 ? "Medical History" :
                  "Upload Blood Report"
                }
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Please provide your basic information"}
                {currentStep === 2 && "Share your medical background"}
                {currentStep === 3 && "Upload your blood test report"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="medical-history">Medical History</Label>
                    <Textarea
                      id="medical-history"
                      value={formData.medicalHistory}
                      onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                      placeholder="List any chronic conditions, previous surgeries, allergies..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="medications">Current Medications</Label>
                    <Textarea
                      id="medications"
                      value={formData.currentMedications}
                      onChange={(e) => handleInputChange("currentMedications", e.target.value)}
                      placeholder="List all medications you're currently taking..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="symptoms">Current Symptoms</Label>
                    <Textarea
                      id="symptoms"
                      value={formData.symptoms}
                      onChange={(e) => handleInputChange("symptoms", e.target.value)}
                      placeholder="Describe any symptoms you're experiencing..."
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Upload Blood Report</h3>
                      <p className="text-gray-600">
                        Drag and drop your file here, or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports: PDF, JPG, PNG (Max 10MB)
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="mt-4"
                    />
                    {selectedFile && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          File Selected: {selectedFile.name}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900">Important Notice</h4>
                        <p className="text-blue-800 text-sm mt-1">
                          This is a demo version. Your files are not actually processed or stored.
                          In a production version, this would connect to AI services for analysis.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={
                  (currentStep === 1 && (!formData.name || !formData.email)) ||
                  (currentStep === 2 && !formData.medicalHistory)
                }
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!selectedFile}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Submit for Analysis
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
