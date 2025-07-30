import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  loading: boolean;
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  };
  dialog: {
    open: boolean;
    type: string;
    data: any;
  };
  drawer: {
    open: boolean;
    anchor: 'left' | 'right' | 'top' | 'bottom';
  };
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: 'light',
  loading: false,
  snackbar: {
    open: false,
    message: '',
    severity: 'info',
  },
  dialog: {
    open: false,
    type: '',
    data: null,
  },
  drawer: {
    open: false,
    anchor: 'left',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    showSnackbar: (state, action: PayloadAction<{ message: string; severity?: 'success' | 'error' | 'warning' | 'info' }>) => {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity || 'info',
      };
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },
    openDialog: (state, action: PayloadAction<{ type: string; data?: any }>) => {
      state.dialog = {
        open: true,
        type: action.payload.type,
        data: action.payload.data || null,
      };
    },
    closeDialog: (state) => {
      state.dialog = {
        open: false,
        type: '',
        data: null,
      };
    },
    openDrawer: (state, action: PayloadAction<{ anchor?: 'left' | 'right' | 'top' | 'bottom' }>) => {
      state.drawer = {
        open: true,
        anchor: action.payload.anchor || 'left',
      };
    },
    closeDrawer: (state) => {
      state.drawer.open = false;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleTheme,
  setTheme,
  setLoading,
  showSnackbar,
  hideSnackbar,
  openDialog,
  closeDialog,
  openDrawer,
  closeDrawer,
} = uiSlice.actions;

export default uiSlice.reducer; 