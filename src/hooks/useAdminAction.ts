import { useState } from "react";
import { useNotify, useRefresh } from "react-admin";

type AdminAction = () => Promise<unknown>;

export const useAdminAction = () => {
  const notify = useNotify();
  const refresh = useRefresh();
  const [loading, setLoading] = useState(false);

  const execute = async (action: AdminAction, successMessage: string) => {
    setLoading(true);
    try {
      await action();
      notify(successMessage, { type: "success" });
      refresh();
      return true;
    } catch (error) {
      notify(
        error instanceof Error ? error.message : "Une erreur est survenue.",
        { type: "error" }
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};