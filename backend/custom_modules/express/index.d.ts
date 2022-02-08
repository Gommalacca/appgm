declare namespace Express {
  interface Request {
    user?: {
      id: string;
      role: string;
      valid: boolean;
      isStaff: boolean;
      company: ICompany | undefined;
      employee: ICompany[] | undefined;
      projects: IProjectAssignment[] | undefined;
      firstname: string | undefined;
      lastname: string | undefined;
    };
  }
}
interface IProjectAssignment {
  ProjectId: number;
}
interface IEmployeeAssignment {
  CompanyId: number;
  AdvancedUser: boolean;
}
interface ICompany {
  id: number;
  ownerId: string;
  moderatorId: string;
  name: string;
  projectLimit: number;
  isStaff: boolean;
  EmployeesAssignments: IEmployeeAssignment
}
