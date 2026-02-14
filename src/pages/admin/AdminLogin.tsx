import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || ""}/api/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        },
      );
      if (!res.ok) throw new Error("Login gagal");
      const data = await res.json();
      const token = data.token;
      if (!token) throw new Error("Token tidak diterima");
      localStorage.setItem("admin_token", token);
      // keep backward-compatible flag for other pages if needed
      localStorage.setItem("coconut-admin", "true");
      navigate("/admin/dashboard");
    } catch (err) {
      toast({
        title: "Login Gagal",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center gradient-hero p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="rounded-2xl border bg-card/95 backdrop-blur-sm p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
              <Link
                to="/"
                className="group flex items-center justify-center transition-all hover:scale-105"
              >
                <img
                  src="/logo-ccn.png"
                  alt="COCONUT CC"
                  className="h-16 w-auto object-contain transition-all duration-300 group-hover:scale-110"
                />
              </Link>
            </div>
            <h1 className="font-display text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">
              COCONUT Computer Club
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full gradient-primary border-0 text-primary-foreground font-semibold"
            >
              <Lock className="mr-2 h-4 w-4" /> Login
            </Button>
          </form>

          {import.meta.env.VITE_ADMIN_DEMO_USER &&
          import.meta.env.VITE_ADMIN_DEMO_PASS ? (
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Demo: {import.meta.env.VITE_ADMIN_DEMO_USER} /{" "}
              {import.meta.env.VITE_ADMIN_DEMO_PASS}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
