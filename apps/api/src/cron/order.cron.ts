import cron from 'node-cron';
import {
  cancelExpiredOrders,
  autoReceiveOrders,
} from '@/services/order.service';

export function startOrderCronJobs() {
  // Cancel expired orders every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const canceledCount = await cancelExpiredOrders();
      console.log(
        `[${new Date().toISOString()}] Canceled ${canceledCount} expired orders`,
      );
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Error canceling expired orders:`,
        error,
      );
    }
  });

  // Auto-receive orders every hour
  cron.schedule('0 * * * *', async () => {
    try {
      const { autoConfirmedCount, autoCompletedCount } =
        await autoReceiveOrders();
      console.log(
        `[${new Date().toISOString()}] Auto-confirmed ${autoConfirmedCount} orders and auto-completed ${autoCompletedCount} orders`,
      );
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Error processing orders:`,
        error,
      );
    }
  });

  console.log(
    `[${new Date().toISOString()}] ====[ORDER CRON JOBS STARTED]====`,
  );
}
