import { ReactElement } from "react";
import Page403 from "./Page403";
import { usePermission } from "./UsePermission";

type PermissionGateProps = {
  children: ReactElement;
  scopes: string[];
};
export const PermissionGate = (props: PermissionGateProps): ReactElement => {
  const { children, scopes } = props;
  const { hasPermission } = usePermission(scopes);
  if (!hasPermission) return <Page403 />;
  return children;
};
