import { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Activity,
  User,
  Mail,
  Phone,
  Calendar,
  Heart,
  FileText,
  Settings,
  LogOut,
  Save,
  Edit,
  Shield,
  ChevronRight,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateProfile, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    allergies: "",
    currentMedications: "",
    medicalHistory: "",
    emergencyContact: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
        bloodType: user.bloodType || "",
        allergies: user.allergies || "",
        currentMedications: user.currentMedications || "",
        medicalHistory: user.medicalHistory || "",
        emergencyContact: user.emergencyContact || "",
      });
    }
  }, [user, isAuthenticated, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");

    const success = await updateProfile(formData);

    if (success) {
      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } else {
      setMessage("Failed to update profile. Please try again.");
    }

    setIsSaving(false);

    // Clear message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAge = (dateString: string) => {
    if (!dateString) return null;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 hover:opacity-80"
            >
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">BloodAI</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/analysis")}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              New Analysis
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">
                      Member since {formatDate(user.createdAt)}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                className="gap-2"
              >
                {isEditing ? (
                  <>Cancel</>
                ) : (
                  <>
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>

            {message && (
              <Alert
                className={
                  message.includes("success")
                    ? "border-green-200 bg-green-50"
                    : ""
                }
              >
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal" className="gap-2">
                <User className="h-4 w-4" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="medical" className="gap-2">
                <Heart className="h-4 w-4" />
                Medical Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Your basic personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                        <User className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                        <Mail className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Your phone number"
                          className="pl-10"
                        />
                        <Phone className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <div className="relative">
                        <Input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                        <Calendar className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                      </div>
                      {formData.dateOfBirth && (
                        <p className="text-sm text-muted-foreground">
                          Age: {calculateAge(formData.dateOfBirth)} years
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        onValueChange={handleSelectChange("gender")}
                        value={formData.gender}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">
                            Prefer not to say
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">
                        Emergency Contact
                      </Label>
                      <Input
                        id="emergencyContact"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Emergency contact number"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medical Profile */}
            <TabsContent value="medical">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Profile</CardTitle>
                  <CardDescription>
                    Your medical information for better analysis accuracy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Select
                        onValueChange={handleSelectChange("bloodType")}
                        value={formData.bloodType}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a-positive">A+</SelectItem>
                          <SelectItem value="a-negative">A-</SelectItem>
                          <SelectItem value="b-positive">B+</SelectItem>
                          <SelectItem value="b-negative">B-</SelectItem>
                          <SelectItem value="ab-positive">AB+</SelectItem>
                          <SelectItem value="ab-negative">AB-</SelectItem>
                          <SelectItem value="o-positive">O+</SelectItem>
                          <SelectItem value="o-negative">O-</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Known Allergies</Label>
                    <Textarea
                      id="allergies"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="List any known allergies (food, medications, environmental)"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentMedications">
                      Current Medications
                    </Label>
                    <Textarea
                      id="currentMedications"
                      name="currentMedications"
                      value={formData.currentMedications}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="List current medications, supplements, and dosages"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <Textarea
                      id="medicalHistory"
                      name="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Previous surgeries, chronic conditions, family medical history"
                      rows={4}
                    />
                  </div>

                  {isEditing && (
                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>
                      Manage your account security and data privacy
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">
                            Two-Factor Authentication
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Data Export</p>
                          <p className="text-sm text-muted-foreground">
                            Download all your data and analysis history
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <LogOut className="h-5 w-5 text-destructive" />
                        <div>
                          <p className="font-medium text-destructive">
                            Delete Account
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all data
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
