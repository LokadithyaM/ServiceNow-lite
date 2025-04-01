import { Suspense } from "react";
import IncidentDiscussionComponent from "../components/incidentDiscussionComponent";

export default function IncidentDiscussionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IncidentDiscussionComponent />
    </Suspense>
  );
}
