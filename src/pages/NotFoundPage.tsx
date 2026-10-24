import { Link } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

export function NotFoundPage() {
  return (
    <PageContainer className="grid min-h-[75vh] place-items-center">
      <Card className="w-full max-w-lg border border-[#E6E4DD] bg-[#FFFFFF] shadow-sm">
        <CardContent className="py-14 text-center">
          <p className="font-display text-6xl font-light text-[#D8C8A8]">404</p>
          <h1 className="mt-3 font-display text-2xl font-medium text-[#252724]">This idea wandered off.</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#5C605A]">
            The project record or page you’re looking for could not be found in this archive.
          </p>
          <Button asChild className="mt-6">
            <Link to="/">Return to archive</Link>
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
