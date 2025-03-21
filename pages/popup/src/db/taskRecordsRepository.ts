import { historyDb, TaskHistory } from './model';

async function getAllTaskRecords() {
  return await historyDb.taskRecords.toArray();
}

async function findTaskRecordById(id: number) {
  return await historyDb.taskRecords.get(id);
}

async function deleteTaskRecordById(id: number) {
  updateTaskRecordById(id, { isVisitable: false });
}

async function updateTaskRecordById(id: number, taskRecord: Partial<Omit<TaskHistory, 'id'>>) {
  await historyDb.taskRecords.update(id, taskRecord);
}

async function addTaskRecord(taskRecord: Omit<TaskHistory, 'id'>) {
  await historyDb.taskRecords.add(taskRecord);
}

export { getAllTaskRecords, findTaskRecordById, deleteTaskRecordById, updateTaskRecordById, addTaskRecord };
