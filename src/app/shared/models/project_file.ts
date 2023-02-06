import { Category } from "./category";
import { FileExtension } from "./content_type";

export class ProjectFile {
  projectFileId: string | undefined;
  projectId: string | undefined;
  fileExtensionId: string | undefined;
  categoryId: string | undefined;
  fileName: string | undefined;
  filePath: string | undefined;
  contentTitle: string | undefined;
  contentDescription: string | undefined;
  note: string | undefined;
  keyWords: string| undefined;
  productionDate: Date | undefined;
  fileExtension: FileExtension | undefined;
  category: Category | undefined;

  constructor(fileName:string, fileExtension?:FileExtension, category? :Category){
    this.fileName = fileName;
    this.fileExtension = fileExtension;
    this.fileExtensionId = fileExtension?.fileExtensionId;
    this.category = category;
    this.categoryId = category?.categoryId;
  }


}

export class ProjectFileView extends ProjectFile {
  projectName: string | undefined;
  categoryName: string | undefined;
  contentTypeName: string | undefined;
  fileExtensionName: string | undefined;
}
