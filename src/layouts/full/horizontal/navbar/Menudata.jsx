import {
  IconHome,
  IconPoint,
  IconApps,
  IconClipboard,
  IconFileDescription,
  IconBorderAll,
  IconAlertCircle,
  IconSettings,
  IconLogin,
  IconUserPlus,
  IconRotate,
  IconZoomCode

} from '@tabler/icons';
import { uniqueId } from 'lodash';

const Menuitems = [
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome,
    href: '/dashboards/',
    children: [
      {
        id: uniqueId(),
        title: 'Modern',
        icon: IconPoint,
        href: '/dashboards/modern',
        chip: 'New',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'eCommerce',
        icon: IconPoint,
        href: '/dashboards/ecommerce',
      },
    ],
  },

];
export default Menuitems;
