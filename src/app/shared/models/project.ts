import { ProjectFile } from "./project_file";

export class Project{
    projectId: string | undefined;
    projectName: string| undefined;
    projectLocation: string| undefined;
    projectFiles: ProjectFile[] = [];

}