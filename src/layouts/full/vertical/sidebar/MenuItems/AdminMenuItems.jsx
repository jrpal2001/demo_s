import { IconAperture, IconClipboard, IconShoppingCart, IconUserCircle } from '@tabler/icons';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },

  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconAperture,
    href: '/admin/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Products',
    icon: IconShoppingCart,
    href: '/admin/products',
  },
  {
    id: uniqueId(),
    title: 'Users',
    icon: IconUserCircle,
    href: '/admin/users',
  },
  {
    id: uniqueId(),
    title: 'Job Cards',
    icon: IconClipboard,
    href: '/admin/job-cards',
  },
  {
    id: uniqueId(),
    title: 'Fabric QC Report',
    icon: IconClipboard,
    href: '/admin/fabric-qc-report',
  },
];

export default Menuitems;
