export class ContentType {
  contentTypeId: string | undefined;
  contentTypeName: string | undefined;

  fileExtensions: FileExtension[] = [];
}

export class FileExtension {
  fileExtensionId: string | undefined;
  contentTypeId: string | undefined;
  fileExtensionName: string | undefined;
  contentType: ContentType | undefined;
}
