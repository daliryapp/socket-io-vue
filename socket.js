import io from 'socket.io-client';
import { store } from '@/vuex/store';
import * as types from '@/vuex/types';
import moment from 'jalali-moment';


const socketLoad = (token, userID) => {
    const socket = io('https://youdomain-api.com');
    socket.on('connect', function () {
        socket.on('price', (data) => { // get price channel
            if (data && data.prices) {
                let now = moment();
                store.dispatch(types.SOCKET, { name: 'price', message: data.prices, isDisconnected: false, date: now.locale("en").format("YYYY-M-D hh:mm:ss") });
                store.dispatch(types.SOCKET_PRICE_DISCONNECTED, false);
            }
        });
        socket.on(`message.${userID}`, (data) => {// get message chanell
            let now = moment();
            store.dispatch(types.SOCKET, { name: 'messages', message: data.message, isDisconnected: false, date: now.locale("en").format("YYYY-M-D hh:mm:ss") });
            store.dispatch(types.SOCKET_PRICE_DISCONNECTED, false);
        });
        socket.emit('set_connection', { 'token': token, 'user': userID });
    });

    socket.on('disconnect', () => {
        store.dispatch(types.SOCKET, { name: 'socket', message: {}, isDisconnected: true, date: null });
        store.dispatch(types.SOCKET_PRICE_DISCONNECTED, true);
    });
    socket.on('error', (error) => {
        // console.log(error);
    });
    socket.on('connect_error', (error) => {
        store.dispatch(types.SOCKET, { name: 'socket', message: {}, isDisconnected: true, date: null });
        store.dispatch(types.SOCKET_PRICE_DISCONNECTED, true);
    });
}

export default { socketLoad };