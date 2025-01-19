import { ToDo } from '@prisma/client';
import { Worker } from 'worker_threads';
import path from 'path';

export default function sortTodo(todos: ToDo[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, './../workers', 'sortTodoWorker.js'), {
      workerData: { todos },
    });

    worker.on('message', (message) => {
      if (message.error) {
        reject(new Error(message.error));
      } else {
        resolve(message);
      }
    });

    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}