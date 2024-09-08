import cron from 'node-cron';
import {
  cancelExpiredOrders,
  autoReceiveOrders,
} from '@/services/order.service';

export function startOrderCronJobs() {
  cron.schedule('*/2 * * * *', async () => {
    try {
      const canceledCount = await cancelExpiredOrders();
      console.log(`Canceled ${canceledCount} expired orders`);
    } catch (error) {
      console.error(`Error canceling expired orders:`, error);
    }
  });

  cron.schedule('*/2 * * * *', async () => {
    try {
      const receivedCount = await autoReceiveOrders();
      console.log(`Auto-received ${receivedCount} orders`);
    } catch (error) {
      console.error(`Error auto-receiving orders:`, error);
    }
  });

  console.log('====[CRON JOBS STARTED]====');
}
