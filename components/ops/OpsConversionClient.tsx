"use client";

import { useState } from "react";
import OpsPinModal from "./OpsPinModal";
import OpsConversionDashboard from "./OpsConversionDashboard";

interface Props {
  initialAuthenticated: boolean;
  initialData: any;
}

export default function OpsConversionClient({
  initialAuthenticated,
  initialData,
}: Props) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);

  if (!authenticated) {
    return <OpsPinModal onSuccess={() => setAuthenticated(true)} />;
  }

  return <OpsConversionDashboard initialData={initialData} />;
}
