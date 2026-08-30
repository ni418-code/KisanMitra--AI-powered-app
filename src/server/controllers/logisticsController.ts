import { Response } from 'express';
import { dataStore } from '../services/dataStore.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { LogisticsTask } from '../../types/index.ts';

export class LogisticsController {
  /**
   * Get logistics/storage tasks for current user (or all tasks for admin)
   */
  static async getTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    const tasks = req.user.role === 'admin' ? dataStore.getLogisticsTasks() : dataStore.getLogisticsTasks(req.user.id);
    res.json({ success: true, data: { tasks, total: tasks.length } });
  }

  /**
   * Create a transport or storage task. Status stays active until stored/driver-completed.
   */
  static async createTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { type, title, reference, driverName, vehicle, facility, pickup, drop, orderId } = req.body;

    if (!type || !title || !reference) {
      res.status(400).json({ success: false, message: 'type, title and reference are required.' });
      return;
    }

    const task: LogisticsTask = {
      id: `log-${Date.now()}`,
      orderId,
      type,
      title,
      reference,
      status: 'active',
      driverName,
      vehicle,
      facility,
      pickup,
      drop,
      userWhoCreated: req.user.id,
      createdAt: new Date().toISOString(),
    };

    const saved = dataStore.addLogisticsTask(task);
    res.status(201).json({ success: true, message: 'Logistics task created and will stay pinned until completed.', data: { task: saved } });
  }

  /**
   * Update a logistics task (mark stored / completed).
   */
  static async updateTaskStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const task = dataStore.getLogisticsTaskById(req.params.id);
    if (!task) {
      res.status(404).json({ success: false, message: 'Logistics task not found.' });
      return;
    }

    if (task.userWhoCreated !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Unauthorized to update this task.' });
      return;
    }

    const { status, notes } = req.body;
    const nextStatus = status === 'stored' ? 'stored' : 'completed';
    const updated = dataStore.updateLogisticsTask(task.id, { status: nextStatus, title: notes || task.title });

    res.json({ success: true, message: `Logistics task marked as ${nextStatus}.`, data: { task: updated } });
  }
}
