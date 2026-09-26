import { lazy, Suspense, type ComponentType } from "react";
import { Box, CircularProgress } from "@mui/material";

export const lazyAdminPage = (
  loader: () => Promise<{ default: ComponentType<any> }>
): ComponentType<any> => {
  const LazyPage = lazy(loader);

  return function DeferredAdminPage(props: any) {
    return (
      <Suspense
        fallback={
          <Box sx={{ display: "grid", minHeight: 180, placeItems: "center" }}>
            <CircularProgress size={28} />
          </Box>
        }
      >
        <LazyPage {...props} />
      </Suspense>
    );
  };
};