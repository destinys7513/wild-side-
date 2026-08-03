import { Suspense, lazy } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { useUpdateChecker } from "@/hooks/useUpdateChecker";

const Home = lazy(() => import("@/pages/Home"));
const Actualizaciones = lazy(() => import("@/pages/Actualizaciones"));
const MetaCampeones = lazy(() => import("@/pages/meta/MetaCampeones"));
const MetaItems = lazy(() => import("@/pages/meta/MetaItems"));
const MetaRunas = lazy(() => import("@/pages/meta/MetaRunas"));
const Login = lazy(() => import("@/pages/Login"));
const Perfil = lazy(() => import("@/pages/Perfil"));
const Calendario = lazy(() => import("@/pages/Calendario"));
const Puntos = lazy(() => import("@/pages/Puntos"));
const Admin = lazy(() => import("@/pages/Admin"));
const NotFound = lazy(() => import("@/pages/not-found"));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

function Router() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/actualizaciones" component={Actualizaciones} />
          <Route path="/meta/campeones" component={MetaCampeones} />
          <Route path="/meta/items" component={MetaItems} />
          <Route path="/meta/runas" component={MetaRunas} />
          <Route path="/login" component={Login} />
          <Route path="/perfil" component={Perfil} />
          <Route path="/calendario" component={Calendario} />
          <Route path="/puntos" component={Puntos} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      <Footer />
    </>
  );
}

function AppWithUpdates() {
  useUpdateChecker();
  return (
    <AuthProvider>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </AuthProvider>
  );
}

function App() {
  return <AppWithUpdates />;
}

export default App;