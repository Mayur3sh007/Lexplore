import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

// Simulated admin access
const isAdmin = false; // Change this to true to simulate admin access

const App = dynamic(() => import("./app"), { ssr: false });

const AdminPage = () => {
  // Simulate admin check
  if (!isAdmin) {
    // Redirect to the home page if not an admin
    redirect("/");
  }

  return <App />;
};

export default AdminPage;
