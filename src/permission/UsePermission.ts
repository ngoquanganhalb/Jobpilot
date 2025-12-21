import { useMemo } from "react";
import { usePermissionContext } from "./PermissionContext";

export const usePermission = (scopes: string[]) => {
  const { checkHasAllPermissions, checkHasPermission, getMissingPermissions } =
    usePermissionContext();
  const hasPermission = useMemo<boolean>(() => {
    return checkHasPermission(scopes);
  }, [checkHasPermission, scopes]);

  const hasAllPermissions = useMemo<boolean>(() => {
    return checkHasAllPermissions(scopes);
  }, [scopes, checkHasAllPermissions]);

  const missingPermissions = useMemo<string[]>(() => {
    return getMissingPermissions(scopes);
  }, [getMissingPermissions, scopes]);

  return {
    hasPermission,
    hasAllPermissions,
    missingPermissions,
  };
};
