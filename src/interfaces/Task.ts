export interface ITask {
  _id: number;
  text: string;
  completed: boolean;
}

export interface ITaskList {
  _id: string;
  title: string;
  completionPercentage: number;
  tasks: ITask[];
}
