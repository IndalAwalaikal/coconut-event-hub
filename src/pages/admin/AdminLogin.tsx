import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Monitor, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("coconut-admin", "true");
      navigate("/admin/dashboard");
    } else {
      toast({ title: "Login Gagal", description: "Username atau password salah", variant: "destructive" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center gradient-hero p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="rounded-2xl border bg-card/95 backdrop-blur-sm p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary mb-4">
              <Monitor className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">COCONUT Computer Club</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input placeholder="Masukkan username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" placeholder="Masukkan password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground font-semibold">
              <Lock className="mr-2 h-4 w-4" /> Login
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo: admin / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
