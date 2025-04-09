declare namespace API {
  type AiGenerateQuestionRequest = {
    appId?: number;
    optionNumber?: number;
    questionNumber?: number;
  };

  // 基础响应类型
  type BaseResponse<T> = {
    code: number;
    data: T;
    message: string;
    success: boolean;
  };

  // 字符串响应
  type BaseResponseString = BaseResponse<string>;

  // 布尔响应
  type BaseResponseBoolean = BaseResponse<boolean>;

  // Long响应
  type BaseResponseLong = BaseResponse<number>;

  // 通用对象响应
  type BaseResponseObject = BaseResponse<Record<string, any>>;

  // 标签相关类型
  type TagAddRequest = {
    name: string;
    color?: string;
    description?: string;
  };

  type TagUpdateRequest = {
    tagId: string;
    name?: string;
    color?: string;
    description?: string;
  };

  type TagQueryRequest = {
    current: number;
    pageSize: number;
    userId?: number;
    name?: string;
    sortField?: string;
    sortOrder?: string;
  };

  type Tags = {
    tagId: string;
    name: string;
    color?: string;
    description?: string;
    usageCount: number;
    userId: number;
    createTime: Date;
  };

  // 标签响应类型
  type BaseResponseTags = BaseResponse<Tags>;
  type BaseResponseListTags = BaseResponse<Tags[]>;
  type BaseResponsePageTags = BaseResponse<{
    records: Tags[];
    total: number;
    size: number;
    current: number;
  }>;
  type BaseResponseMapStringInteger = BaseResponse<Record<string, number>>;

  // 笔记相关类型
  type NotesAddRequest = {
    title: string;
    content: string;
    tags?: string[];
  };

  type NotesUpdateRequest = {
    id: string;
    title?: string;
    content?: string;
    status?: number;
  };

  type NotesEditRequest = {
    id: string;
    title?: string;
    content?: string;
    tags?: string[];
  };

  type NotesQueryRequest = {
    current: number;
    pageSize: number;
    userId?: number;
    title?: string;
    tags?: string[];
    sortField?: string;
    sortOrder?: string;
  };

  type Notes = {
    id: string;
    title: string;
    content: string;
    userId: number;
    status: number;
    createTime: Date;
    updateTime: Date;
  };

  type NotesVO = {
    id: string;
    title: string;
    content: string;
    userId: number;
    userVO?: UserVO;
    tags?: Tags[];
    status: number;
    createTime: Date;
    updateTime: Date;
  };

  // 笔记响应类型
  type BaseResponseNotesVO = BaseResponse<NotesVO>;
  type BaseResponsePageNotes = BaseResponse<{
    records: Notes[];
    total: number;
    size: number;
    current: number;
  }>;
  type BaseResponsePageNotesVO = BaseResponse<{
    records: NotesVO[];
    total: number;
    size: number;
    current: number;
  }>;

  // 通用删除请求
  type DeleteRequest = {
    id: string;
  };

  // 备份相关类型
  type BackupCreateRequest = {
    noteIds?: string[];
    encryptionKey?: string;
  };

  type BackupRestoreRequest = {
    backupId: string;
    noteIds?: string[];
    encryptionKey?: string;
  };

  type Backups = {
    backupId: string;
    userId: number;
    fileName: string;
    fileSize: number;
    noteCount: number;
    encryptionEnabled: boolean;
    createTime: Date;
  };

  // 备份响应类型
  type BaseResponseBackups = BaseResponse<Backups>;
  type BaseResponseListBackups = BaseResponse<Backups[]>;

  // 设置相关类型
  type SettingsUpdateRequest = {
    themeMode?: string;
    editorConfig?: Record<string, any>;
    syncConfig?: Record<string, any>;
    backupStrategy?: Record<string, any>;
  };

  type Settings = {
    id: number;
    userId: number;
    themeMode: string;
    editorConfig: Record<string, any>;
    syncConfig: Record<string, any>;
    backupStrategy: Record<string, any>;
    createTime: Date;
    updateTime: Date;
  };

  // 设置响应类型
  type BaseResponseSettings = BaseResponse<Settings>;

  // 笔记链接相关类型
  type NoteLinks = {
    id: number;
    sourceNote: string;
    targetNote: string;
    linkType: string;
    createTime: Date;
  };

  // 笔记链接响应类型
  type BaseResponseListNoteLinks = BaseResponse<NoteLinks[]>;

  // 用户相关类型
  type UserRegisterRequest = {
    userAccount: string;
    userPassword: string;
    checkPassword: string;
  };

  type UserLoginRequest = {
    userAccount: string;
    userPassword: string;
  };

  type UserAddRequest = {
    userAccount: string;
    userName: string;
    userRole: string;
    userAvatar?: string;
  };

  type UserUpdateRequest = {
    id: number;
    userName?: string;
    userRole?: string;
    userAvatar?: string;
  };

  type UserUpdateMyRequest = {
    userName?: string;
    userAvatar?: string;
  };

  type UserQueryRequest = {
    current: number;
    pageSize: number;
    id?: number;
    userName?: string;
    userRole?: string;
  };

  type User = {
    id: number;
    userAccount: string;
    userName: string;
    userAvatar?: string;
    userRole: string;
    createTime: Date;
    updateTime: Date;
  };

  type UserVO = {
    id: number;
    userName: string;
    userAvatar?: string;
    userRole: string;
    createTime: Date;
  };

  type LoginUserVO = {
    id: number;
    userAccount: string;
    userName: string;
    userAvatar?: string;
    userRole: string;
    createTime: Date;
    updateTime: Date;
    token: string;
  };

  // 用户响应类型
  type BaseResponseUser = BaseResponse<User>;
  type BaseResponseUserVO = BaseResponse<UserVO>;
  type BaseResponseLoginUserVO = BaseResponse<LoginUserVO>;
  type BaseResponsePageUser = BaseResponse<{
    records: User[];
    total: number;
    size: number;
    current: number;
  }>;
  type BaseResponsePageUserVO = BaseResponse<{
    records: UserVO[];
    total: number;
    size: number;
    current: number;
  }>;

  // 模板相关类型
  type TemplateAddRequest = {
    title: string;
    content: string;
    description?: string;
    tags?: string[];
  };

  type TemplateUpdateRequest = {
    templateId: string;
    title?: string;
    content?: string;
    description?: string;
    tags?: string[];
  };

  type TemplateQueryRequest = {
    current: number;
    pageSize: number;
    userId?: number;
    title?: string;
    tags?: string[];
    sortField?: string;
    sortOrder?: string;
  };

  type Templates = {
    templateId: string;
    title: string;
    content: string;
    description?: string;
    tags?: string[];
    userId: number;
    usedCount: number;
    createTime: Date;
    updateTime: Date;
  };

  // 模板响应类型
  type BaseResponseTemplates = BaseResponse<Templates>;
  type BaseResponseListTemplates = BaseResponse<Templates[]>;
  type BaseResponsePageTemplates = BaseResponse<{
    records: Templates[];
    total: number;
    size: number;
    current: number;
  }>;
} 