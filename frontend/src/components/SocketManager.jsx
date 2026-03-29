import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import socketService from '../services/socket';

const SocketManager = () => {
    useEffect(() => {
        socketService.connect();

        socketService.on('NEW_BILL', (data) => {
            toast.success(`Hóa đơn mới: ${data.MaHoaDon}\nSố tiền: ${data.TongTien.toLocaleString()}đ`, {
                duration: 5000,
                position: 'top-right',
                icon: '💰'
            });
        });

        socketService.on('NEW_NOTIFICATION', (data) => {
            toast.success(`Thông báo mới: ${data.TieuDe}`, {
                duration: 6000,
                position: 'top-right',
                icon: '📢'
            });
        });

        return () => socketService.disconnect();
    }, []);

    return <Toaster />;
};

export default SocketManager;
