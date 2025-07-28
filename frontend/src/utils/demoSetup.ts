export const setupDemoUser = () => {
  const demoUser = {
    id: "demo_user_123",
    email: "test@example.com",
    name: "Dr. Sarah Johnson",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1985-03-15",
    gender: "female",
    bloodType: "o-positive",
    allergies: "Penicillin, Shellfish",
    currentMedications: "Multivitamin, Vitamin D",
    medicalHistory: "No significant medical history. Regular checkups.",
    emergencyContact: "+1 (555) 987-6543",
    createdAt: "2024-01-01T00:00:00.000Z",
  };

  // Check if demo user already exists
  const usersData = localStorage.getItem("bloodai_users");
  const users = usersData ? JSON.parse(usersData) : [];

  const existingUser = users.find((u: any) => u.email === demoUser.email);
  if (!existingUser) {
    users.push(demoUser);
    localStorage.setItem("bloodai_users", JSON.stringify(users));

    // Set demo password
    const passwordsData = localStorage.getItem("bloodai_passwords");
    const passwords = passwordsData ? JSON.parse(passwordsData) : {};
    passwords[demoUser.id] = "password123";
    localStorage.setItem("bloodai_passwords", JSON.stringify(passwords));
  }
};
