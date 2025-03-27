/**
 * 任务优先级类型
 */
export type TaskPriority = 'low' | 'medium' | 'high';

/**
 * 任务接口
 */
export interface Task {
  /** 任务唯一标识 */
  id: string;
  
  /** 任务标题 */
  title: string;
  
  /** 任务完成状态 */
  completed: boolean;
  
  /** 任务截止日期 */
  dueDate?: Date;
  
  /** 任务优先级 */
  priority?: TaskPriority;
  
  /** 任务描述 */
  description?: string;
  
  /** 任务标签 */
  tags?: string[];
  
  /** 任务创建时间 */
  createdAt?: Date;
  
  /** 任务更新时间 */
  updatedAt?: Date;
}

/**
 * 任务过滤选项
 */
export interface TaskFilterOptions {
  /** 是否显示已完成任务 */
  showCompleted?: boolean;
  
  /** 按优先级过滤 */
  priority?: TaskPriority;
  
  /** 按标签过滤 */
  tag?: string;
  
  /** 按文本搜索 */
  searchText?: string;
}

export default Task; 