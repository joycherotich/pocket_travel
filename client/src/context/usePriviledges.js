import { useAuth } from "./AuthContext";

const rolesPrivileges = {
  admin: ["manageUsers", "managePackages", "viewReports", "managePayments"],
  staff: ["viewBookings", "manageClients", "viewReports", "manageHotels"],
  customer: ["viewBooking", "editProfile"],
};

export function usePriviledges() {
  const { user } = useAuth();

  const userPrivileges = user ? rolesPrivileges[user.role] || [] : [];

  const hasPrivilege = (privilege) => userPrivileges.includes(privilege);

  const hasAllPrivileges = (privileges) =>
    privileges.every((p) => userPrivileges.includes(p));

  return { userPrivileges, hasPrivilege, hasAllPrivileges };
}
// userName	Joy Admin	
// userRole	admin	
// userEmail	letimjoy7@gmail.com
