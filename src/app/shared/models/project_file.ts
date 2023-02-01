export class ProjectFile {
  projectFileId: string | undefined;
  projectId: string | undefined;
  contentTypeId: string | undefined;
  fileExtensionId: string | undefined;
  categoryId: string | undefined;
  fileName: string | undefined;
  filePath: string | undefined;
  contentTitle: string | undefined;
  contentDescription: string | undefined;
  note: string | undefined;
  keyWords: string| undefined;
  productionDate: Date | undefined;
}

export class ProjectFileView extends ProjectFile {
  projectName: string | undefined;
  categoryName: string | undefined;
  contentTypeName: string | undefined;
  fileExtensionName: string | undefined;
}
