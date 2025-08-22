import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText, Calendar, User, Activity, AlertTriangle, RefreshCw, Download } from "lucide-react";

interface AnalysisResult {
  fileName: string;
  uploadedAt: string;
  patientInfo: {
    name: string;
    email: string;
    medicalHistory: string;
  };
  extractedText: string;
  bloodValues?: Array<{
    name: string;
    value: string;
    unit: string;
    normalRange: string;
    status: "normal" | "high" | "low";
  }>;
  analysis: {
    overallHealth: string;
    keyFindings: string[];
    recommendations: string[];
    riskLevel: "Low" | "Medium" | "High";
    conditions?: string[];
    abnormalValues?: string[];
  };
}

const AnalysisResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get data from navigation state or use demo data
    const analysisData = location.state?.analysisData;
    
    // Simulate processing time
    setTimeout(() => {
      if (analysisData && analysisData.analysis) {
        // Use real data from backend
        setResults({
          fileName: analysisData.fileName || "BloodReport-Demo.pdf",
          uploadedAt: new Date().toLocaleString(),
          patientInfo: analysisData.patientInfo || {
            name: "John Doe",
            email: "john.doe@example.com",
            medicalHistory: "No significant medical history"
          },
          extractedText: analysisData.extractedText || "No text extracted",
          bloodValues: analysisData.analysis.bloodValues || [],
          analysis: {
            overallHealth: analysisData.analysis.overallHealth || "Analysis pending",
            keyFindings: analysisData.analysis.keyFindings || ["No findings available"],
            recommendations: analysisData.analysis.recommendations || ["Please consult your doctor"],
            riskLevel: analysisData.analysis.riskLevel || "Low",
            conditions: [],
            abnormalValues: analysisData.analysis.keyFindings?.filter(finding => 
              finding.includes('high') || finding.includes('low')
            ) || []
          }
        });
      } else {
        // Use demo data when no real data available
        setResults({
          fileName: "BloodReport-Demo.pdf",
          uploadedAt: new Date().toLocaleString(),
          patientInfo: {
            name: "John Doe",
            email: "john.doe@example.com",
            medicalHistory: "No significant medical history"
          },
          extractedText: "Sample extracted text from blood report...",
          bloodValues: [
            {
              name: "Hemoglobin",
              value: "13.2",
              unit: "g/dL",
              normalRange: "12.0-15.5",
              status: "normal" as const
            },
            {
              name: "White Blood Cells",
              value: "11.2",
              unit: "x10³/μL",
              normalRange: "4.5-11.0",
              status: "high" as const
            },
            {
              name: "Platelets",
              value: "280",
              unit: "x10³/μL",
              normalRange: "150-450",
              status: "normal" as const
            }
          ],
          analysis: {
            overallHealth: "Generally Normal",
            keyFindings: [
              "Hemoglobin levels within normal range (13.2 g/dL)",
              "White blood cell count slightly elevated (11,200/μL)",
              "Platelet count normal (280,000/μL)",
              "Blood glucose levels normal (95 mg/dL)"
            ],
            recommendations: [
              "Monitor white blood cell count in 2-4 weeks",
              "Maintain current diet and exercise routine",
              "Consider consultation with hematologist if WBC remains elevated",
              "Regular follow-up in 3 months"
            ],
            riskLevel: "Low",
            conditions: [
              "Slightly elevated white blood cell count"
            ],
            abnormalValues: [
              "White Blood Cells: 11.2 x10³/μL (Normal: 4.5-11.0)"
            ]
          }
        });
      }
      setLoading(false);
    }, 2000);
  }, [location.state, navigate]);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Low": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "High": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Processing Your Blood Report</h3>
              <p className="text-muted-foreground mt-2">
                Extracting data and analyzing results...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-700">Processing Error</h3>
              <p className="text-muted-foreground mt-2">{error}</p>
              <Button 
                onClick={() => navigate("/analysis")} 
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => navigate("/analysis")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Analysis
        </Button>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Blood Report Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">File: {results.fileName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Processed: {results.uploadedAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-gray-500" />
                  <Badge className={getRiskLevelColor(results.analysis.riskLevel)}>
                    Risk Level: {results.analysis.riskLevel}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-gray-900">{results.patientInfo.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{results.patientInfo.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Medical History</label>
                  <p className="text-gray-900">{results.patientInfo.medicalHistory}</p>
                </div>
              </CardContent>
            </Card>

            {/* Overall Health Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Health Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6">
                  <div className={`text-3xl font-bold mb-2 ${
                    results.analysis.riskLevel === "High" ? "text-red-600" :
                    results.analysis.riskLevel === "Medium" ? "text-yellow-600" : "text-green-600"
                  }`}>
                    {results.analysis.overallHealth}
                  </div>
                  <p className="text-gray-600">
                    Based on the analysis of your blood report parameters
                  </p>
                  {results.analysis.conditions.length > 0 && (
                    <div className="mt-4 space-y-1">
                      {results.analysis.conditions.map((condition, index) => (
                        <Badge key={index} variant="outline" className="mr-2">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Blood Test Values */}
          {results.bloodValues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Blood Test Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Parameter</th>
                        <th className="text-left p-3 font-medium">Value</th>
                        <th className="text-left p-3 font-medium">Normal Range</th>
                        <th className="text-left p-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.bloodValues.map((value, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3">{value.name}</td>
                          <td className="p-3">{value.value} {value.unit}</td>
                          <td className="p-3">{value.normalRange}</td>
                          <td className="p-3">
                            <Badge 
                              className={
                                value.status === "normal" ? "bg-green-100 text-green-800" :
                                value.status === "high" ? "bg-red-100 text-red-800" :
                                value.status === "low" ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-200 text-red-900"
                              }
                            >
                              {value.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Abnormal Values Alert */}
          {results.analysis.abnormalValues.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-5 w-5" />
                  Abnormal Values Detected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.analysis.abnormalValues.map((value, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                      <span className="font-medium text-red-700">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.analysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full mt-2"></div>
                    <p className="text-gray-700">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Extracted Text */}
          <Card>
            <CardHeader>
              <CardTitle>Extracted Text from Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {results.extractedText}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4 justify-center flex-wrap">
                <Button onClick={() => window.print()} variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Report
                </Button>
                <Button onClick={() => navigate("/analysis")}>
                  Analyze Another Report
                </Button>
                <Button onClick={() => navigate("/profile")} variant="outline">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Important Medical Disclaimer</h4>
                  <p className="text-yellow-700 text-sm mt-1">
                    This analysis is for educational and demonstration purposes only. 
                    Always consult with qualified healthcare professionals for medical advice, 
                    diagnosis, or treatment. Do not rely solely on this automated analysis.
                    The AI interpretation may not capture all nuances of your medical condition.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
