import { ITask } from './Task';

export interface ILoadingScreenProps {
  size?: number;
  color?: string;
  className?: string;
}

export interface IEmptyAnimationProps {
  title?: string;
  description?: string;
}

export interface ISortableTaskItemProps {
  task: ITask;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number | null) => void;
  isSelected: boolean;
  isEditing: boolean;
  onUpdateText: (id: number, text: string) => void;
  onClick: () => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
}
