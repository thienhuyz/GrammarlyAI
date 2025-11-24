import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from 'redux-persist'

const userConfig = {
    key: 'ai/user',
    storage,
    whitelist: ['isLoggedIn', 'token', 'current']
}

export const store = configureStore({
    reducer: {
        user: persistReducer(userConfig, userSlice),
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
