"use client";

import React from "react";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const QueryProvider = ({ children, dehydratedState }) => {
  const [queryClient] = React.useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: 0 } } })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
};

export default QueryProvider;
