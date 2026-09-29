"use client";

import { useState } from "react";
import OpsPinModal from "./OpsPinModal";
import OpsDashboard from "./OpsDashboard";

interface Props {
  initialAuthenticated: boolean;
}

export default function OpsPageClient({ initialAuthenticated }: Props) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);

  if (!authenticated) {
    return <OpsPinModal onSuccess={() => setAuthenticated(true)} />;
  }

  return <OpsDashboard onLogout={() => setAuthenticated(false)} />;
}
