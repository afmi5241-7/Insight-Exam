import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DarkModeProvider } from "@/lib/dark-mode";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import SubmitQuestion from "@/pages/SubmitQuestion";
import Browse from "@/pages/Browse";
import Analytics from "@/pages/Analytics";
import Admin from "@/pages/Admin";
import ChapterAnalytics from "@/pages/ChapterAnalytics";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 30_000 } },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/submit" component={SubmitQuestion} />
      <Route path="/analytics" component={Browse} />
      <Route path="/analytics/:id" component={Analytics} />
      <Route path="/analytics/:id/chapter/:chapter" component={ChapterAnalytics} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </DarkModeProvider>
  );
}
