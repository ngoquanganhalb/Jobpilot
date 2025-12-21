import { RootState } from "@redux/store";
import { createContext, ReactNode, useContext, useMemo } from "react";
import { useSelector } from "react-redux";

interface PermissionContextType {
  checkHasPermission: (scope: string[]) => boolean;
  checkHasAllPermissions: (scope: string[]) => boolean;
  getMissingPermissions: (scope: string[]) => string[];
}

const INITIAL_VALUE: PermissionContextType = {
  checkHasPermission: () => false,
  checkHasAllPermissions: () => false,
  getMissingPermissions: () => [],
};

const PermissionContext = createContext(INITIAL_VALUE);

interface PermissionProviderProps {
  children: ReactNode;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({
  children,
}) => {
  const permissionsObjList =
    useSelector((state: RootState) => state.auth.permissions) ?? [];
  const permissions = permissionsObjList.map((i) => i.code);
  const permissionCache = useMemo(() => new Set(permissions), [permissions]);
  console.log("permissionCache", permissionCache);
  const checkHasPermission = (scopes: string[]) => {
    console.log("scopes", scopes);
    if (scopes.length === 0) return true;
    return scopes.some((scope) => permissionCache.has(scope));
  };
  const checkHasAllPermissions = (scopes: string[]) => {
    if (scopes.length === 0) return true;
    return scopes.every((scope) => permissionCache.has(scope));
  };
  const getMissingPermissions = (scopes: string[]) => {
    if (scopes.length === 0) return [];
    return scopes.filter((scope) => !permissionCache.has(scope));
  };
  const contextValue = useMemo(
    () => ({
      checkHasPermission,
      checkHasAllPermissions,
      getMissingPermissions,
    }),
    [permissionCache]
  );
  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  );
};
export const usePermissionContext = () => useContext(PermissionContext);
//instead of do this : const {} = useContext(PermissionContext)
//=> const{} = usePermissionContext
