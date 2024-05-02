// assets
import { CalendarMonth, BackupTableOutlined, WalletOutlined } from '@mui/icons-material';

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'authentication',
  title: 'Stundensatzkalkulator',
  type: 'group',
  children: [
    {
      id: 'forms',
      title: 'Stundensatzkalkulator',
      type: 'item',
      url: '/office/form/overview',
      matchingUrlRegexp: /\/form\/[^/]{8,}$/,
      icon: BackupTableOutlined
    },
    {
      id: 'forms',
      title: 'Admin Dashboard',
      type: 'item',
      url: '/office/admin/dashboard',
      requiresAdmin: true,
      icon: BackupTableOutlined
    },
    {
      id: 'billing',
      title: 'Abonnement',
      type: 'item',
      url: '/office/billing',
      icon: WalletOutlined
    },
    {
      id: 'beratungstermin',
      title: 'Beratungstermine',
      type: 'item',
      url: '/office/events',
      icon: CalendarMonth
    }
  ]
};

export default pages;
