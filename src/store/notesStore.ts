import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Message } from '@arco-design/web-vue';

// 由于API可能尚未实现，暂时注释掉API导入，使用模拟数据
// import { 
//   getNoteListUsingGet, 
//   getNoteDetailUsingGet, 
//   createNoteUsingPost, 
//   updateNoteUsingPut, 
//   deleteNoteUsingDelete 
// } from '@/api/notesApi';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const useNotesStore = defineStore('notes', () => {
  // 状态
  const notes = ref<Note[]>([]);
  const isLoading = ref(false);
  const currentFilter = ref('all'); // all, favorite, byTag
  const currentTag = ref('');
  const sortBy = ref('updatedAt'); // updatedAt, createdAt, title

  // 计算属性
  const filteredNotes = computed(() => {
    let result = [...notes.value];
    
    // 筛选
    if (currentFilter.value === 'favorite') {
      result = result.filter(note => note.isFavorite);
    } else if (currentFilter.value === 'byTag' && currentTag.value) {
      result = result.filter(note => note.tags.includes(currentTag.value));
    }
    
    // 排序
    result.sort((a, b) => {
      if (sortBy.value === 'updatedAt') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      } else if (sortBy.value === 'createdAt') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy.value === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
    
    return result;
  });

  // 方法
  const fetchNotes = async () => {
    isLoading.value = true;
    try {
      // 使用模拟数据
      notes.value = [
        {
          id: '1',
          title: 'Java集合框架详解',
          content: 'ArrayList、LinkedList和HashMap的底层实现原理与使用场景。ArrayList，底层使用数组实现，支持随机访问，适合读多写少的场景...',
          updatedAt: new Date('2023-03-01T10:00:00'),
          createdAt: new Date('2023-02-28T10:00:00'),
          tags: ['Java学习'],
          isFavorite: true
        },
        {
          id: '2',
          title: 'Spring Boot配置指南',
          content: '常见配置项的说明与最佳实践，包括数据源配置，Spring的各种设置...',
          updatedAt: new Date('2023-02-28T09:30:00'),
          createdAt: new Date('2023-02-27T09:30:00'),
          tags: ['Spring Boot'],
          isFavorite: false
        },
        {
          id: '3',
          title: '项目计划2023',
          content: '第一季度产品设计计划与里程碑节点安排...',
          updatedAt: new Date('2023-02-27T15:20:00'),
          createdAt: new Date('2023-02-26T15:20:00'),
          tags: ['项目计划'],
          isFavorite: false
        },
      ];
    } catch (error) {
      console.error('获取笔记列表失败:', error);
      Message.error('获取笔记列表失败');
    } finally {
      isLoading.value = false;
    }
  };

  const fetchNoteDetail = async (noteId: string) => {
    isLoading.value = true;
    try {
      // 返回模拟数据
      return notes.value.find(note => note.id === noteId);
    } catch (error) {
      console.error('获取笔记详情失败:', error);
      Message.error('获取笔记详情失败');
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const createNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    isLoading.value = true;
    try {
      // 模拟新增笔记
      const newNote: Note = {
        id: Date.now().toString(),
        ...noteData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      notes.value.unshift(newNote);
      Message.success('创建笔记成功');
      return newNote;
    } catch (error) {
      console.error('创建笔记失败:', error);
      Message.error('创建笔记失败');
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const updateNote = async (noteId: string, noteData: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>) => {
    isLoading.value = true;
    try {
      // 模拟更新笔记
      const index = notes.value.findIndex(note => note.id === noteId);
      if (index !== -1) {
        notes.value[index] = {
          ...notes.value[index],
          ...noteData,
          updatedAt: new Date()
        };
        Message.success('更新笔记成功');
        return true;
      }
      return false;
    } catch (error) {
      console.error('更新笔记失败:', error);
      Message.error('更新笔记失败');
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteNote = async (noteId: string) => {
    isLoading.value = true;
    try {
      // 模拟删除笔记
      const index = notes.value.findIndex(note => note.id === noteId);
      if (index !== -1) {
        notes.value.splice(index, 1);
        Message.success('删除笔记成功');
        return true;
      }
      return false;
    } catch (error) {
      console.error('删除笔记失败:', error);
      Message.error('删除笔记失败');
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const toggleFavorite = async (noteId: string) => {
    const note = notes.value.find(note => note.id === noteId);
    if (!note) return false;
    
    return await updateNote(noteId, { isFavorite: !note.isFavorite });
  };

  const setFilter = (filter: string, tag?: string) => {
    currentFilter.value = filter;
    if (tag) {
      currentTag.value = tag;
    }
  };

  const setSortBy = (sort: string) => {
    sortBy.value = sort;
  };

  return {
    notes,
    isLoading,
    currentFilter,
    currentTag,
    sortBy,
    filteredNotes,
    fetchNotes,
    fetchNoteDetail,
    createNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    setFilter,
    setSortBy
  };
}); 