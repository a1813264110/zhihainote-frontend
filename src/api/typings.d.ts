declare namespace API {
  type _1 = {
    /** 当前页号 */
    current: number;
    maxCreateTime?: string;
    minCreateTime?: string;
    noteId?: string;
    /** 页面大小 */
    pageSize: number;
    /** 排序字段 */
    sortField?: string;
    /** 排序顺序 */
    sortOrder?: string;
    userId?: string;
    versionId?: string;
  };

  type _2 = {
    content?: string;
    /** 当前页号 */
    current: number;
    directoryPath?: string;
    id?: string;
    isDelete?: number;
    notId?: string;
    /** 页面大小 */
    pageSize: number;
    searchText?: string;
    /** 排序字段 */
    sortField?: string;
    /** 排序顺序 */
    sortOrder?: string;
    tags?: string[];
    title?: string;
    userId?: string;
  };

  type _3 = {
    content?: string;
    /** 当前页号 */
    current: number;
    id?: string;
    notId?: string;
    /** 页面大小 */
    pageSize: number;
    searchText?: string;
    /** 排序字段 */
    sortField?: string;
    /** 排序顺序 */
    sortOrder?: string;
    tags?: string[];
    title?: string;
    userId?: string;
  };

  type _4 = {
    content?: string;
    /** 当前页号 */
    current: number;
    id?: string;
    maxLastUsed?: string;
    maxUsedCount?: number;
    minLastUsed?: string;
    minUsedCount?: number;
    name?: string;
    notId?: string;
    /** 页面大小 */
    pageSize: number;
    searchText?: string;
    /** 排序字段 */
    sortField?: string;
    /** 排序顺序 */
    sortOrder?: string;
    userId?: string;
  };

  type _5 = {
    /** 当前页号 */
    current: number;
    id?: string;
    mpOpenId?: string;
    /** 页面大小 */
    pageSize: number;
    /** 排序字段 */
    sortField?: string;
    /** 排序顺序 */
    sortOrder?: string;
    unionId?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type addTagToNoteUsingPOSTParams = {
    /** noteId */
    noteId: string;
    /** tagId */
    tagId: string;
  };

  type BackupStrategyDTO = {
    backupOnExit?: boolean;
    backupType?: string;
    enabled?: boolean;
    encryptionKey?: string;
    frequency?: string;
    interval?: number;
    lastBackup?: string;
    retention?: number;
    storagePath?: string;
  };

  type BackupsVO = {
    backupId?: string;
    backupSize?: string;
    createTime?: string;
    formattedSize?: string;
    noteCount?: number;
    noteIds?: number[];
    status?: string;
    user?: UserVO;
  };

  type BaseResponse = {
    code?: number;
    data?: Record<string, any>;
    message?: string;
  };

  type BaseResponseOfArrayOfstring = {
    code?: number;
    data?: string[];
    message?: string;
  };

  type BaseResponseOfBackupsVO = {
    code?: number;
    data?: BackupsVO;
    message?: string;
  };

  type BaseResponseOfboolean = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseOfListOflong = {
    code?: number;
    data?: number[];
    message?: string;
  };

  type BaseResponseOfListOfNotesVO = {
    code?: number;
    data?: NotesVO[];
    message?: string;
  };

  type BaseResponseOfListOfTagsVO = {
    code?: number;
    data?: TagsVO[];
    message?: string;
  };

  type BaseResponseOfListOfTemplatesVO = {
    code?: number;
    data?: TemplatesVO[];
    message?: string;
  };

  type BaseResponseOfLoginUserVO = {
    code?: number;
    data?: LoginUserVO;
    message?: string;
  };

  type BaseResponseOflong = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseOfMapOfstringAndobject = {
    code?: number;
    data?: Record<string, any>;
    message?: string;
  };

  type BaseResponseOfNotesVO = {
    code?: number;
    data?: NotesVO;
    message?: string;
  };

  type BaseResponseOfNoteVersionsVO = {
    code?: number;
    data?: NoteVersionsVO;
    message?: string;
  };

  type BaseResponseOfPageOfBackupsVO = {
    code?: number;
    data?: PageOfBackupsVO;
    message?: string;
  };

  type BaseResponseOfPageOfNotes = {
    code?: number;
    data?: PageOfNotes;
    message?: string;
  };

  type BaseResponseOfPageOfNotesVO = {
    code?: number;
    data?: PageOfNotesVO;
    message?: string;
  };

  type BaseResponseOfPageOfNoteVersionsVO = {
    code?: number;
    data?: PageOfNoteVersionsVO;
    message?: string;
  };

  type BaseResponseOfPageOfTags = {
    code?: number;
    data?: PageOfTags;
    message?: string;
  };

  type BaseResponseOfPageOfTagsVO = {
    code?: number;
    data?: PageOfTagsVO;
    message?: string;
  };

  type BaseResponseOfPageOfTemplates = {
    code?: number;
    data?: PageOfTemplates;
    message?: string;
  };

  type BaseResponseOfPageOfTemplatesVO = {
    code?: number;
    data?: PageOfTemplatesVO;
    message?: string;
  };

  type BaseResponseOfPageOfUser = {
    code?: number;
    data?: PageOfUser;
    message?: string;
  };

  type BaseResponseOfSettingsVO = {
    code?: number;
    data?: SettingsVO;
    message?: string;
  };

  type BaseResponseOfstring = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseOfTagsVO = {
    code?: number;
    data?: TagsVO;
    message?: string;
  };

  type BaseResponseOfTemplatesVO = {
    code?: number;
    data?: TemplatesVO;
    message?: string;
  };

  type BaseResponseOfUser = {
    code?: number;
    data?: User;
    message?: string;
  };

  type BaseResponseOfUserVO = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type cleanupOldVersionsUsingPOSTParams = {
    /** beforeDate */
    beforeDate: string;
    /** userId */
    userId?: string;
  };

  type DeleteRequest = {
    id?: string;
  };

  type EditorConfigDTO = {
    autoSave?: number;
    fontFamily?: string;
    fontSize?: number;
    lineNumbers?: boolean;
    spellCheck?: boolean;
    tabSize?: number;
    theme?: string;
  };

  type exportTemplateUsingGETParams = {
    /** templateId */
    templateId: string;
  };

  type getApiExampleUsingGETParams = {
    /** apiName */
    apiName: string;
  };

  type getBackupByIdUsingGETParams = {
    /** id */
    id: string;
  };

  type getNotesByTagIdUsingGETParams = {
    /** tagId */
    tagId: string;
  };

  type getNotesVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getRecommendedTemplatesUsingGETParams = {
    /** limit */
    limit?: number;
  };

  type getTagCloudUsingGETParams = {
    /** limit */
    limit?: number;
  };

  type getTagsByNoteIdUsingGETParams = {
    /** noteId */
    noteId: string;
  };

  type getTagsVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getTemplatesVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getVersionByIdUsingGETParams = {
    /** id */
    id: string;
  };

  type listNotesByDirectoryUsingGETParams = {
    /** directoryPath */
    directoryPath?: string;
  };

  type LoginUserVO = {
    createTime?: string;
    id?: string;
    updateTime?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type Notes = {
    checksum?: string;
    content?: string;
    createTime?: string;
    deleteTime?: string;
    directoryPath?: string;
    id?: string;
    isDelete?: number;
    readTime?: number;
    title?: string;
    updateTime?: string;
    userId?: string;
    wordCount?: number;
  };

  type NotesAddRequest = {
    content?: string;
    tags?: string[];
    title?: string;
  };

  type NotesEditRequest = {
    content?: string;
    id?: string;
    tags?: string[];
    title?: string;
  };

  type NotesUpdateRequest = {
    content?: string;
    id?: string;
    tags?: string[];
    title?: string;
  };

  type NotesVO = {
    content?: string;
    createTime?: string;
    id?: string;
    tagList?: string[];
    title?: string;
    updateTime?: string;
    user?: UserVO;
    userId?: string;
  };

  type NoteVersionsVO = {
    createTime?: string;
    diffContent?: string;
    editorMetadata?: Record<string, any>;
    noteId?: string;
    noteTitle?: string;
    user?: UserVO;
    versionId?: string;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageOfBackupsVO = {
    countId?: string;
    current?: number;
    maxLimit?: string;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: BackupsVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageOfNotes = {
    countId?: string;
    current?: number;
    maxLimit?: string;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Notes[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageOfNotesVO = {
    countId?: string;
    current?: number;
    maxLimit?: string;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: NotesVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageOfNoteVersionsVO = {
    countId?: string;
    current?: number;
    maxLimit?: string;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: NoteVersionsVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageOfTags = {
    countId?: string;
    current?: number;
    maxLimit?: string;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Tags[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageOfTagsVO = {
    countId?: string;
    current?: number;
    maxLimit?: string;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: TagsVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageOfTemplates = {
    countId?: string;
    current?: number;
    maxLimit?: string;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Templates[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageOfTemplatesVO = {
    countId?: string;
    current?: number;
    maxLimit?: string;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: TemplatesVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageOfUser = {
    countId?: string;
    current?: number;
    maxLimit?: string;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: User[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type Pinyin__ = {
    backupId?: string;
    /** 当前页号 */
    current: number;
    maxBackupSize?: string;
    maxCreateTime?: string;
    minBackupSize?: string;
    minCreateTime?: string;
    /** 页面大小 */
    pageSize: number;
    /** 排序字段 */
    sortField?: string;
    /** 排序顺序 */
    sortOrder?: string;
    status?: string;
    userId?: string;
  };

  type previewTemplateUsingPOSTParams = {
    /** templateId */
    templateId: string;
  };

  type removeTagFromNoteUsingPOSTParams = {
    /** noteId */
    noteId: string;
    /** tagId */
    tagId: string;
  };

  type SettingsUpdateRequest = {
    backupStrategy?: Record<string, any>;
    editorConfig?: Record<string, any>;
    syncConfig?: Record<string, any>;
  };

  type SettingsVO = {
    backupStrategy?: BackupStrategyDTO;
    createTime?: string;
    editorConfig?: EditorConfigDTO;
    syncConfig?: SyncConfigDTO;
    updateTime?: string;
    userId?: string;
  };

  type SyncConfigDTO = {
    autoSync?: boolean;
    conflictStrategy?: string;
    syncInterval?: number;
    syncOnEdit?: boolean;
    syncOnNetworkRestore?: boolean;
    syncOnStartup?: boolean;
  };

  type Tags = {
    color?: string;
    createTime?: string;
    id?: string;
    name?: string;
    usageCount?: number;
    userId?: string;
  };

  type TagsAddRequest = {
    color?: string;
    content?: string;
    title?: string;
  };

  type TagsEditRequest = {
    color?: string;
    content?: string;
    id?: string;
    title?: string;
  };

  type TagsUpdateRequest = {
    content?: string;
    id?: string;
    tags?: string[];
    title?: string;
  };

  type TagsVO = {
    color?: string;
    createTime?: string;
    id?: string;
    name?: string;
    usageCount?: number;
    user?: UserVO;
    userId?: string;
  };

  type Templates = {
    content?: string;
    id?: string;
    lastUsed?: string;
    name?: string;
    usedCount?: number;
    userId?: string;
    variables?: Record<string, any>;
  };

  type TemplatesAddRequest = {
    content?: string;
    name?: string;
    variables?: Record<string, any>;
  };

  type TemplatesEditRequest = {
    content?: string;
    id?: string;
    name?: string;
    variables?: Record<string, any>;
  };

  type TemplatesUpdateRequest = {
    content?: string;
    id?: string;
    name?: string;
    variables?: Record<string, any>;
  };

  type TemplatesVO = {
    content?: string;
    createTime?: string;
    id?: string;
    lastUsed?: string;
    name?: string;
    usedCount?: number;
    user?: UserVO;
    userId?: string;
    variables?: Record<string, any>;
  };

  type uploadFileUsingPOSTParams = {
    biz?: string;
  };

  type User = {
    createTime?: string;
    id?: string;
    isDelete?: number;
    mpOpenId?: string;
    unionId?: string;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserAddRequest = {
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserRegisterRequest = {
    checkPassword?: string;
    userAccount?: string;
    userPassword?: string;
  };

  type UserUpdateMyRequest = {
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
  };

  type UserUpdateRequest = {
    id?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserVO = {
    createTime?: string;
    id?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };
}
