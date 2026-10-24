import { Link } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

export function NotFoundPage() {
  return <PageContainer className="grid min-h-[80vh] place-items-center"><Card className="w-full max-w-xl"><CardContent className="py-14 text-center"><p className="font-display text-7xl font-bold text-violet-300/25">404</p><h1 className="mt-4 font-display text-3xl font-bold text-white">This idea wandered off.</h1><p className="mt-3 text-slate-400">The page you’re looking for isn’t in this archive.</p><Button asChild className="mt-7"><Link to="/">Return to all projects</Link></Button></CardContent></Card></PageContainer>;
}
